import { supabase } from '@/integrations/supabase/client';
export async function sendNotification(payload) {
    try {
        const { data, error } = await supabase.functions.invoke('send-notification', {
            body: payload,
        });
        if (error)
            throw error;
        console.log('✅ Notification sent:', payload.type);
        return { success: true, data };
    }
    catch (error) {
        console.error('❌ Notification failed:', error);
        return { success: false, error };
    }
}
// Helper functions for common notification scenarios
export const notificationHelpers = {
    // Payment & Order notifications
    onPaymentSuccess: async (userId, projectId, orderId) => {
        return sendNotification({
            userId,
            projectId,
            orderId,
            type: 'welcome',
            channel: 'both',
        });
    },
    onIntakeReminder: async (userId, projectId) => {
        return sendNotification({
            userId,
            projectId,
            type: 'intake_reminder',
            channel: 'both',
        });
    },
    // Discovery call notifications
    onDiscoveryCallScheduled: async (userId, projectId, callDetails) => {
        return sendNotification({
            userId,
            projectId,
            type: 'discovery_call_confirmation',
            channel: 'both',
            data: callDetails,
        });
    },
    onDiscoveryCallReminder: async (userId, projectId, hoursUntil) => {
        return sendNotification({
            userId,
            projectId,
            type: 'discovery_call_reminder',
            channel: hoursUntil === 1 ? 'whatsapp' : 'both',
            data: { hoursUntil },
        });
    },
    // Design workflow notifications
    onDesignWorkStarted: async (userId, projectId) => {
        return sendNotification({
            userId,
            projectId,
            type: 'design_work_started',
            channel: 'both',
        });
    },
    onDesignReady: async (userId, projectId, rendersCount) => {
        return sendNotification({
            userId,
            projectId,
            type: 'design_ready',
            channel: 'both',
            data: { rendersCount },
        });
    },
    onConceptReady: async (userId, projectId, designerName) => {
        return sendNotification({
            userId,
            projectId,
            type: 'concept_ready',
            channel: 'both',
            data: { designerName },
        });
    },
    onRendersReady: async (userId, projectId, rendersCount) => {
        return sendNotification({
            userId,
            projectId,
            type: 'renders_ready',
            channel: 'both',
            data: { rendersCount },
        });
    },
    onBudgetReady: async (userId, projectId, totalBudget) => {
        return sendNotification({
            userId,
            projectId,
            type: 'budget_ready',
            channel: 'both',
            data: { totalBudget },
        });
    },
    onVendorsReady: async (userId, projectId) => {
        return sendNotification({
            userId,
            projectId,
            type: 'vendors_ready',
            channel: 'both',
        });
    },
    onDeliveryComplete: async (userId, projectId) => {
        await sendNotification({
            userId,
            projectId,
            type: 'delivery_complete',
            channel: 'both',
        });
        // Schedule feedback request (1 hour delay - handled client-side for demo)
        setTimeout(async () => {
            await sendNotification({
                userId,
                projectId,
                type: 'feedback_request',
                channel: 'email',
            });
        }, 3600000); // 1 hour
    },
    onProjectCompleted: async (userId, projectId) => {
        return sendNotification({
            userId,
            projectId,
            type: 'project_completed',
            channel: 'both',
        });
    },
    onDesignApproved: async (userId, projectId) => {
        return sendNotification({
            userId,
            projectId,
            type: 'design_approved',
            channel: 'both',
        });
    },
    // Revision notifications
    onRevisionReceived: async (userId, projectId, revisionNotes) => {
        return sendNotification({
            userId,
            projectId,
            type: 'revision_received',
            channel: 'email',
            data: { revisionNotes },
        });
    },
    // Support notifications
    onSupportTicketCreated: async (userId, ticketId, subject) => {
        return sendNotification({
            userId,
            type: 'support_ticket',
            channel: 'email',
            data: { ticketId, subject },
        });
    },
    onPaymentFailed: async (userId, errorMessage) => {
        return sendNotification({
            userId,
            type: 'payment_failed',
            channel: 'email',
            data: { errorMessage },
        });
    },
    sendReminder: async (userId, projectId, action) => {
        return sendNotification({
            userId,
            projectId,
            type: 'reminder',
            channel: 'whatsapp',
            data: { action },
        });
    },
    // Admin notifications
    notifyAdminNewOrder: async (adminUserId, orderId, orderDetails) => {
        return sendNotification({
            userId: adminUserId,
            orderId,
            type: 'admin_new_order',
            channel: 'email',
            data: orderDetails,
        });
    },
    notifyAdminRevisionRequest: async (adminUserId, projectId, revisionDetails) => {
        return sendNotification({
            userId: adminUserId,
            projectId,
            type: 'admin_revision_request',
            channel: 'email',
            data: revisionDetails,
        });
    },
};
// Email logging function
export async function logEmail(params) {
    try {
        const { error } = await supabase
            .from('email_logs')
            .insert([{
                order_id: params.orderId || null,
                user_id: params.userId || null,
                email_type: params.emailType,
                recipient: params.recipient,
                subject: params.subject,
                status: params.status,
                provider_message_id: params.providerMessageId || null,
                error_message: params.errorMessage || null,
                metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : {},
            }]);
        if (error) {
            console.error('Failed to log email:', error);
        }
    }
    catch (error) {
        console.error('Email logging error:', error);
    }
}
