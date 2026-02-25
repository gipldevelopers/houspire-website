import { supabase } from '@/integrations/supabase/client';
/**
 * Get style preferences analytics
 */
export async function getStylePreferences(days = 30) {
    try {
        const { data, error } = await supabase.rpc('get_style_preferences_analytics', {
            p_days: days
        });
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching style preferences:', error);
        return [];
    }
}
/**
 * Get room type analytics
 */
export async function getRoomTypeAnalytics(days = 30) {
    try {
        const { data, error } = await supabase.rpc('get_room_type_analytics', {
            p_days: days
        });
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching room analytics:', error);
        return [];
    }
}
/**
 * Get budget distribution
 */
export async function getBudgetDistribution(days = 30) {
    try {
        const { data, error } = await supabase.rpc('get_budget_distribution', {
            p_days: days
        });
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching budget distribution:', error);
        return [];
    }
}
/**
 * Get popular add-ons
 */
export async function getPopularAddons(days = 30) {
    try {
        const { data, error } = await supabase.rpc('get_popular_addons_analytics', {
            p_days: days
        });
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching popular addons:', error);
        return [];
    }
}
/**
 * Get customer location analytics
 */
export async function getLocationAnalytics(days = 30) {
    try {
        const { data, error } = await supabase.rpc('get_customer_location_analytics', {
            p_days: days
        });
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching location analytics:', error);
        return [];
    }
}
/**
 * Format currency in INR
 */
export function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(value);
}
