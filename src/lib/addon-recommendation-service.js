import { supabase } from '@/integrations/supabase/client';
/**
 * Get recommended add-ons for an order (post-design phase)
 */
export async function getRecommendedAddons(orderId) {
    try {
        // Get already purchased add-ons for this order
        const { data: existingAddons } = await supabase
            .from('order_addons')
            .select('addon_id')
            .eq('order_id', orderId);
        const purchasedIds = existingAddons?.map(a => a.addon_id) || [];
        // Get popular add-ons that would complement the design
        const { data: addons, error } = await supabase
            .from('addons')
            .select('*')
            .eq('is_bundle', false)
            .order('is_popular', { ascending: false })
            .order('sort_order', { ascending: true })
            .limit(6);
        if (error)
            throw error;
        // Filter out already purchased and map to recommendations
        const recommendations = (addons || [])
            .filter(addon => !purchasedIds.includes(addon.id))
            .slice(0, 3)
            .map(addon => ({
            id: addon.id,
            name: addon.name,
            description: addon.description,
            short_description: addon.short_description,
            price: addon.price,
            original_price: addon.original_price,
            discount_percentage: addon.original_price
                ? Math.round((1 - addon.price / addon.original_price) * 100)
                : 0,
            icon: addon.icon,
            features: addon.features,
            category: addon.category,
            relevance_reason: getRelevanceReason(addon.slug)
        }));
        return recommendations;
    }
    catch (error) {
        console.error('Error getting recommendations:', error);
        return [];
    }
}
function getRelevanceReason(slug) {
    const reasons = {
        'lighting-plan': 'Complete your design with professional lighting',
        'furniture-shopping-list': 'Save time with a detailed shopping guide',
        'color-consultation': 'Perfect your color palette',
        'floor-plan': 'Get detailed measurements and layout',
        'execution-support': 'Expert guidance during implementation'
    };
    return reasons[slug] || 'Perfect addition to your design';
}
/**
 * Add addon to order (post-purchase)
 */
export async function addAddonToOrder(orderId, addonId, price) {
    try {
        const { data, error } = await supabase
            .from('order_addons')
            .insert({
            order_id: orderId,
            addon_id: addonId,
            is_post_purchase: true,
            payment_status: 'pending',
            payment_amount: price
        })
            .select('id')
            .single();
        if (error)
            throw error;
        return { success: true, orderAddonId: data.id };
    }
    catch (error) {
        console.error('Error adding addon:', error);
        return { success: false };
    }
}
/**
 * Get order add-ons
 */
export async function getOrderAddons(orderId) {
    try {
        const { data, error } = await supabase
            .from('order_addons')
            .select(`
        addon_id,
        payment_status,
        addons(*)
      `)
            .eq('order_id', orderId)
            .eq('payment_status', 'paid');
        if (error)
            throw error;
        return (data || []).map(item => ({
            id: item.addons?.id || '',
            name: item.addons?.name || '',
            description: item.addons?.description || null,
            short_description: item.addons?.short_description || null,
            price: item.addons?.price || 0,
            original_price: item.addons?.original_price || null,
            discount_percentage: 0,
            icon: item.addons?.icon || null,
            features: item.addons?.features || null,
            category: item.addons?.category || '',
            relevance_reason: ''
        }));
    }
    catch (error) {
        console.error('Error fetching order addons:', error);
        return [];
    }
}
