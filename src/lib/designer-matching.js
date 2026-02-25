import { supabase } from '@/integrations/supabase/client';
import { notificationHelpers } from './notifications';
import { logProjectActivity, logAdminAction, getProjectIdFromOrder } from './activity-logger';
const MAX_PROJECTS_PER_DESIGNER = 5;
/**
 * Match designers for an order based on style expertise, workload, and rating
 */
export async function matchDesignersForOrder(orderId) {
    // Fetch order details
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, style_id, style_name, package_name, room_count')
        .eq('id', orderId)
        .single();
    if (orderError || !order) {
        console.error('Failed to fetch order:', orderError);
        return [];
    }
    // Fetch all active designers with their style mappings
    const { data: designers, error: designersError } = await supabase
        .from('designer_profiles')
        .select(`
      id,
      display_name,
      avatar_url,
      primary_specialty,
      rating,
      projects_completed,
      status
    `)
        .eq('status', 'active');
    if (designersError || !designers) {
        console.error('Failed to fetch designers:', designersError);
        return [];
    }
    // Get style mappings for the order's style
    const { data: styleMappings } = await supabase
        .from('designer_style_mapping')
        .select('designer_id, expertise_level, is_primary')
        .eq('style_id', order.style_id);
    const styleMappingMap = new Map((styleMappings || []).map(m => [m.designer_id, m]));
    // Get current workload for each designer
    const { data: workloadData } = await supabase
        .from('orders')
        .select('assigned_designer_id')
        .in('status', ['in_progress', 'design_ready', 'revision_requested'])
        .not('assigned_designer_id', 'is', null);
    const workloadMap = new Map();
    (workloadData || []).forEach(o => {
        const designerId = o.assigned_designer_id;
        workloadMap.set(designerId, (workloadMap.get(designerId) || 0) + 1);
    });
    // Calculate match scores
    const matches = designers
        .map(designer => {
        const styleMapping = styleMappingMap.get(designer.id);
        const activeProjects = workloadMap.get(designer.id) || 0;
        // Skip designers at capacity
        if (activeProjects >= MAX_PROJECTS_PER_DESIGNER) {
            return null;
        }
        // Calculate style expertise score (0-50 points)
        let expertiseScore = 0;
        let expertiseLevel = 'intermediate';
        const isPrimaryStyle = styleMapping?.is_primary || false;
        if (styleMapping) {
            switch (styleMapping.expertise_level) {
                case 'expert':
                    expertiseScore = 50;
                    expertiseLevel = 'expert';
                    break;
                case 'advanced':
                    expertiseScore = 40;
                    expertiseLevel = 'advanced';
                    break;
                case 'intermediate':
                    expertiseScore = 30;
                    expertiseLevel = 'intermediate';
                    break;
                default:
                    expertiseScore = 20;
            }
            // Bonus for primary style
            if (isPrimaryStyle) {
                expertiseScore = Math.min(50, expertiseScore + 10);
            }
        }
        else {
            // Designer doesn't have this style mapped
            expertiseScore = 15;
        }
        // Calculate workload score (0-30 points) - more available = higher score
        const workloadScore = 30 * (1 - activeProjects / MAX_PROJECTS_PER_DESIGNER);
        // Calculate rating score (0-20 points)
        const rating = designer.rating || 4.5;
        const ratingScore = (rating / 5) * 20;
        const totalScore = Math.round(expertiseScore + workloadScore + ratingScore);
        return {
            designer_id: designer.id,
            designer_name: designer.display_name,
            match_score: totalScore,
            expertise_level: expertiseLevel,
            is_primary_style: isPrimaryStyle,
            active_projects: activeProjects,
            max_projects: MAX_PROJECTS_PER_DESIGNER,
            capacity_percentage: Math.round((activeProjects / MAX_PROJECTS_PER_DESIGNER) * 100),
            avg_rating: rating,
            total_projects: designer.projects_completed || 0,
            avg_delivery_hours: 48,
            avatar_url: designer.avatar_url || undefined,
            primary_specialty: designer.primary_specialty || undefined,
        };
    })
        .filter((m) => m !== null)
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, 5); // Return top 5 matches
    return matches;
}
/**
 * Assign a designer to an order
 */
