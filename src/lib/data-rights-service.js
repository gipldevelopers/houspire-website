import { supabase } from '@/integrations/supabase/client';
/**
 * Generate a 6-digit verification code
 */
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Submit a data rights request
 */
export async function submitDataRightRequest(requestType, description) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        const verificationCode = generateVerificationCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        const { data, error } = await supabase
            .from('data_rights_requests')
            .insert({
            user_id: user.id,
            request_type: requestType,
            description: description || null,
            status: 'pending',
            verification_code: verificationCode,
            verification_expires_at: expiresAt.toISOString()
        })
            .select()
            .single();
        if (error)
            throw error;
        // In production, send verification email via edge function
        console.log(`Verification code for ${user.email}: ${verificationCode}`);
        return { success: true, requestId: data.id };
    }
    catch (error) {
        console.error('Error submitting data right request:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
    }
}
/**
 * Verify a data rights request with code
 */
export async function verifyDataRightRequest(requestId, verificationCode) {
    try {
        const { data: request, error: fetchError } = await supabase
            .from('data_rights_requests')
            .select('*')
            .eq('id', requestId)
            .single();
        if (fetchError || !request) {
            return { success: false, error: 'Request not found' };
        }
        if (request.status !== 'pending') {
            return { success: false, error: 'Request already processed' };
        }
        if (request.verification_expires_at && new Date(request.verification_expires_at) < new Date()) {
            return { success: false, error: 'Verification code expired. Please submit a new request.' };
        }
        if (request.verification_code !== verificationCode) {
            return { success: false, error: 'Invalid verification code' };
        }
        const { error: updateError } = await supabase
            .from('data_rights_requests')
            .update({
            status: 'verified',
            verified_at: new Date().toISOString(),
            verification_code: null,
            verification_expires_at: null
        })
            .eq('id', requestId);
        if (updateError)
            throw updateError;
        return { success: true };
    }
    catch (error) {
        console.error('Error verifying request:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
    }
}
/**
 * Get user's data rights requests
 */
export async function getUserDataRightRequests() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return [];
        const { data, error } = await supabase
            .from('data_rights_requests')
            .select('*')
            .eq('user_id', user.id)
            .order('requested_at', { ascending: false });
        if (error)
            throw error;
        return (data || []);
    }
    catch (error) {
        console.error('Error fetching requests:', error);
        return [];
    }
}
/**
 * Cancel a pending request
 */
export async function cancelDataRightRequest(requestId) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return false;
        const { error } = await supabase
            .from('data_rights_requests')
            .delete()
            .eq('id', requestId)
            .eq('user_id', user.id)
            .eq('status', 'pending');
        if (error)
            throw error;
        return true;
    }
    catch (error) {
        console.error('Error canceling request:', error);
        return false;
    }
}
/**
 * Resend verification code
 */
export async function resendVerificationCode(requestId) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            return { success: false, error: 'Not authenticated' };
        const newCode = generateVerificationCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        const { error } = await supabase
            .from('data_rights_requests')
            .update({
            verification_code: newCode,
            verification_expires_at: expiresAt.toISOString()
        })
            .eq('id', requestId)
            .eq('user_id', user.id)
            .eq('status', 'pending');
        if (error)
            throw error;
        console.log(`New verification code for ${user.email}: ${newCode}`);
        return { success: true };
    }
    catch (error) {
        console.error('Error resending code:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: message };
    }
}
