import { appDataClient } from '@/lib/static-client';
/**
 * Get available subscription plans
 */
export async function getSubscriptionPlans() {
    try {
        const { data, error } = await appDataClient
            .from('subscription_plans')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching plans:', error);
        return [];
    }
}
/**
 * Get user's active subscription
 */
export async function getUserSubscription() {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            return null;
        const { data, error } = await appDataClient
            .from('user_subscriptions')
            .select('*, plan:subscription_plans(*)')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .maybeSingle();
        if (error)
            throw error;
        if (!data)
            return null;
        return {
            id: data.id,
            user_id: data.user_id,
            plan_id: data.plan_id,
            status: data.status,
            billing_cycle: data.billing_cycle,
            current_period_start: data.current_period_start,
            current_period_end: data.current_period_end,
            credits_remaining: data.credits_remaining,
            credits_used_this_period: data.credits_used_this_period,
            razorpay_subscription_id: data.razorpay_subscription_id,
            plan: data.plan
        };
    }
    catch (error) {
        console.error('Error fetching subscription:', error);
        return null;
    }
}
/**
 * Check if user has VIP subscription
 */
export async function isVIPMember() {
    const subscription = await getUserSubscription();
    return subscription !== null && subscription.status === 'active';
}
/**
 * Get remaining credits
 */
export async function getRemainingCredits() {
    const subscription = await getUserSubscription();
    return subscription?.credits_remaining || 0;
}
/**
 * Create subscription (initiates payment flow)
 */
export async function createSubscription(planId, billingCycle) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            throw new Error('Not authenticated');
        // Get plan details
        const { data: plan, error: planError } = await appDataClient
            .from('subscription_plans')
            .select('*')
            .eq('id', planId)
            .single();
        if (planError)
            throw planError;
        const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'yearly' ? 12 : 1));
        // Create subscription record
        const { data, error } = await appDataClient
            .from('user_subscriptions')
            .insert({
            user_id: user.id,
            plan_id: planId,
            billing_cycle: billingCycle,
            status: 'active', // Will be updated after payment
            credits_remaining: plan.design_credits_monthly,
            current_period_end: periodEnd.toISOString()
        })
            .select('id')
            .single();
        if (error)
            throw error;
        return { success: true, subscriptionId: data.id };
    }
    catch (error) {
        console.error('Error creating subscription:', error);
        return { success: false };
    }
}
/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId, reason) {
    try {
        const { error } = await appDataClient
            .from('user_subscriptions')
            .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            cancel_reason: reason
        })
            .eq('id', subscriptionId);
        if (error)
            throw error;
        return true;
    }
    catch (error) {
        console.error('Error cancelling subscription:', error);
        return false;
    }
}
/**
 * Use subscription credit
 */
export async function useSubscriptionCredit(subscriptionId, creditsToUse = 1) {
    try {
        const subscription = await getUserSubscription();
        if (!subscription)
            return false;
        if ((subscription.credits_remaining || 0) < creditsToUse)
            return false;
        const { error } = await appDataClient
            .from('user_subscriptions')
            .update({
            credits_remaining: (subscription.credits_remaining || 0) - creditsToUse,
            credits_used_this_period: (subscription.credits_used_this_period || 0) + creditsToUse,
            updated_at: new Date().toISOString()
        })
            .eq('id', subscriptionId);
        if (error)
            throw error;
        return true;
    }
    catch (error) {
        console.error('Error using credit:', error);
        return false;
    }
}

