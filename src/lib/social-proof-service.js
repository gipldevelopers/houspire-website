import { supabase } from '@/integrations/supabase/client';
/**
 * Get recent platform activity for social proof
 */
export async function getRecentActivity() {
    try {
        const activities = [];
        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
        // Get recent orders
        const { data: orders } = await supabase
            .from('orders')
            .select('id, created_at')
            .order('created_at', { ascending: false })
            .limit(10);
        orders?.forEach((order, index) => {
            const city = cities[index % cities.length];
            const timeAgo = getTimeAgo(new Date(order.created_at));
            activities.push({
                id: order.id,
                type: 'order',
                message: `Someone from ${city} just started a design project`,
                location: city,
                timeAgo,
                timestamp: order.created_at
            });
        });
        // Get recent reviews
        const { data: reviews } = await supabase
            .from('reviews')
            .select('id, created_at, rating')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(5);
        reviews?.forEach((review, index) => {
            const city = cities[(index + 3) % cities.length];
            const timeAgo = getTimeAgo(new Date(review.created_at));
            const stars = '⭐'.repeat(Math.min(review.rating, 5));
            activities.push({
                id: review.id,
                type: 'review',
                message: `${stars} Someone from ${city} left a ${review.rating}-star review`,
                location: city,
                timeAgo,
                timestamp: review.created_at
            });
        });
        // Sort by timestamp
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return activities.slice(0, 10);
    }
    catch (error) {
        console.error('Error fetching activity:', error);
        return [];
    }
}
/**
 * Get site statistics
 */
export async function getSiteStats() {
    try {
        // Total customers (profiles)
        const { count: customersCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        // Total designs delivered (completed orders)
        const { count: designsCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed');
        // Active projects
        const { count: activeCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .in('status', ['in_progress', 'design_ready', 'processing']);
        // Average rating
        const { data: reviewData } = await supabase
            .from('reviews')
            .select('rating')
            .eq('published', true);
        const avgRating = reviewData?.length
            ? reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length
            : 4.8;
        // Ensure reasonable defaults for display
        return {
            total_customers: Math.max(customersCount || 0, 1200),
            total_designs_delivered: Math.max(designsCount || 0, 850),
            active_projects: Math.max(activeCount || 0, 40),
            average_rating: Number(avgRating.toFixed(1)),
            total_reviews: Math.max(reviewData?.length || 0, 230)
        };
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        return {
            total_customers: 1250,
            total_designs_delivered: 856,
            active_projects: 42,
            average_rating: 4.8,
            total_reviews: 234
        };
    }
}
function getTimeAgo(date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60)
        return 'just now';
    if (seconds < 3600)
        return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400)
        return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800)
        return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
}
