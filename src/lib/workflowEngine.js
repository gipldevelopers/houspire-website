import { supabase } from '@/integrations/supabase/client';
import { analytics } from './analytics';
// Workflow State Machine Definition
export const WORKFLOW_STATES = {
    payment_pending: {
        displayName: 'Payment Pending',
        userMessage: 'Complete your payment to start your project',
        adminMessage: 'User has not completed payment',
        nextPhases: ['payment_completed', 'project_cancelled'],
        requiredActions: ['complete_payment'],
        followUpActions: [
            { type: 'email', template: 'payment_reminder_1h', delay_hours: 1, priority: 'normal' },
            { type: 'whatsapp', template: 'payment_reminder_24h', delay_hours: 24, priority: 'high' },
            { type: 'admin_task', template: 'follow_up_abandoned_cart', delay_hours: 48, priority: 'high' }
        ],
        dropoffRisk: 'critical',
        phaseNumber: 0
    },
    payment_completed: {
        displayName: 'Payment Received',
        userMessage: 'Payment successful! Complete your design brief',
        adminMessage: 'Payment received, waiting for intake',
        nextPhases: ['intake_pending'],
        requiredActions: ['navigate_to_intake'],
        followUpActions: [
            { type: 'email', channel: 'both', template: 'payment_success_welcome', delay_hours: 0, priority: 'normal' }
        ],
        dropoffRisk: 'none',
        phaseNumber: 1
    },
    intake_pending: {
        displayName: 'Design Brief Pending',
        userMessage: 'Share your room details to get started',
        adminMessage: 'User has not submitted intake form',
        nextPhases: ['intake_submitted', 'project_expired'],
        requiredActions: ['complete_intake_form'],
        followUpActions: [
            { type: 'email', template: 'intake_reminder_6h', delay_hours: 6, priority: 'normal' },
            { type: 'whatsapp', template: 'intake_reminder_24h', delay_hours: 24, priority: 'high' },
            { type: 'admin_task', template: 'call_user_intake_help', delay_hours: 48, priority: 'urgent' }
        ],
        dropoffRisk: 'high',
        phaseNumber: 1
    },
    intake_submitted: {
        displayName: 'Design Brief Received',
        userMessage: 'Your designer is working on your space!',
        adminMessage: 'Intake received, assign to designer',
        nextPhases: ['design_in_progress'],
        requiredActions: ['admin_assign_designer'],
        followUpActions: [
            { type: 'email', channel: 'both', template: 'intake_confirmation', delay_hours: 0, priority: 'normal' },
            { type: 'admin_task', template: 'assign_to_designer_urgent', delay_hours: 2, priority: 'urgent' }
        ],
        dropoffRisk: 'none',
        phaseNumber: 2
    },
    design_in_progress: {
        displayName: 'Design in Progress',
        userMessage: 'Your designer is creating your 3D renders',
        adminMessage: 'Designer working on concepts',
        nextPhases: ['design_ready', 'project_expired'],
        requiredActions: ['admin_upload_concepts'],
        followUpActions: [
            { type: 'email', template: 'design_progress_update_24h', delay_hours: 24, priority: 'low' },
            { type: 'admin_task', template: 'check_design_progress', delay_hours: 48, priority: 'high' },
            { type: 'admin_task', template: 'urgent_timer_warning', delay_hours: 60, priority: 'urgent' }
        ],
        dropoffRisk: 'medium',
        phaseNumber: 2
    },
    design_ready: {
        displayName: 'Concepts Ready',
        userMessage: 'Your design concepts are ready to view!',
        adminMessage: 'Concepts uploaded, waiting for user feedback',
        nextPhases: ['feedback_pending'],
        requiredActions: ['user_view_concepts'],
        followUpActions: [
            { type: 'email', channel: 'both', template: 'concepts_ready_notification', delay_hours: 0, priority: 'urgent' },
            { type: 'whatsapp', template: 'concepts_ready_reminder', delay_hours: 6, priority: 'high' }
        ],
        dropoffRisk: 'low',
        phaseNumber: 3
    },
    feedback_pending: {
        displayName: 'Awaiting Your Feedback',
        userMessage: 'Review your concepts and share your thoughts',
        adminMessage: 'User viewing concepts, waiting for feedback',
        nextPhases: ['feedback_submitted', 'delivery_ready'],
        requiredActions: ['submit_feedback'],
        followUpActions: [
            { type: 'email', template: 'feedback_reminder_12h', delay_hours: 12, priority: 'normal' },
            { type: 'whatsapp', template: 'feedback_reminder_24h', delay_hours: 24, priority: 'high' },
            { type: 'admin_task', template: 'call_user_feedback', delay_hours: 48, priority: 'high' }
        ],
        dropoffRisk: 'high',
        phaseNumber: 3
    },
    feedback_submitted: {
        displayName: 'Feedback Received',
        userMessage: "Thank you! We're incorporating your feedback",
        adminMessage: 'Feedback received, designer working on revisions',
        nextPhases: ['revision_in_progress', 'delivery_ready'],
        requiredActions: ['admin_review_feedback'],
        followUpActions: [
            { type: 'email', template: 'feedback_confirmation', delay_hours: 0, priority: 'normal' }
        ],
        dropoffRisk: 'none',
        phaseNumber: 4
    },
    revision_in_progress: {
        displayName: 'Revisions in Progress',
        userMessage: 'Your designer is refining the concepts',
        adminMessage: 'Designer working on revisions',
        nextPhases: ['revision_ready'],
        requiredActions: ['admin_upload_revisions'],
        followUpActions: [
            { type: 'admin_task', template: 'check_revision_progress', delay_hours: 24, priority: 'high' }
        ],
        dropoffRisk: 'low',
        phaseNumber: 4
    },
    revision_ready: {
        displayName: 'Revisions Ready',
        userMessage: 'Updated concepts are ready for your review',
        adminMessage: 'Revisions uploaded, waiting for approval',
        nextPhases: ['feedback_pending', 'delivery_ready'],
        requiredActions: ['user_approve_revisions'],
        followUpActions: [
            { type: 'email', channel: 'both', template: 'revisions_ready', delay_hours: 0, priority: 'high' }
        ],
        dropoffRisk: 'medium',
        phaseNumber: 5
    },
    delivery_ready: {
        displayName: 'Package Ready',
        userMessage: 'Your complete design package is ready to download!',
        adminMessage: 'Package generated, waiting for user download',
        nextPhases: ['project_completed'],
        requiredActions: ['user_download_package'],
        followUpActions: [
            { type: 'email', channel: 'both', template: 'delivery_package_ready', delay_hours: 0, priority: 'high' },
            { type: 'email', template: 'download_reminder', delay_hours: 24, priority: 'normal' }
        ],
        dropoffRisk: 'low',
        phaseNumber: 6
    },
    project_completed: {
        displayName: 'Project Completed',
        userMessage: 'Congratulations! Your project is complete',
        adminMessage: 'Project successfully completed',
        nextPhases: [],
        requiredActions: [],
        followUpActions: [
            { type: 'email', template: 'project_completion_survey', delay_hours: 24, priority: 'low' },
            { type: 'email', template: 'referral_request', delay_hours: 72, priority: 'low' }
        ],
        dropoffRisk: 'none',
        phaseNumber: 6
    },
    project_expired: {
        displayName: 'Project Expired',
        userMessage: 'Timeline expired. Please contact support',
        adminMessage: 'Project expired - refund required',
        nextPhases: [],
        requiredActions: ['admin_process_refund'],
        followUpActions: [
            { type: 'admin_task', template: 'process_refund_urgent', delay_hours: 0, priority: 'urgent' },
            { type: 'email', channel: 'both', template: 'apology_refund_info', delay_hours: 1, priority: 'urgent' }
        ],
        dropoffRisk: 'critical',
        phaseNumber: 6
    },
    project_cancelled: {
        displayName: 'Project Cancelled',
        userMessage: 'Project cancelled',
        adminMessage: 'User cancelled project',
        nextPhases: [],
        requiredActions: [],
        followUpActions: [
            { type: 'email', template: 'cancellation_survey', delay_hours: 24, priority: 'low' }
        ],
        dropoffRisk: 'critical',
        phaseNumber: 6
    }
};
// Workflow Engine Functions
export function getWorkflowState(phase) {
    return WORKFLOW_STATES[phase];
}
export function getNextActions(phase) {
    return WORKFLOW_STATES[phase].requiredActions;
}
export function getDropoffRisk(phase) {
    return WORKFLOW_STATES[phase].dropoffRisk;
}
export function shouldTriggerFollowUp(phase, lastActivity, now = new Date()) {
    const state = WORKFLOW_STATES[phase];
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    return state.followUpActions.filter(action => {
        return hoursSinceActivity >= action.delay_hours;
    });
}
export function getTimeSinceActivity(updatedAt) {
    const now = new Date();
    const updated = new Date(updatedAt);
    const hours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));
    if (hours < 1)
        return 'Just now';
    if (hours < 24)
        return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
