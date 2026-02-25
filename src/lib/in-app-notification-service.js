import { supabase } from '@/integrations/supabase/client';
/**
 * Create in-app notification
 */
export async function createInAppNotification(params) {
    try {
        const { error } = await supabase
            .from('in_app_notifications')
            .insert({
            user_id: params.userId,
            title: params.title,
            message: params.message,
            type: params.type,
            action_url: params.actionUrl,
            action_text: params.actionText,
            read: false
        });
        if (error)
            throw error;
        return true;
    }
    catch (error) {
        console.error('Error creating notification:', error);
        return false;
    }
}
// Helper functions for common notifications
export async function notifyDesignReady(userId, orderId) {
    return createInAppNotification({
        userId,
        title: 'Your Designs Are Ready! 🎨',
        message: 'Your designer has uploaded new design concepts for your review.',
        type: 'success',
        actionUrl: `/dashboard/projects/${orderId}/review`,
        actionText: 'View Designs'
    });
}
export async function notifyDesignerAssigned(userId, orderId, designerName) {
    return createInAppNotification({
        userId,
        title: 'Designer Assigned 👨‍🎨',
        message: `${designerName} has been assigned to your project and will start working soon.`,
        type: 'update',
        actionUrl: `/dashboard/orders/${orderId}`,
        actionText: 'View Order'
    });
}
export async function notifyNewMessage(userId, roomId, senderName) {
    return createInAppNotification({
        userId,
        title: 'New Message 💬',
        message: `${senderName} sent you a message`,
        type: 'info',
        actionUrl: `/dashboard/chat`,
        actionText: 'View Message'
    });
}
export async function notifyRevisionCompleted(userId, orderId) {
    return createInAppNotification({
        userId,
        title: 'Revisions Ready ✨',
        message: 'Your designer has completed the revisions you requested.',
        type: 'success',
        actionUrl: `/dashboard/projects/${orderId}/review`,
        actionText: 'Review Revisions'
    });
}
export async function notifyPaymentReceived(userId, orderId, amount) {
    return createInAppNotification({
        userId,
        title: 'Payment Received 💳',
        message: `We've received your payment of ₹${amount.toLocaleString('en-IN')}. Your project is confirmed!`,
        type: 'success',
        actionUrl: `/dashboard/orders/${orderId}`,
        actionText: 'View Order'
    });
}
export async function notifyCallScheduled(userId, orderId, callDate) {
    return createInAppNotification({
        userId,
        title: 'Discovery Call Scheduled 📅',
        message: `Your consultation is scheduled for ${callDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        type: 'success',
        actionUrl: `/dashboard/orders/${orderId}`,
        actionText: 'View Details'
    });
}
export async function notifyProjectCompleted(userId, projectId) {
    return createInAppNotification({
        userId,
        title: 'Project Completed! 🎉',
        message: 'Congratulations! Your design project is now complete. All files are ready for download.',
        type: 'success',
        actionUrl: `/dashboard/projects/${projectId}`,
        actionText: 'View Project'
    });
}
