import { supabase } from '@/integrations/supabase/client';
import { notificationHelpers } from './notifications';
import { logProjectActivity, logAdminAction, getProjectIdFromOrder } from './activity-logger';
/**
 * Upload with retry logic (3 attempts with exponential backoff)
 */
async function uploadWithRetry(path, file, attempts = 3) {
    let lastError = null;
    for (let i = 0; i < attempts; i++) {
        try {
            const { data, error } = await supabase.storage
                .from('design-files')
                .upload(path, file, {
                cacheControl: '3600',
                upsert: false,
            });
            if (error)
                throw error;
            const { data: urlData } = supabase.storage
                .from('design-files')
                .getPublicUrl(data.path);
            return urlData.publicUrl;
        }
        catch (error) {
            lastError = error;
            console.error(`Upload attempt ${i + 1} failed:`, error);
            // Wait before retry (exponential backoff)
            if (i < attempts - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }
    throw lastError || new Error('Upload failed after all retry attempts');
}
/**
 * Upload design render images to storage with retry logic
 * @param orderId - Order ID
 * @param roomName - Room name for these renders
 * @param files - Array of files to upload
 * @returns Array of public URLs
 */
export async function uploadDesignRenders(orderId, roomName, files) {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const ext = file.name.split('.').pop() || 'jpg';
        const sanitizedRoom = roomName.replace(/\s+/g, '-').toLowerCase();
        const filename = `${orderId}/renders/${sanitizedRoom}-${i + 1}-${timestamp}-${random}.${ext}`;
        try {
            const url = await uploadWithRetry(filename, file);
            urls.push(url);
        }
        catch (error) {
            console.error('Upload error after retries:', error);
            throw error;
        }
    }
    return urls;
}
/**
 * Upload a document (budget, shopping list, vendor list)
 * @returns The public URL of the uploaded file
 */
export async function uploadDocument(orderId, file, type) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = file.name.split('.').pop() || 'pdf';
    const filename = `${orderId}/${type}/${type}-${timestamp}-${random}.${ext}`;
    try {
        const url = await uploadWithRetry(filename, file);
        return url;
    }
    catch (error) {
        throw new Error(`Failed to upload ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Save all design files to the order
 */
export async function saveDesignFiles(orderId, fileData, designerNotes) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        // Build design_files JSONB structure
        const designFiles = {
            renders: Object.entries(fileData.renders).map(([room, urls]) => ({
                room,
                files: urls.map(url => ({
                    url,
                    uploaded_at: new Date().toISOString(),
                })),
            })),
        };
        if (fileData.budgetUrl) {
            designFiles.budget = {
                url: fileData.budgetUrl,
                uploaded_at: new Date().toISOString(),
            };
        }
        if (fileData.shoppingListUrl) {
            designFiles.shopping_list = {
                url: fileData.shoppingListUrl,
                uploaded_at: new Date().toISOString(),
            };
        }
        if (fileData.vendorListUrl) {
            designFiles.vendor_list = {
                url: fileData.vendorListUrl,
                uploaded_at: new Date().toISOString(),
            };
        }
        // Count total files
        const filesCount = designFiles.renders.reduce((acc, r) => acc + r.files.length, 0) +
            (designFiles.budget ? 1 : 0) +
            (designFiles.shopping_list ? 1 : 0) +
            (designFiles.vendor_list ? 1 : 0);
        // Check if this is a revision (order status is revision_requested)
        const { data: currentOrder } = await supabase
            .from('orders')
            .select('status')
            .eq('id', orderId)
            .single();
        const isRevision = currentOrder?.status === 'revision_requested';
        // Update order - cast to JSON for Supabase
        const { error: updateError } = await supabase
            .from('orders')
            .update({
            design_files: JSON.parse(JSON.stringify(designFiles)),
            designer_notes: designerNotes,
            status: 'design_ready',
            design_delivered_at: new Date().toISOString(),
        })
            .eq('id', orderId);
        if (updateError) {
            return { success: false, error: updateError.message };
        }
        // If this was a revision, reset design_approvals to pending for re-review
        if (isRevision) {
            await supabase
                .from('design_approvals')
                .update({
                status: 'pending',
                feedback: null,
                updated_at: new Date().toISOString(),
            })
                .eq('order_id', orderId)
                .eq('status', 'changes_requested');
        }
        // Log delivery
        await supabase
            .from('design_delivery_log')
            .insert([{
                order_id: orderId,
                delivered_by: user?.id,
                files_count: filesCount,
                designer_notes: designerNotes,
                customer_notified_at: new Date().toISOString(),
            }]);
        // Notify customer
        const { data: order } = await supabase
            .from('orders')
            .select('user_id')
            .eq('id', orderId)
            .single();
        if (order?.user_id) {
            await notificationHelpers.onDesignReady(order.user_id, orderId, designFiles.renders.reduce((acc, r) => acc + r.files.length, 0));
        }
        return { success: true };
    }
    catch (error) {
        console.error('Failed to save design files:', error);
        return { success: false, error: 'Failed to save design files' };
    }
}
/**
 * Save design delivery with structured files object
 */
export async function saveDesignDelivery(orderId, designFiles, designerNotes) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        // Count total files
        const filesCount = designFiles.renders.reduce((acc, r) => acc + r.files.length, 0) +
            (designFiles.budget ? 1 : 0) +
            (designFiles.shopping_list ? 1 : 0) +
            (designFiles.vendor_list ? 1 : 0);
        // Update order
        const { error: updateError } = await supabase
            .from('orders')
            .update({
            design_files: JSON.parse(JSON.stringify(designFiles)),
            designer_notes: designerNotes,
            status: 'design_ready',
            design_delivered_at: new Date().toISOString(),
        })
            .eq('id', orderId);
        if (updateError) {
            return { success: false, error: updateError.message };
        }
        // Log delivery
        await supabase
            .from('design_delivery_log')
            .insert([{
                order_id: orderId,
                delivered_by: user?.id,
                files_count: filesCount,
                designer_notes: designerNotes,
                customer_notified_at: new Date().toISOString(),
            }]);
        // Notify customer
        const { data: order } = await supabase
            .from('orders')
            .select('user_id')
            .eq('id', orderId)
            .single();
        if (order?.user_id) {
            await notificationHelpers.onDesignReady(order.user_id, orderId, designFiles.renders.reduce((acc, r) => acc + r.files.length, 0));
        }
        // Log activity for admin visibility
        const projectId = await getProjectIdFromOrder(orderId);
        if (projectId) {
            await logProjectActivity({
                projectId,
                action: 'design_ready',
                description: `${filesCount} design files delivered`,
                metadata: { orderId, filesCount, hasNotes: !!designerNotes }
            });
            // Log admin action for audit trail
            await logAdminAction({
                action: 'design_delivery',
                details: { orderId, filesCount }
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error('Failed to save design delivery:', error);
        return { success: false, error: 'Failed to save design delivery' };
    }
}
/**
 * Validate image file
 */
export function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Only JPG and PNG files are allowed' };
    }
    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 25MB' };
    }
    return { valid: true };
}
/**
 * Validate document file
 */
export function validateDocumentFile(file) {
    const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Only PDF, Excel, and CSV files are allowed' };
    }
    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }
    return { valid: true };
}
/**
 * Get design files for an order
 */
export async function getDesignFiles(orderId) {
    try {
        const { data } = await supabase
            .from('orders')
            .select('design_files')
            .eq('id', orderId)
            .single();
        if (!data?.design_files)
            return null;
        return data.design_files;
    }
    catch {
        return null;
    }
}
