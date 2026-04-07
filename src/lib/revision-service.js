import { appDataClient } from '@/lib/static-client';
import { notificationHelpers } from './notifications';
import { logProjectActivity, getProjectIdFromOrder } from './activity-logger';
/**
 * Check if user can request a revision for an order
 */
export async function canRequestRevision(orderId) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user) {
            return { allowed: false, reason: 'User not authenticated' };
        }
        // Get order details
        const { data: order, error } = await appDataClient
            .from('orders')
            .select('id, status, revision_count, user_id')
            .eq('id', orderId)
            .eq('user_id', user.id)
            .single();
        if (error || !order) {
            return { allowed: false, reason: 'Order not found' };
        }
        // Check order status
        if (order.status === 'revision_requested') {
            return {
                allowed: false,
                reason: 'A revision request is already being processed'
            };
        }
        if (order.status !== 'design_ready' && order.status !== 'revision_completed') {
            return {
                allowed: false,
                reason: 'Order is not in a state that allows revisions'
            };
        }
        // Default to 2 revisions if not specified
        const revisionsUsed = order.revision_count || 0;
        const revisionsIncluded = 2; // Could be enhanced to read from package
        const revisionsRemaining = revisionsIncluded - revisionsUsed;
        if (revisionsRemaining <= 0) {
            return {
                allowed: false,
                reason: 'No revisions remaining in your package',
                revisionsRemaining: 0
            };
        }
        return { allowed: true, revisionsRemaining };
    }
    catch (error) {
        console.error('Error checking revision eligibility:', error);
        return { allowed: false, reason: 'Failed to check eligibility' };
    }
}
/**
 * Submit a revision request for an order
 */
export async function submitRevisionRequest(orderId, roomsAffected, changesRequested, referenceImages) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        // Get order details and current revision count
        const { data: order, error: orderError } = await appDataClient
            .from('orders')
            .select('revision_count, user_id, order_number')
            .eq('id', orderId)
            .single();
        if (orderError || !order) {
            return { success: false, error: 'Order not found' };
        }
        const newRevisionNumber = (order.revision_count || 0) + 1;
        // Update order status
        const { error: updateError } = await appDataClient
            .from('orders')
            .update({
            status: 'revision_requested',
            revision_count: newRevisionNumber,
        })
            .eq('id', orderId);
        if (updateError) {
            return { success: false, error: updateError.message };
        }
        // Create design_approvals entries for affected rooms with changes_requested status
        for (const room of roomsAffected) {
            await appDataClient
                .from('design_approvals')
                .upsert({
                order_id: orderId,
                room_name: room,
                status: 'changes_requested',
                feedback: changesRequested[room] || 'Changes requested',
                approved_by: user.id,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'order_id,room_name'
            });
        }
        // Send confirmation email to customer
        await notificationHelpers.onRevisionReceived(order.user_id, orderId, Object.values(changesRequested).join('; '));
        // Notify admin about revision request
        const { data: admins } = await appDataClient
            .from('user_roles')
            .select('user_id')
            .eq('role', 'admin')
            .limit(5);
        if (admins && admins.length > 0) {
            await notificationHelpers.notifyAdminRevisionRequest(admins[0].user_id, orderId, {
                orderNumber: order.order_number,
                revisionNumber: newRevisionNumber,
                roomsAffected,
                changesRequested,
            });
        }
        // Log activity for admin visibility
        const projectId = await getProjectIdFromOrder(orderId);
        if (projectId) {
            await logProjectActivity({
                projectId,
                action: 'revision_requested',
                description: `Revision #${newRevisionNumber} requested for ${roomsAffected.length} room(s)`,
                metadata: { orderId, revisionNumber: newRevisionNumber, roomsAffected }
            });
        }
        return { success: true, revisionNumber: newRevisionNumber };
    }
    catch (error) {
        console.error('Failed to submit revision request:', error);
        return { success: false, error: 'Failed to submit revision request' };
    }
}
/**
 * Get revision history for an order (from design_approvals)
 */
export async function getRevisionHistory(orderId) {
    try {
        const { data: approvals } = await appDataClient
            .from('design_approvals')
            .select('room_name, status, feedback, updated_at')
            .eq('order_id', orderId)
            .order('updated_at', { ascending: false });
        const changesRequested = (approvals || []).filter(a => a.status === 'changes_requested');
        return {
            revisions: (approvals || []).map(a => ({
                room: a.room_name,
                status: a.status || 'pending',
                feedback: a.feedback || undefined,
                updated_at: a.updated_at || new Date().toISOString(),
            })),
            totalCount: changesRequested.length,
        };
    }
    catch (error) {
        console.error('Failed to get revision history:', error);
        return { revisions: [], totalCount: 0 };
    }
}
/**
 * Get full revision requests for a project
 */