export async function assignDesignerToOrder(orderId, designerId, assignmentType = 'manual', matchScore) {
    try {
        // Get the current user (admin)
        const { data: { user } } = await supabase.auth.getUser();
        // Update the order with the assigned designer
        const { error: updateError } = await supabase
            .from('orders')
            .update({
            assigned_designer_id: designerId,
            status: 'in_progress',
            design_started_at: new Date().toISOString(),
        })
            .eq('id', orderId);
        if (updateError) {
            return { success: false, error: updateError.message };
        }
        // Log the assignment
        await supabase
            .from('assignment_log')
            .insert([{
                order_id: orderId,
                designer_id: designerId,
                assigned_by: user?.id,
                assignment_type: assignmentType,
                match_score: matchScore,
            }]);
        // Get order details for notification
        const { data: order } = await supabase
            .from('orders')
            .select('user_id, order_number')
            .eq('id', orderId)
            .single();
        // Send "Design work started" email to customer
        if (order?.user_id) {
            await notificationHelpers.onDesignWorkStarted(order.user_id, orderId);
        }
        // Get designer name and log activity
        const { data: designer } = await supabase
            .from('designer_profiles')
            .select('display_name')
            .eq('id', designerId)
            .single();
        // Log to project_activity table
        const projectId = await getProjectIdFromOrder(orderId);
        if (projectId) {
            await logProjectActivity({
                projectId,
                action: 'designer_assigned',
                description: `${designer?.display_name || 'Designer'} assigned to project`,
                metadata: {
                    designer_id: designerId,
                    designer_name: designer?.display_name,
                    assignment_type: assignmentType,
                    match_score: matchScore,
                },
            });
        }
        // Log admin action
        await logAdminAction({
            action: 'designer_assigned',
            details: {
                order_id: orderId,
                order_number: order?.order_number,
                designer_id: designerId,
                designer_name: designer?.display_name,
                assignment_type: assignmentType,
            },
        });
        return { success: true };
    }
    catch (error) {
        console.error('Failed to assign designer:', error);
        return { success: false, error: 'Failed to assign designer' };
    }
}
/**
 * Reassign a designer to an order
 */
export async function reassignDesigner(orderId, newDesignerId, reason) {
    try {
        // Get current designer
        const { data: order } = await supabase
            .from('orders')
            .select('assigned_designer_id')
            .eq('id', orderId)
            .single();
        const previousDesignerId = order?.assigned_designer_id;
        // Get the current user (admin)
        const { data: { user } } = await supabase.auth.getUser();
        // Update the order
        const { error: updateError } = await supabase
            .from('orders')
            .update({
            assigned_designer_id: newDesignerId,
        })
            .eq('id', orderId);
        if (updateError) {
            return { success: false, error: updateError.message };
        }
        // Log the reassignment
        await supabase
            .from('assignment_log')
            .insert([{
                order_id: orderId,
                designer_id: newDesignerId,
                assigned_by: user?.id,
                assignment_type: 'reassignment',
                reassigned_from: previousDesignerId,
                reassignment_reason: reason,
            }]);
        return { success: true };
    }
    catch (error) {
        console.error('Failed to reassign designer:', error);
        return { success: false, error: 'Failed to reassign designer' };
    }
}
/**
 * Get designer's current workload details
 */
export async function getDesignerWorkload(designerId) {
    try {
        // Get designer info
        const { data: designer } = await supabase
            .from('designer_profiles')
            .select('id, display_name')
            .eq('id', designerId)
            .single();
        if (!designer)
            return null;
        // Get active orders
        const { data: orders } = await supabase
            .from('orders')
            .select('id, order_number, package_name, design_started_at, status')
            .eq('assigned_designer_id', designerId)
            .in('status', ['in_progress', 'design_ready', 'revision_requested']);
        const activeProjects = orders?.length || 0;
        return {
            designer_id: designer.id,
            designer_name: designer.display_name,
            active_projects: activeProjects,
            max_projects: MAX_PROJECTS_PER_DESIGNER,
            capacity_remaining: MAX_PROJECTS_PER_DESIGNER - activeProjects,
            capacity_percentage: Math.round((activeProjects / MAX_PROJECTS_PER_DESIGNER) * 100),
            projects: (orders || []).map(o => ({
                order_number: o.order_number || o.id.slice(0, 8),
                package: o.package_name || 'Unknown',
                started_at: o.design_started_at || '',
                status: o.status || 'in_progress',
            })),
        };
    }
    catch (error) {
        console.error('Failed to get designer workload:', error);
        return null;
    }
}
