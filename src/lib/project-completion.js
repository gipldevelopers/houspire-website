import { appDataClient } from '@/lib/static-client';
import { notificationHelpers } from './notifications';
/**
 * Complete project when all rooms are approved
 */
export async function completeProject(orderId) {
    try {
        // Update order status to completed
        const { error: updateError } = await appDataClient
            .from('orders')
            .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            all_designs_approved: true
        })
            .eq('id', orderId);
        if (updateError)
            throw updateError;
        // Get order details for notification
        const { data: order } = await appDataClient
            .from('orders')
            .select('user_id, order_number')
            .eq('id', orderId)
            .single();
        // Send completion notification
        if (order?.user_id) {
            try {
                await notificationHelpers.onProjectCompleted(order.user_id, orderId);
            }
            catch (emailError) {
                console.error('Failed to send completion notification:', emailError);
                // Don't fail the completion if notification fails
            }
        }
        return { success: true };
    }
    catch (error) {
        console.error('Error completing project:', error);
        return { success: false, error: error.message };
    }
}
/**
 * Check if project is ready for completion (all rooms approved)
 */
export async function isProjectReadyForCompletion(orderId) {
    const { data: approvals, error } = await appDataClient
        .from('design_approvals')
        .select('status')
        .eq('order_id', orderId);
    if (error || !approvals || approvals.length === 0)
        return false;
    return approvals.every(approval => approval.status === 'approved');
}
/**
 * Get completion details for an order
 */
export async function getCompletionDetails(orderId) {
    const { data: order } = await appDataClient
        .from('orders')
        .select('status, completed_at, all_designs_approved')
        .eq('id', orderId)
        .single();
    const { data: approvals } = await appDataClient
        .from('design_approvals')
        .select('status')
        .eq('order_id', orderId);
    const approvedRooms = approvals?.filter(a => a.status === 'approved').length || 0;
    const totalRooms = approvals?.length || 0;
    return {
        isCompleted: order?.status === 'completed' || order?.all_designs_approved === true,
        completedAt: order?.completed_at || undefined,
        approvedRooms,
        totalRooms
    };
}
/**
 * Handle project completion after all designs approved
 */
export async function handleProjectCompletion(orderId) {
    const isReady = await isProjectReadyForCompletion(orderId);
    if (!isReady) {
        return false;
    }
    const result = await completeProject(orderId);
    return result.success;
}
/**
 * Download all design files as a batch
 */
export function downloadAllFiles(designFiles) {
    const urls = [];
    // Collect render URLs
    if (designFiles.renders) {
        designFiles.renders.forEach(room => {
            room.files.forEach(file => {
                urls.push(file.url);
            });
        });
    }
    // Collect document URLs
    if (designFiles.budget?.url)
        urls.push(designFiles.budget.url);
    if (designFiles.shopping_list?.url)
        urls.push(designFiles.shopping_list.url);
    if (designFiles.vendor_list?.url)
        urls.push(designFiles.vendor_list.url);
    // Download each file (browsers may block multiple downloads, so we open in new tabs)
    urls.forEach((url, index) => {
        setTimeout(() => {
            window.open(url, '_blank');
        }, index * 300); // Stagger downloads to avoid browser blocking
    });
    return urls.length;
}

