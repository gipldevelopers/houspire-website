import { appDataClient } from '@/lib/static-client';
export async function generateReferralCode(baseName) {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
    return `${cleanName}${randomSuffix}`;
}
export async function getReferralStats(userId) {
    const { data: codeData } = await appDataClient
        .from('referral_codes')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (!codeData) {
        return {
            code: null,
            shareUrl: null,
            totalReferrals: 0,
            successfulReferrals: 0,
            pendingReferrals: 0,
        };
    }
    const { data: usageData } = await appDataClient
        .from('referral_usage')
        .select('status')
        .eq('referrer_user_id', userId);
    const totalReferrals = usageData?.length || 0;
    const successfulReferrals = usageData?.filter(r => r.status === 'completed').length || 0;
    const pendingReferrals = usageData?.filter(r => r.status === 'pending').length || 0;
    const shareUrl = `${window.location.origin}?ref=${codeData.code}`;
    return {
        code: codeData.code,
        shareUrl,
        totalReferrals,
        successfulReferrals,
        pendingReferrals,
    };
}
export async function applyReferralCode(code, userId) {
    // Find the referral code
    const { data: codeData, error: codeError } = await appDataClient
        .from('referral_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();
    if (codeError || !codeData) {
        return { success: false, discount: 0, error: 'Invalid referral code' };
    }
    // Check if user hasn't already used a referral code
    const { data: existingUsage } = await appDataClient
        .from('referral_usage')
        .select('id')
        .eq('referred_user_id', userId)
        .single();
    if (existingUsage) {
        return { success: false, discount: 0, error: 'You have already used a referral code' };
    }
    // Check user isn't referring themselves
    if (codeData.user_id === userId) {
        return { success: false, discount: 0, error: 'Cannot use your own referral code' };
    }
    // Create referral usage record
    const { error: usageError } = await appDataClient
        .from('referral_usage')
        .insert({
        referral_code_id: codeData.id,
        referrer_user_id: codeData.user_id,
        referred_user_id: userId,
        status: 'pending',
    });
    if (usageError) {
        return { success: false, discount: 0, error: 'Failed to apply referral code' };
    }
    return { success: true, discount: codeData.discount_amount || 500 };
}
export async function completeReferral(referredUserId) {
    // Find the pending referral
    const { data: usage } = await appDataClient
        .from('referral_usage')
        .select('*')
        .eq('referred_user_id', referredUserId)
        .eq('status', 'pending')
        .single();
    if (!usage)
        return;
    // Update status to completed
    await appDataClient
        .from('referral_usage')
        .update({
        status: 'completed',
        completed_at: new Date().toISOString()
    })
        .eq('id', usage.id);
    // Add credit to referrer
    await appDataClient
        .from('user_credits')
        .insert({
        user_id: usage.referrer_user_id,
        amount: 500,
        reason: 'Referral bonus',
    });
    // Update referral code total_referrals count
    const { data: codeData } = await appDataClient
        .from('referral_codes')
        .select('total_referrals')
        .eq('id', usage.referral_code_id)
        .single();
    if (codeData) {
        await appDataClient
            .from('referral_codes')
            .update({
            total_referrals: (codeData.total_referrals || 0) + 1
        })
            .eq('id', usage.referral_code_id);
    }
}

