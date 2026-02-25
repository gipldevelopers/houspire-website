import { supabase } from '@/integrations/supabase/client';
import { notificationHelpers } from './notifications';
/**
 * Get call duration based on package type
 */
export function getCallDurationForPackage(packageName) {
    const packageLower = packageName.toLowerCase();
    if (packageLower.includes('trial') || packageLower.includes('single-room') || packageLower.includes('double-room')) {
        return 15;
    }
    if (packageLower.includes('essential') || packageLower.includes('smart')) {
        return 30;
    }
    if (packageLower.includes('premium')) {
        return 45;
    }
    if (packageLower.includes('luxury')) {
        return 60;
    }
    return 30; // Default
}
/**
 * Get Calendly URL based on duration
 */
export function getCalendlyUrl(duration) {
    const defaultUrl = 'https://calendly.com/hello-houspire/new-meeting';
    const baseUrls = {
        15: process.env.NEXT_PUBLIC_CALENDLY_15MIN_URL || defaultUrl,
        30: process.env.NEXT_PUBLIC_CALENDLY_30MIN_URL || defaultUrl,
        45: process.env.NEXT_PUBLIC_CALENDLY_45MIN_URL || defaultUrl,
        60: process.env.NEXT_PUBLIC_CALENDLY_60MIN_URL || defaultUrl,
    };
    return baseUrls[duration] || defaultUrl;
}
/**
 * Schedule a discovery call (called from Calendly webhook or manual entry)
 */
export async function scheduleCall(params) {
    try {
        // Create call booking record
        const { data: booking, error: bookingError } = await supabase
            .from('call_bookings')
            .insert([{
                order_id: params.orderId,
                scheduled_at: params.scheduledAt,
                duration: params.duration,
                call_link: params.callLink,
                calendly_event_id: params.calendlyEventId,
                calendly_invitee_uri: params.calendlyInviteeUri,
                status: 'scheduled',
            }])
            .select()
            .single();
        if (bookingError) {
            return { success: false, error: bookingError.message };
        }
        // Update order with call details
        await supabase
            .from('orders')
            .update({
            discovery_call_scheduled: params.scheduledAt,
            discovery_call_duration: params.duration,
            discovery_call_link: params.callLink,
        })
            .eq('id', params.orderId);
        // Send confirmation email
        const { data: order } = await supabase
            .from('orders')
            .select('user_id')
            .eq('id', params.orderId)
            .single();
        if (order?.user_id) {
            await notificationHelpers.onDiscoveryCallScheduled(order.user_id, params.orderId, {
                scheduledAt: params.scheduledAt,
                duration: params.duration,
                callLink: params.callLink || '',
            });
        }
        return { success: true, booking: booking };
    }
    catch (error) {
        console.error('Failed to schedule call:', error);
        return { success: false, error: 'Failed to schedule call' };
    }
}
/**
 * Cancel a scheduled call
 */
export async function cancelCall(bookingId) {
    try {
        const { error } = await supabase
            .from('call_bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);
        if (error) {
            return { success: false, error: error.message };
        }
        // Get booking details to update order
        const { data: booking } = await supabase
            .from('call_bookings')
            .select('order_id')
            .eq('id', bookingId)
            .single();
        if (booking) {
            await supabase
                .from('orders')
                .update({
                discovery_call_scheduled: null,
                discovery_call_link: null,
            })
                .eq('id', booking.order_id);
        }
        return { success: true };
    }
    catch (error) {
        console.error('Failed to cancel call:', error);
        return { success: false, error: 'Failed to cancel call' };
    }
}
/**
 * Mark a call as completed with notes
 */
export async function completeCall(bookingId, notes) {
    try {
        const { data: booking, error: fetchError } = await supabase
            .from('call_bookings')
            .select('order_id')
            .eq('id', bookingId)
            .single();
        if (fetchError || !booking) {
            return { success: false, error: 'Booking not found' };
        }
        // Update booking
        const { error } = await supabase
            .from('call_bookings')
            .update({
            status: 'completed',
            call_notes: notes,
        })
            .eq('id', bookingId);
        if (error) {
            return { success: false, error: error.message };
        }
        // Update order
        await supabase
            .from('orders')
            .update({
            discovery_call_completed_at: new Date().toISOString(),
            discovery_call_notes: notes,
        })
            .eq('id', booking.order_id);
        return { success: true };
    }
    catch (error) {
        console.error('Failed to complete call:', error);
        return { success: false, error: 'Failed to complete call' };
    }
}
/**
 * Get call booking for an order
 */
export async function getCallBookingForOrder(orderId) {
    try {
        const { data } = await supabase
            .from('call_bookings')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        return data;
    }
    catch {
        return null;
    }
}
/**
 * Check for upcoming calls that need reminders
 * This should be called by a scheduled job/cron
 */
export async function checkAndSendReminders() {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
    let sent24h = 0;
    let sent1h = 0;
    try {
        // Get calls scheduled within next 24 hours that haven't received 24h reminder
        const { data: calls24h } = await supabase
            .from('call_bookings')
            .select('id, order_id, scheduled_at')
            .eq('status', 'scheduled')
            .eq('reminder_sent_24h', false)
            .gte('scheduled_at', now.toISOString())
            .lte('scheduled_at', in24Hours.toISOString());
        for (const call of calls24h || []) {
            const { data: order } = await supabase
                .from('orders')
                .select('user_id')
                .eq('id', call.order_id)
                .single();
            if (order?.user_id) {
                await notificationHelpers.onDiscoveryCallReminder(order.user_id, call.order_id, 24);
                await supabase
                    .from('call_bookings')
                    .update({ reminder_sent_24h: true })
                    .eq('id', call.id);
                sent24h++;
            }
        }
        // Get calls scheduled within next 1 hour that haven't received 1h reminder
        const { data: calls1h } = await supabase
            .from('call_bookings')
            .select('id, order_id, scheduled_at')
            .eq('status', 'scheduled')
            .eq('reminder_sent_1h', false)
            .gte('scheduled_at', now.toISOString())
            .lte('scheduled_at', in1Hour.toISOString());
        for (const call of calls1h || []) {
            const { data: order } = await supabase
                .from('orders')
                .select('user_id')
                .eq('id', call.order_id)
                .single();
            if (order?.user_id) {
                await notificationHelpers.onDiscoveryCallReminder(order.user_id, call.order_id, 1);
                await supabase
                    .from('call_bookings')
                    .update({ reminder_sent_1h: true })
                    .eq('id', call.id);
                sent1h++;
            }
        }
    }
    catch (error) {
        console.error('Failed to send reminders:', error);
    }
    return { sent24h, sent1h };
}
