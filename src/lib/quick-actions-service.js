import { appDataClient } from '@/lib/static-client';
/**
 * Get pending quick actions for user
 */
export async function getQuickActions() {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            return [];
        const actions = [];
        // Get user's active orders (including payment_pending)
        const { data: orders, error: ordersError } = await appDataClient
            .from('orders')
            .select('id, order_number, status, created_at, user_id')
            .eq('user_id', user.id)
            .in('status', ['pending', 'payment_pending', 'paid', 'in_progress', 'design_ready', 'revision_requested'])
            .order('created_at', { ascending: false });
        if (ordersError) {
            console.error('Error fetching orders:', ordersError);
        }
        // Get user's active projects
        const { data: projects, error: projectsError } = await appDataClient
            .from('projects')
            .select('id, current_phase, created_at')
            .eq('user_id', user.id)
            .lt('current_phase', 6) // Not completed
            .order('created_at', { ascending: false });
        if (projectsError) {
            console.error('Error fetching projects:', projectsError);
        }
        // Get call bookings to check if scheduled
        const orderIds = (orders || []).map(o => o.id);
        let callBookings = [];
        if (orderIds.length > 0) {
            const { data: calls } = await appDataClient
                .from('call_bookings')
                .select('order_id, status')
                .in('order_id', orderIds);
            callBookings = calls || [];
        }
        // Process orders for actions
        let addedPaymentAction = false;
        (orders || []).forEach((order) => {
            const hasCall = callBookings.some(c => c.order_id === order.id);
            // Action: Complete payment for payment_pending orders
            if (order.status === 'payment_pending') {
                // If there are multiple pending payment attempts, only surface the newest one
                if (addedPaymentAction)
                    return;
                addedPaymentAction = true;
                actions.push({
                    id: `pay-${order.id}`,
                    type: 'pay_invoice',
                    title: 'Complete Payment',
                    description: `Complete payment for order #${order.order_number}`,
                    priority: 'high',
                    icon: '💳',
                    link: `/checkout?orderId=${order.id}`,
                    orderId: order.id,
                    orderNumber: order.order_number
                });
                return;
            }
            // Action: Schedule discovery call
            if ((order.status === 'pending' || order.status === 'paid') && !hasCall) {
                actions.push({
                    id: `schedule-${order.id}`,
                    type: 'schedule_call',
                    title: 'Schedule Discovery Call',
                    description: `Book your consultation for order #${order.order_number}`,
                    priority: 'high',
                    icon: '📅',
                    link: `/dashboard/orders/${order.id}`,
                    orderId: order.id,
                    orderNumber: order.order_number,
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
                });
            }
            // Action: Review designs ready
            if (order.status === 'design_ready') {
                actions.push({
                    id: `review-${order.id}`,
                    type: 'review_design',
                    title: 'Review Your Designs',
                    description: `New concepts ready for order #${order.order_number}`,
                    priority: 'high',
                    icon: '🎨',
                    link: `/dashboard/projects/${order.id}/review`,
                    orderId: order.id,
                    orderNumber: order.order_number
                });
            }
        });
        (projects || []).forEach((project) => {
            // Action: Upload photos (phase 1)
            if (project.current_phase === 1) {
                actions.push({
                    id: `upload-${project.id}`,
                    type: 'upload_photos',
                    title: 'Upload Room Photos',
                    description: 'Share photos of your space to get started',
                    priority: 'medium',
                    icon: '📷',
                    link: `/dashboard/projects/${project.id}/intake`,
                    projectId: project.id
                });
            }
            // Action: View concepts (phase 3+)
            if (project.current_phase >= 3 && project.current_phase < 5) {
                actions.push({
                    id: `concepts-${project.id}`,
                    type: 'view_concepts',
                    title: 'View Design Concepts',
                    description: 'Your designer has prepared concepts for review',
                    priority: 'medium',
                    icon: '✨',
                    link: `/dashboard/projects/${project.id}`,
                    projectId: project.id
                });
            }
        });
        // Sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        return actions.slice(0, 5); // Return top 5 actions
    }
    catch (error) {
        console.error('Error fetching quick actions:', error);
        return [];
    }
}

