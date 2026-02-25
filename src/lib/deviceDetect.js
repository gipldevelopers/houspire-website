/**
 * Device detection and responsive utilities
 */
export function isMobile() {
    if (typeof window === 'undefined')
        return false;
    return window.innerWidth < 768;
}
export function isTablet() {
    if (typeof window === 'undefined')
        return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
}
export function isDesktop() {
    if (typeof window === 'undefined')
        return false;
    return window.innerWidth >= 1024;
}
export function isTouchDevice() {
    if (typeof window === 'undefined')
        return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
export function getDeviceType() {
    if (isMobile())
        return 'mobile';
    if (isTablet())
        return 'tablet';
    return 'desktop';
}
export function isIOS() {
    if (typeof window === 'undefined')
        return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
export function isAndroid() {
    if (typeof window === 'undefined')
        return false;
    return /Android/.test(navigator.userAgent);
}
export function isSafari() {
    if (typeof window === 'undefined')
        return false;
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
/**
 * Get safe area insets for iOS notch
 */
export function getSafeAreaInsets() {
    if (typeof window === 'undefined')
        return { top: 0, bottom: 0 };
    const style = getComputedStyle(document.documentElement);
    return {
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    };
}
