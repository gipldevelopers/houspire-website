import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_VERSION } from '@/types/cookie-consent';
/**
 * Get current cookie consent preferences
 */
export function getCookieConsent() {
    if (typeof window === 'undefined')
        return null;
    try {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!stored)
            return null;
        const parsed = JSON.parse(stored);
        // Check if consent version matches
        if (parsed.consent.version !== COOKIE_CONSENT_VERSION) {
            // Version mismatch - need new consent
            return null;
        }
        return parsed;
    }
    catch (error) {
        console.error('Error reading cookie consent:', error);
        return null;
    }
}
/**
 * Save cookie consent preferences
 */
export function saveCookieConsent(consent) {
    if (typeof window === 'undefined')
        return;
    const preferences = {
        hasConsented: true,
        consent: {
            ...consent,
            essential: true, // Always true
            timestamp: new Date().toISOString(),
            version: COOKIE_CONSENT_VERSION
        }
    };
    try {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
        // Trigger event for other components to react
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: preferences }));
        console.log('Cookie consent saved:', preferences);
    }
    catch (error) {
        console.error('Error saving cookie consent:', error);
    }
}
/**
 * Check if user has consented
 */
export function hasUserConsented() {
    const consent = getCookieConsent();
    return consent?.hasConsented || false;
}
/**
 * Check if specific category is allowed
 */
export function isCategoryAllowed(category) {
    const consent = getCookieConsent();
    if (!consent)
        return false;
    return consent.consent[category];
}
/**
 * Accept all cookies
 */
export function acceptAllCookies() {
    saveCookieConsent({
        analytics: true,
        marketing: true,
        functional: true
    });
}
/**
 * Accept only essential cookies
 */
export function acceptEssentialOnly() {
    saveCookieConsent({
        analytics: false,
        marketing: false,
        functional: false
    });
}
/**
 * Clear cookie consent (for testing)
 */
export function clearCookieConsent() {
    if (typeof window === 'undefined')
        return;
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: null }));
}
/**
 * Initialize analytics based on consent
 */
export function initializeAnalytics() {
    if (!isCategoryAllowed('analytics')) {
        console.log('Analytics disabled by user preference');
        return;
    }
    // Initialize Google Analytics or other analytics
    console.log('Analytics enabled - initializing...');
    // Example: Google Analytics
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        script.onload = () => {
            // @ts-ignore
            window.dataLayer = window.dataLayer || [];
            // @ts-ignore
            function gtag(...args) { window.dataLayer.push(args); }
            // @ts-ignore
            gtag('js', new Date());
            // @ts-ignore
            gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
        };
    }
}
/**
 * Initialize marketing pixels based on consent
 */
export function initializeMarketing() {
    if (!isCategoryAllowed('marketing')) {
        console.log('Marketing pixels disabled by user preference');
        return;
    }
    console.log('Marketing pixels enabled - initializing...');
    // Example: Facebook Pixel initialization would go here
    // Only run if FB_PIXEL_ID is configured
}
