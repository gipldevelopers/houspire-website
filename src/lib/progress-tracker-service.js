import { appDataClient } from '@/lib/static-client';
export const milestoneDefinitions = [
    {
        type: 'order_placed',
        label: 'Order Placed',
        description: 'Your order has been confirmed',
        icon: '🎉',
        estimatedDays: 0
    },
    {
        type: 'payment_confirmed',
        label: 'Payment Confirmed',
        description: 'Payment received successfully',
        icon: '💳',
        estimatedDays: 0
    },
    {
        type: 'discovery_call_scheduled',
        label: 'Discovery Call Scheduled',
        description: 'Schedule your consultation call',
        icon: '📅',
        estimatedDays: 1
    },
    {
        type: 'discovery_call_completed',
        label: 'Discovery Call',
        description: 'Attend your consultation call',
        icon: '📞',
        estimatedDays: 2
    },
    {
        type: 'designer_assigned',
        label: 'Designer Assigned',
        description: 'Your designer has been matched',
        icon: '👨‍🎨',
        estimatedDays: 1
    },
    {
        type: 'design_in_progress',
        label: 'Design in Progress',
        description: 'Your designer is working on concepts',
        icon: '🎨',
        estimatedDays: 5
    },
    {
        type: 'design_ready',
        label: 'Design Ready',
        description: 'Your designs are ready for review',
        icon: '📐',
        estimatedDays: 7
    },
    {
        type: 'review_requested',
        label: 'Review Requested',
        description: 'Please review your designs',
        icon: '👀',
        estimatedDays: 7
    },
    {
        type: 'revision_requested',
        label: 'Revision Requested',
        description: 'Revisions are being made',
        icon: '🔄',
        estimatedDays: 3
    },
    {
        type: 'revision_in_progress',
        label: 'Revision in Progress',
        description: 'Designer is working on revisions',
        icon: '✏️',
        estimatedDays: 3
    },
    {
        type: 'approved',
        label: 'Design Approved',
        description: 'Designs approved by you',
        icon: '✨',
        estimatedDays: 10
    },
    {
        type: 'completed',
        label: 'Order Completed',
        description: 'All deliverables provided',
        icon: '🎊',
        estimatedDays: 10
    }
];
/**
 * Get the logical order index for a milestone type
 */
function getMilestoneOrderIndex(type) {
    const index = milestoneDefinitions.findIndex(d => d.type === type);
    return index === -1 ? 999 : index;
}
/**
 * Get milestones for an order, sorted by logical workflow order
 */
export async function getOrderMilestones(orderId) {
    try {
        const { data, error } = await appDataClient
            .from('order_milestones')
            .select('*')
            .eq('order_id', orderId);
        if (error)
            throw error;
        // Sort by logical workflow order, not creation time
        const sorted = (data || []).sort((a, b) => {
            return getMilestoneOrderIndex(a.milestone_type) - getMilestoneOrderIndex(b.milestone_type);
        });
        return sorted;
    }
    catch (error) {
        console.error('Error fetching milestones:', error);
        return [];
    }
}
/**
 * Fetch order-level fields that affect milestone display.
 * This keeps the UI accurate even if milestone rows lag behind.
 */
export async function getOrderProgressState(orderId) {
    try {
        const { data, error } = await appDataClient
            .from('orders')
            .select('status, discovery_call_scheduled, discovery_call_completed_at, assigned_designer_id, design_files, all_designs_approved, completed_at')
            .eq('id', orderId)
            .single();
        if (error)
            throw error;
        return {
            status: data?.status ?? 'pending',
            discovery_call_scheduled: data?.discovery_call_scheduled ?? null,
            discovery_call_completed_at: data?.discovery_call_completed_at ?? null,
            assigned_designer_id: data?.assigned_designer_id ?? null,
            design_files: data?.design_files ?? null,
            all_designs_approved: data?.all_designs_approved ?? false,
            completed_at: data?.completed_at ?? null,
        };
    }
    catch {
        return null;
    }
}
/**
 * Derive milestone status from actual order data
 */