export async function getRevisionRequests(projectId) {
    try {
        const { data, error } = await appDataClient
            .from('revision_requests')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Failed to get revision requests:', error);
            return [];
        }
        return (data || []);
    }
    catch (error) {
        console.error('Failed to get revision requests:', error);
        return [];
    }
}
/**
 * Get revision requests for an order by user_id
 */
export async function getRevisionRequestsByOrderId(orderId) {
    try {
        const { data: order, error: orderError } = await appDataClient
            .from('orders')
            .select('user_id')
            .eq('id', orderId)
            .single();
        if (orderError || !order?.user_id) {
            return [];
        }
        // Get revision requests for this user (as we don't have project_id on orders)
        const { data, error } = await appDataClient
            .from('revision_requests')
            .select('*')
            .eq('user_id', order.user_id)
            .order('created_at', { ascending: false })
            .limit(10);
        if (error)
            return [];
        return (data || []);
    }
    catch (error) {
        console.error('Failed to get revision requests by order:', error);
        return [];
    }
}
/**
 * Complete a revision (admin action) - called when revised designs are uploaded
 */
export async function completeRevision(orderId, roomsCompleted) {
    try {
        // Get all rooms with changes_requested status
        const { data: pendingApprovals } = await appDataClient
            .from('design_approvals')
            .select('room_name')
            .eq('order_id', orderId)
            .eq('status', 'changes_requested');
        const roomsToUpdate = roomsCompleted || (pendingApprovals || []).map(a => a.room_name);
        // Update the affected rooms back to pending for review
        for (const room of roomsToUpdate) {
            await appDataClient
                .from('design_approvals')
                .update({
                status: 'pending',
                feedback: null, // Clear previous feedback
                updated_at: new Date().toISOString(),
            })
                .eq('order_id', orderId)
                .eq('room_name', room);
        }
        // Update order status back to design_ready
        await appDataClient
            .from('orders')
            .update({
            status: 'design_ready',
            design_delivered_at: new Date().toISOString(),
        })
            .eq('id', orderId);
        // Notify customer that revised designs are ready
        const { data: order } = await appDataClient
            .from('orders')
            .select('user_id')
            .eq('id', orderId)
            .single();
        if (order?.user_id) {
            await notificationHelpers.onDesignReady(order.user_id, orderId);
        }
        return { success: true };
    }
    catch (error) {
        console.error('Failed to complete revision:', error);
        return { success: false, error: 'Failed to complete revision' };
    }
}
/**
 * Check if order has pending revision
 */
export async function hasPendingRevision(orderId) {
    const { data: order } = await appDataClient
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();
    return order?.status === 'revision_requested';
}
/**
 * Get pending revisions count for admin dashboard
 */
export async function getPendingRevisionsCount() {
    try {
        const { data: orders } = await appDataClient
            .from('orders')
            .select('id, updated_at')
            .eq('status', 'revision_requested');
        if (!orders)
            return { pending: 0, overdue: 0 };
        const now = new Date();
        const overdue = orders.filter(order => {
            const requestedAt = new Date(order.updated_at || now);
            const deadline = new Date(requestedAt);
            deadline.setHours(deadline.getHours() + 72);
            return now > deadline;
        });
        return {
            pending: orders.length,
            overdue: overdue.length
        };
    }
    catch (error) {
        console.error('Failed to get pending revisions count:', error);
        return { pending: 0, overdue: 0 };
    }
}
/**
 * Upload reference images for a revision
 */
export async function uploadRevisionImages(orderId, files) {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `${orderId}/revision-refs/ref-${i + 1}-${timestamp}-${random}.${ext}`;
        const { data, error } = await appDataClient.storage
            .from('design-files')
            .upload(filename, file, {
            cacheControl: '3600',
            upsert: false,
        });
        if (error) {
            console.error('Upload error:', error);
            continue;
        }
        const { data: { publicUrl } } = appDataClient.storage
            .from('design-files')
            .getPublicUrl(data.path);
        urls.push(publicUrl);
    }
    return urls;
}
/**
 * Calculate revisions remaining for an order
 */
export async function getRevisionsRemaining(orderId) {
    const { data: order } = await appDataClient
        .from('orders')
        .select('revision_count')
        .eq('id', orderId)
        .single();
    if (!order)
        return 0;
    const revisionsIncluded = 2; // Default, could be from package
    const revisionsUsed = order.revision_count || 0;
    return Math.max(0, revisionsIncluded - revisionsUsed);
}

