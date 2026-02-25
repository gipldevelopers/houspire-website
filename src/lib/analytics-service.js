import { supabase } from '@/integrations/supabase/client';
/**
 * Calculate date range based on period
 */
function getDateRange(period) {
    const end = new Date();
    const start = new Date();
    switch (period) {
        case '7d':
            start.setDate(end.getDate() - 7);
            break;
        case '30d':
            start.setDate(end.getDate() - 30);
            break;
        case '90d':
            start.setDate(end.getDate() - 90);
            break;
        case 'all':
            start.setFullYear(2020, 0, 1);
            break;
    }
    return { start, end };
}
/**
 * Get overview metrics
 */
export async function getOverviewMetrics(period) {
    try {
        const { start, end } = getDateRange(period);
        // Get orders for current period
        const { data: currentOrders, error: currentError } = await supabase
            .from('orders')
            .select('final_price, created_at, status, user_id')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());
        if (currentError)
            throw currentError;
        // Get orders for previous period (for growth calculation)
        const periodDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const prevStart = new Date(start);
        prevStart.setDate(prevStart.getDate() - periodDays);
        const { data: prevOrders, error: prevError } = await supabase
            .from('orders')
            .select('final_price, created_at')
            .gte('created_at', prevStart.toISOString())
            .lt('created_at', start.toISOString());
        if (prevError)
            throw prevError;
        // Calculate unique customers
        const uniqueCustomers = new Set(currentOrders?.map(o => o.user_id)).size;
        // Calculate metrics
        const totalRevenue = currentOrders?.reduce((sum, order) => sum + (order.final_price || 0), 0) || 0;
        const totalOrders = currentOrders?.length || 0;
        const prevRevenue = prevOrders?.reduce((sum, order) => sum + (order.final_price || 0), 0) || 0;
        const prevOrderCount = prevOrders?.length || 0;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const conversionRate = 4.2; // Placeholder - would need actual visitor data
        const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        const orderGrowth = prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0;
        return {
            totalRevenue,
            totalOrders,
            totalCustomers: uniqueCustomers,
            avgOrderValue,
            conversionRate,
            revenueGrowth,
            orderGrowth
        };
    }
    catch (error) {
        console.error('Error fetching overview metrics:', error);
        throw error;
    }
}
/**
 * Get revenue trend data
 */
export async function getRevenueTrend(period) {
    try {
        const { start, end } = getDateRange(period);
        const { data, error } = await supabase
            .from('orders')
            .select('final_price, created_at')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString())
            .order('created_at', { ascending: true });
        if (error)
            throw error;
        // Group by date
        const grouped = {};
        // Initialize all dates in range
        const current = new Date(start);
        while (current <= end) {
            const dateKey = current.toISOString().split('T')[0];
            grouped[dateKey] = { revenue: 0, orders: 0 };
            current.setDate(current.getDate() + 1);
        }
        // Add order data
        data?.forEach(order => {
            const date = new Date(order.created_at).toISOString().split('T')[0];
            if (grouped[date]) {
                grouped[date].revenue += order.final_price || 0;
                grouped[date].orders += 1;
            }
        });
        // Convert to array
        return Object.entries(grouped).map(([date, data]) => ({
            date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            revenue: data.revenue,
            orders: data.orders
        }));
    }
    catch (error) {
        console.error('Error fetching revenue trend:', error);
        throw error;
    }
}
/**
 * Get package distribution
 */
export async function getPackageDistribution(period) {
    try {
        const { start, end } = getDateRange(period);
        const { data, error } = await supabase
            .from('orders')
            .select('package_name, final_price')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());
        if (error)
            throw error;
        // Group by package
        const grouped = {};
        let totalOrders = 0;
        data?.forEach(order => {
            const pkg = order.package_name || 'Unknown';
            if (!grouped[pkg]) {
                grouped[pkg] = { count: 0, revenue: 0 };
            }
            grouped[pkg].count += 1;
            grouped[pkg].revenue += order.final_price || 0;
            totalOrders += 1;
        });
        // Convert to array with percentages
        return Object.entries(grouped).map(([pkg, data]) => ({
            package: pkg,
            count: data.count,
            revenue: data.revenue,
            percentage: totalOrders > 0 ? (data.count / totalOrders) * 100 : 0
        }))
            .sort((a, b) => b.count - a.count);
    }
    catch (error) {
        console.error('Error fetching package distribution:', error);
        throw error;
    }
}
/**
 * Get order status breakdown
 */
export async function getOrderStatusBreakdown(period) {
    try {
        const { start, end } = getDateRange(period);
        const { data, error } = await supabase
            .from('orders')
            .select('status')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());
        if (error)
            throw error;
        // Group by status
        const grouped = {};
        let total = 0;
        data?.forEach(order => {
            const status = order.status || 'unknown';
            grouped[status] = (grouped[status] || 0) + 1;
            total += 1;
        });
        // Convert to array with percentages
        return Object.entries(grouped).map(([status, count]) => ({
            status: status.replace(/_/g, ' '),
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
        }))
            .sort((a, b) => b.count - a.count);
    }
    catch (error) {
        console.error('Error fetching status breakdown:', error);
        throw error;
    }
}
/**
 * Get designer performance from projects
 */
export async function getDesignerPerformance() {
    try {
        // Get designer profiles
        const { data: designerData, error: designerError } = await supabase
            .from('designer_profiles')
            .select('id, full_name, rating, projects_completed')
            .eq('status', 'active')
            .limit(20);
        if (designerError)
            throw designerError;
        // Get projects data for each designer
        const designers = await Promise.all((designerData || []).map(async (designer) => {
            // Get projects assigned to this designer
            const { data: projects } = await supabase
                .from('projects')
                .select('id, current_phase, total_paid')
                .eq('designer_persona', designer.full_name);
            const totalProjects = projects?.length || 0;
            const completedProjects = projects?.filter(p => p.current_phase === 6).length || 0;
            const activeProjects = projects?.filter(p => p.current_phase < 6).length || 0;
            const revenue = projects?.reduce((sum, p) => sum + (p.total_paid || 0), 0) || 0;
            return {
                id: designer.id,
                name: designer.full_name,
                totalProjects,
                avgRating: designer.rating || 0,
                completedProjects,
                activeProjects,
                revenue
            };
        }));
        return designers.sort((a, b) => b.revenue - a.revenue);
    }
    catch (error) {
        console.error('Error fetching designer performance:', error);
        throw error;
    }
}
/**
 * Get recent activity for the activity feed
 */
export async function getRecentActivity(limit = 10) {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('id, order_number, status, final_price, created_at, package_name')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error)
            throw error;
        return orders || [];
    }
    catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
    }
}
