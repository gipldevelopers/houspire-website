import { appDataClient } from '@/lib/static-client';
/**
 * Get all referral tiers
 */
export async function getReferralTiers() {
    try {
        const { data, error } = await appDataClient
            .from('referral_rewards')
            .select('*')
            .order('min_referrals', { ascending: true });
        if (error)
            throw error;
        return (data || []);
    }
    catch (error) {
        console.error('Error fetching tiers:', error);
        return [];
    }
}
/**
 * Get user's referral stats (enhanced)
 */
export async function getEnhancedReferralStats(userId) {
    try {
        // Get referral code
        const { data: codeData, error: codeError } = await appDataClient
            .from('referral_codes')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (codeError)
            throw codeError;
        if (!codeData)
            return null;
        // Get usage stats
        const { data: usageData } = await appDataClient
            .from('referral_usage')
            .select('status')
            .eq('referrer_user_id', userId);
        const totalReferrals = usageData?.length || 0;
        const successfulReferrals = usageData?.filter(r => r.status === 'completed').length || 0;
        const pendingReferrals = usageData?.filter(r => r.status === 'pending').length || 0;
        // Calculate tier
        const { data: tiers } = await appDataClient
            .from('referral_rewards')
            .select('*')
            .order('min_referrals', { ascending: true });
        let currentTier = codeData.current_tier || 'bronze';
        let tierData = tiers?.find(t => t.tier === currentTier);
        // Calculate earnings
        const totalEarnings = successfulReferrals * (tierData?.reward_per_referral || 500);
        // Get next tier
        const nextTierData = tiers?.find(t => t.min_referrals > successfulReferrals);
        const shareUrl = `${window.location.origin}?ref=${codeData.code}`;
        return {
            referral_code: codeData.code,
            current_tier: currentTier,
            total_referrals: totalReferrals,
            successful_referrals: successfulReferrals,
            pending_referrals: pendingReferrals,
            total_earnings: totalEarnings,
            share_url: shareUrl,
            next_tier: nextTierData ? {
                name: nextTierData.tier,
                referrals_needed: nextTierData.min_referrals - successfulReferrals,
                bonus: nextTierData.bonus_reward
            } : undefined
        };
    }
    catch (error) {
        console.error('Error fetching referral stats:', error);
        return null;
    }
}
/**
 * Get referral activity
 */
export async function getReferralActivity(userId) {
    try {
        const { data, error } = await appDataClient
            .from('referral_usage')
            .select('id, status, created_at')
            .eq('referrer_user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching activity:', error);
        return [];
    }
}
/**
 * Share referral link
 */
export async function shareReferral(code, method) {
    const link = `${window.location.origin}?ref=${code}`;
    const message = `Check out Houspire! Get ₹500 off your first interior design project. Use my referral link: ${link}`;
    try {
        switch (method) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                break;
            case 'email':
                window.location.href = `mailto:?subject=Get ₹500 off Houspire&body=${encodeURIComponent(message)}`;
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
                break;
            case 'copy':
                await navigator.clipboard.writeText(link);
                break;
        }
        return true;
    }
    catch (error) {
        console.error('Error sharing:', error);
        return false;
    }
}
/**
 * Calculate tier progress
 */
export function calculateTierProgress(currentReferrals, tiers) {
    const sortedTiers = [...tiers].sort((a, b) => b.min_referrals - a.min_referrals);
    const currentTier = sortedTiers.find(t => currentReferrals >= t.min_referrals) || tiers[0];
    const nextTier = tiers.find(t => t.min_referrals > currentReferrals);
    let progress = 100;
    if (nextTier) {
        const progressInTier = currentReferrals - currentTier.min_referrals;
        const tierRange = nextTier.min_referrals - currentTier.min_referrals;
        progress = (progressInTier / tierRange) * 100;
    }
    return { currentTier, nextTier, progress };
}

