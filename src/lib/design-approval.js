import { supabase } from '@/integrations/supabase/client';
import { notificationHelpers } from './notifications';
import { logProjectActivity, getProjectIdFromOrder } from './activity-logger';
/**
 * Approve a single room design
 */
export async function approveRoom(orderId, roomName) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        // Upsert the approval
        const { error } = await supabase
            .from('design_approvals')
            .upsert({
            order_id: orderId,
            room_name: roomName,
            status: 'approved',
            approved_at: new Date().toISOString(),
            approved_by: user?.id,
        }, {
            onConflict: 'order_id,room_name'
        });
        if (error) {
            return { success: false, allApproved: false, error: error.message };
        }
        // Check if all rooms are now approved
        const status = await getApprovalStatus(orderId);
        if (status.allApproved) {
            // Update order to completed
            await supabase
                .from('orders')
                .update({
                all_designs_approved: true,
                approved_at: new Date().toISOString(),
                status: 'completed',
                completed_at: new Date().toISOString(),
            })
                .eq('id', orderId);
            // Send notification
            const { data: order } = await supabase
                .from('orders')
                .select('user_id')
                .eq('id', orderId)
                .single();
            if (order?.user_id) {
                await notificationHelpers.onProjectCompleted(order.user_id, orderId);
            }
            // Log project completed activity
            const projectId = await getProjectIdFromOrder(orderId);
            if (projectId) {
                await logProjectActivity({
                    projectId,
                    action: 'project_completed',
                    description: 'All designs approved - project completed',
                    metadata: { orderId }
                });
            }
        }
        return { success: true, allApproved: status.allApproved };
    }
    catch (error) {
        console.error('Failed to approve room:', error);
        return { success: false, allApproved: false, error: 'Failed to approve room' };
    }
}
/**
 * Approve all designs at once
 */
export async function approveAllDesigns(orderId) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        // Get the order to find all rooms
        const { data: order } = await supabase
            .from('orders')
            .select('selected_rooms, user_id, design_files')
            .eq('id', orderId)
            .single();
        if (!order) {
            return { success: false, error: 'Order not found' };
        }
        // Get rooms from design_files or selected_rooms
        let rooms = [];
        if (order.design_files && typeof order.design_files === 'object') {
            const designFiles = order.design_files;
            if (designFiles.renders) {
                rooms = designFiles.renders.map(r => r.room);
            }
        }
        if (rooms.length === 0 && order.selected_rooms) {
            rooms = order.selected_rooms;
        }
        // Create/update approvals for all rooms
        const approvals = rooms.map(room => ({
            order_id: orderId,
            room_name: room,
            status: 'approved',
            approved_at: new Date().toISOString(),
            approved_by: user?.id,
        }));
        if (approvals.length > 0) {
            const { error: approvalError } = await supabase
                .from('design_approvals')
                .upsert(approvals, {
                onConflict: 'order_id,room_name'
            });
            if (approvalError) {
                console.error('Approval error:', approvalError);
            }
        }
        // Update order status
        const { error: updateError } = await supabase
            .from('orders')
            .update({
            all_designs_approved: true,
            approved_at: new Date().toISOString(),
            status: 'completed',
            completed_at: new Date().toISOString(),
        })
            .eq('id', orderId);
        if (updateError) {
            return { success: false, error: updateError.message };
        }
        // Send completion notification
        if (order.user_id) {
            await notificationHelpers.onProjectCompleted(order.user_id, orderId);
        }
        // Log activity
        const projectId = await getProjectIdFromOrder(orderId);
        if (projectId) {
            await logProjectActivity({
                projectId,
                action: 'design_approved',
                description: `All ${rooms.length} rooms approved`,
                metadata: { orderId, roomsApproved: rooms.length }
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error('Failed to approve all designs:', error);
        return { success: false, error: 'Failed to approve designs' };
    }
}
/**
 * Request changes to a room design
 */
export async function requestRoomChanges(orderId, roomName, feedback) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        // Upsert the approval with changes_requested status
        const { error } = await supabase
            .from('design_approvals')
            .upsert({
            order_id: orderId,
            room_name: roomName,
            status: 'changes_requested',
            feedback,
            approved_by: user?.id,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'order_id,room_name'
        });
        if (error) {
            return { success: false, error: error.message };
        }
        // Get current revision count
        const { data: order } = await supabase
            .from('orders')
            .select('revision_count, user_id')
            .eq('id', orderId)
            .single();
        const newRevisionCount = (order?.revision_count || 0) + 1;
        // Update order status to revision_requested
        await supabase
            .from('orders')
            .update({
            status: 'revision_requested',
            revision_count: newRevisionCount,
        })
            .eq('id', orderId);
        // Send notification to customer confirming revision request
        if (order?.user_id) {
            await notificationHelpers.onRevisionReceived(order.user_id, orderId, feedback);
        }
        return { success: true };
    }
    catch (error) {
        console.error('Failed to request changes:', error);
        return { success: false, error: 'Failed to request changes' };
    }
}
// Alias for backwards compatibility
export const requestRevision = requestRoomChanges;
/**
 * Get approval status for an order
 */
export async function getApprovalStatus(orderId) {
    try {
        // Get order details including design files
        const { data: order } = await supabase
            .from('orders')
            .select('selected_rooms, design_files, all_designs_approved, approved_at')
            .eq('id', orderId)
            .single();
        // Get all approvals for this order
        const { data: approvals } = await supabase
            .from('design_approvals')
            .select('room_name, status, approved_at, feedback')
            .eq('order_id', orderId);
        // Build rooms list from design_files or selected_rooms
        let expectedRooms = [];
        if (order?.design_files && typeof order.design_files === 'object') {
            const designFiles = order.design_files;
            if (designFiles.renders) {
                expectedRooms = designFiles.renders.map(r => r.room);
            }
        }
        if (expectedRooms.length === 0 && order?.selected_rooms) {
            expectedRooms = order.selected_rooms;
        }
        // Map approvals
        const approvalMap = new Map((approvals || []).map(a => [a.room_name, a]));
        const rooms = expectedRooms.map(roomName => {
            const approval = approvalMap.get(roomName);
            return {
                room_name: roomName,
                status: approval?.status || 'pending',
                approved_at: approval?.approved_at || undefined,
                feedback: approval?.feedback || undefined,
            };
        });
        const allApproved = order?.all_designs_approved ||
            (rooms.length > 0 && rooms.every(r => r.status === 'approved'));
        return {
            rooms,
            allApproved,
            completedAt: order?.approved_at || undefined,
        };
    }
    catch (error) {
        console.error('Failed to get approval status:', error);
        return {
            rooms: [],
            allApproved: false,
        };
    }
}
