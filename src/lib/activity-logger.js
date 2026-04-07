import { appDataClient } from '@/lib/static-client';
/**
 * Log an activity for a project
 */
export async function logProjectActivity(params) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        const { error } = await appDataClient
            .from('project_activity')
            .insert({
            project_id: params.projectId,
            action: params.action,
            description: params.description || getDefaultDescription(params.action),
            user_id: params.userId || user?.id,
            metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : null,
        });
        if (error) {
            console.error('Failed to log activity:', error);
            return false;
        }
        console.log('📝 Activity logged:', params.action, 'for project', params.projectId);
        return true;
    }
    catch (error) {
        console.error('Activity logging error:', error);
        return false;
    }
}
/**
 * Log an admin action for audit purposes
 */
export async function logAdminAction(params) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user) {
            console.error('No authenticated user for admin audit log');
            return false;
        }
        const { error } = await appDataClient
            .from('admin_audit_log')
            .insert({
            admin_user_id: user.id,
            action: params.action,
            target_user_id: params.targetUserId || null,
            details: params.details ? JSON.parse(JSON.stringify(params.details)) : null,
            reason: params.reason || null,
        });
        if (error) {
            console.error('Failed to log admin action:', error);
            return false;
        }
        console.log('🔒 Admin action logged:', params.action);
        return true;
    }
    catch (error) {
        console.error('Admin audit logging error:', error);
        return false;
    }
}
/**
 * Get project ID from order ID (for activity logging)
 */
export async function getProjectIdFromOrder(orderId) {
    try {
        const { data, error } = await appDataClient
            .from('orders')
            .select('design_files')
            .eq('id', orderId)
            .single();
        if (error || !data?.design_files)
            return null;
        const designFiles = data.design_files;
        return designFiles.project_id || null;
    }
    catch {
        return null;
    }
}
/**
 * Default descriptions for common actions
 */
function getDefaultDescription(action) {
    const descriptions = {
        order_placed: 'New order placed',
        payment_completed: 'Payment successfully completed',
        project_created: 'Project created from order',
        intake_submitted: 'Intake form submitted',
        discovery_call_scheduled: 'Discovery call scheduled',
        discovery_call_completed: 'Discovery call completed',
        designer_assigned: 'Designer assigned to project',
        design_started: 'Design work started',
        render_uploaded: 'Design render uploaded',
        concept_created: 'New design concept created',
        design_ready: 'Designs ready for review',
        revision_requested: 'Revision requested by customer',
        revision_submitted: 'Revision submitted by designer',
        design_approved: 'Design approved by customer',
        project_completed: 'Project completed',
        message_sent: 'New message sent',
        budget_updated: 'Budget updated',
        file_uploaded: 'File uploaded',
        timer_started: 'Project timer started',
        timer_paused: 'Project timer paused',
        phase_completed: 'Project phase completed',
        delivery_ready: 'Delivery package ready',
    };
    return descriptions[action] || 'Activity logged';
}

