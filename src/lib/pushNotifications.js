// Push Notifications Helper
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        return false;
    }
    if (Notification.permission === 'granted') {
        return true;
    }
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
}
export async function registerPushNotification(userId) {
    try {
        const permission = await requestNotificationPermission();
        if (!permission) {
            return { success: false, error: 'Permission denied' };
        }
        // Check if service worker is registered
        if (!('serviceWorker' in navigator)) {
            return { success: false, error: 'Service worker not supported' };
        }
        const registration = await navigator.serviceWorker.ready;
        // Check if VAPID key is available
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
            console.warn('VAPID public key not configured');
            return { success: false, error: 'Push notifications not configured' };
        }
        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKey,
        });
        const subscriptionJSON = subscription.toJSON();
        // Save subscription to database
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase.rpc('register_push_subscription', {
            p_endpoint: subscriptionJSON.endpoint || '',
            p_p256dh_key: subscriptionJSON.keys?.p256dh || '',
            p_auth_key: subscriptionJSON.keys?.auth || '',
            p_browser: getBrowserName(),
            p_os: navigator.platform,
        });
        if (error)
            throw error;
        return { success: true, subscription: subscriptionJSON };
    }
    catch (error) {
        console.error('Failed to register push notification:', error);
        return { success: false, error };
    }
}
export async function unregisterPushNotification() {
    try {
        if (!('serviceWorker' in navigator)) {
            return { success: false, error: 'Service worker not supported' };
        }
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
            // Remove from database
            const { supabase } = await import('@/integrations/supabase/client');
            await supabase.rpc('unregister_push_subscription', {
                p_endpoint: subscription.endpoint,
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error('Failed to unregister push notification:', error);
        return { success: false, error };
    }
}
function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome'))
        return 'Chrome';
    if (userAgent.includes('Firefox'))
        return 'Firefox';
    if (userAgent.includes('Safari'))
        return 'Safari';
    if (userAgent.includes('Edge'))
        return 'Edge';
    return 'Unknown';
}
export function showLocalNotification(title, options) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/favicon-96x96.png',
            ...options,
        });
    }
}
export function isPushSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}
export function getPushPermissionStatus() {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
}