function deriveMilestoneStatus(milestoneType, state) {
    switch (milestoneType) {
        case 'order_placed':
            return 'completed'; // Always completed if order exists
        case 'payment_confirmed':
            return state.status === 'paid' ||
                state.status === 'in_progress' ||
                state.status === 'design_ready' ||
                state.status === 'completed'
                ? 'completed'
                : 'pending';
        case 'discovery_call_scheduled':
            if (!state.discovery_call_scheduled)
                return 'pending';
            return 'completed'; // If scheduled, this step is done
        case 'discovery_call_completed':
            if (state.discovery_call_completed_at)
                return 'completed';
            if (state.discovery_call_scheduled)
                return 'in_progress'; // Scheduled but not done
            return 'pending';
        case 'designer_assigned':
            return state.assigned_designer_id ? 'completed' : 'pending';
        case 'design_in_progress':
            if (state.status === 'design_ready' || state.status === 'completed' || state.all_designs_approved) {
                return 'completed';
            }
            if (state.assigned_designer_id && state.status === 'in_progress') {
                return 'in_progress';
            }
            return 'pending';
        case 'design_ready':
            if (state.status === 'design_ready' || state.status === 'completed' || state.all_designs_approved) {
                return 'completed';
            }
            if (state.design_files && state.status === 'in_progress') {
                return 'in_progress';
            }
            return 'pending';
        case 'review_requested':
            if (state.all_designs_approved || state.status === 'completed') {
                return 'completed';
            }
            if (state.status === 'design_ready' || state.status === 'revision_requested') {
                return 'in_progress';
            }
            return 'pending';
        case 'revision_requested':
            // This is an optional step - skip if not in revision flow
            if (state.status === 'revision_requested')
                return 'in_progress';
            if (state.all_designs_approved || state.status === 'completed')
                return 'skipped';
            return 'pending';
        case 'revision_in_progress':
            // This is also optional
            if (state.status === 'revision_requested')
                return 'in_progress';
            if (state.all_designs_approved || state.status === 'completed')
                return 'skipped';
            return 'pending';
        case 'approved':
            return state.all_designs_approved || state.status === 'completed' ? 'completed' : 'pending';
        case 'completed':
            return state.completed_at || state.status === 'completed' ? 'completed' : 'pending';
        default:
            return 'pending';
    }
}
/**
 * Apply order-level state to milestones for display (no DB writes).
 */
export function applyOrderProgressState(milestones, state) {
    if (!state)
        return milestones;
    return milestones.map((m) => {
        const derivedStatus = deriveMilestoneStatus(m.milestone_type, state);
        // If derived status differs from stored status, override it
        if (derivedStatus !== m.status) {
            return {
                ...m,
                status: derivedStatus,
                // Update completed_at for specific milestones if we have actual data
                completed_at: derivedStatus === 'completed'
                    ? (m.milestone_type === 'discovery_call_completed' && state.discovery_call_completed_at)
                        ? state.discovery_call_completed_at
                        : m.completed_at || new Date().toISOString()
                    : m.completed_at,
            };
        }
        return m;
    });
}
/**
 * Update milestone status
 */
export async function updateMilestoneStatus(orderId, milestoneType, status, notes) {
    try {
        const updateData = {
            status,
            notes: notes || null
        };
        if (status === 'completed') {
            updateData.completed_at = new Date().toISOString();
        }
        const { error } = await appDataClient
            .from('order_milestones')
            .update(updateData)
            .eq('order_id', orderId)
            .eq('milestone_type', milestoneType);
        if (error)
            throw error;
        return true;
    }
    catch (error) {
        console.error('Error updating milestone:', error);
        return false;
    }
}
/**
 * Get current milestone
 */
export function getCurrentMilestone(milestones) {
    const inProgress = milestones.find(m => m.status === 'in_progress');
    if (inProgress)
        return inProgress;
    const pending = milestones.find(m => m.status === 'pending');
    return pending || null;
}
/**
 * Calculate progress percentage
 */
export function calculateProgress(milestones) {
    if (milestones.length === 0)
        return 0;
    const completed = milestones.filter(m => m.status === 'completed').length;
    const total = milestones.filter(m => m.status !== 'skipped').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
}
/**
 * Get next action for customer
 */
export function getNextAction(milestones, orderId) {
    const current = getCurrentMilestone(milestones);
    if (!current)
        return null;
    const actionMap = {
        discovery_call_scheduled: {
            title: 'Schedule Discovery Call',
            description: 'Book a consultation with your designer',
            action: 'Schedule Now',
            link: `/dashboard/orders/${orderId}`
        },
        design_ready: {
            title: 'Review Your Designs',
            description: 'Your designs are ready for your feedback',
            action: 'View Designs',
            link: `/dashboard/projects/${orderId}/review`
        },
        review_requested: {
            title: 'Approve or Request Changes',
            description: 'Let us know if you love it or want revisions',
            action: 'Review Now',
            link: `/dashboard/projects/${orderId}/review`
        }
    };
    return actionMap[current.milestone_type] || null;
}
/**
 * Get milestone definition by type
 */
export function getMilestoneDefinition(type) {
    return milestoneDefinitions.find(m => m.type === type);
}

