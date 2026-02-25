// Register service worker
export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });
            console.log('Service Worker registered:', registration);
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' &&
                            navigator.serviceWorker.controller) {
                            // New service worker available
                            if (confirm('New version available! Reload to update?')) {
                                window.location.reload();
                            }
                        }
                    });
                }
            });
            return registration;
        }
        catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}
// Request notification permission
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
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
// Subscribe to push notifications
export async function subscribeToPushNotifications(registration) {
    try {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
            console.log('VAPID key not configured');
            return null;
        }
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKey,
        });
        console.log('Push subscription:', subscription);
        return subscription;
    }
    catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        return null;
    }
}
// Check if app is running as PWA
export function isPWA() {
    return (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://'));
}
// Install prompt handler
let deferredPrompt = null;
// Listen for install prompt
if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });
}
// Prompt to install PWA
export async function promptInstall() {
    if (!deferredPrompt) {
        return false;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
    return outcome === 'accepted';
}
// Check if can install
export function canInstall() {
    return deferredPrompt !== null;
}
// Add to home screen banner
export function showInstallBanner() {
    // Don't show if already installed
    if (isPWA())
        return false;
    // Don't show if previously dismissed
    if (localStorage.getItem('installBannerDismissed'))
        return false;
    // Don't show on desktop (optional)
    if (window.innerWidth > 1024)
        return false;
    return true;
}
// Dismiss install banner
export function dismissInstallBanner() {
    localStorage.setItem('installBannerDismissed', 'true');
}
// Check for app updates
export async function checkForUpdates(registration) {
    try {
        await registration.update();
        console.log('Checked for updates');
    }
    catch (error) {
        console.error('Failed to check for updates:', error);
    }
}
// Share API
export async function shareContent(data) {
    if (!navigator.share) {
        // Fallback to copy link
        await navigator.clipboard.writeText(data.url);
        return { success: true, method: 'clipboard' };
    }
    try {
        await navigator.share(data);
        return { success: true, method: 'share' };
    }
    catch (error) {
        console.error('Share failed:', error);
        return { success: false, method: 'share', error };
    }
}