export function getHoursSinceActivity(updatedAt) {
    const now = new Date();
    const updated = new Date(updatedAt);
    return (now.getTime() - updated.getTime()) / (1000 * 60 * 60);
}
export async function logWorkflowEvent(event) {
    try {
        const insertData = {
            project_id: event.project_id,
            user_id: event.user_id,
            phase: event.phase,
            trigger_event: event.trigger_event,
            metadata: event.metadata || {},
        };
        const { error } = await supabase
            .from('workflow_events')
            .insert(insertData);
        if (error) {
            console.error('Failed to log workflow event:', error);
            return;
        }
        // Track in analytics
        analytics.track('workflow_transition', {
            project_id: event.project_id,
            to_phase: event.phase,
            trigger: event.trigger_event,
        });
    }
    catch (err) {
        console.error('Error logging workflow event:', err);
    }
}
export async function transitionWorkflow(projectId, userId, newPhase, trigger) {
    try {
        // Update project workflow phase
        const { error: updateError } = await supabase
            .from('projects')
            .update({
            workflow_phase: newPhase,
            last_activity_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .eq('id', projectId);
        if (updateError) {
            console.error('Failed to update workflow phase:', updateError);
            return false;
        }
        // Log the event
        await logWorkflowEvent({
            project_id: projectId,
            user_id: userId,
            phase: newPhase,
            trigger_event: trigger,
            metadata: { previous_trigger: trigger }
        });
        return true;
    }
    catch (err) {
        console.error('Error transitioning workflow:', err);
        return false;
    }
}
