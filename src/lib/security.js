// XSS Prevention
export function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}
// SQL Injection Prevention (for display only, backend handles actual prevention)
export function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
}
// CSRF Token Generation
export function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
// Store CSRF token
export function setCSRFToken(token) {
    sessionStorage.setItem('csrf_token', token);
}
// Get CSRF token
export function getCSRFToken() {
    return sessionStorage.getItem('csrf_token');
}
// Validate URL
export function isValidURL(url) {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    }
    catch {
        return false;
    }
}
// Secure local storage with basic encoding
export function secureSetItem(key, value) {
    try {
        const encoded = btoa(JSON.stringify(value));
        localStorage.setItem(key, encoded);
    }
    catch (error) {
        console.error('Failed to store item securely:', error);
    }
}
export function secureGetItem(key) {
    try {
        const encoded = localStorage.getItem(key);
        if (!encoded)
            return null;
        return JSON.parse(atob(encoded));
    }
    catch (error) {
        console.error('Failed to retrieve item securely:', error);
        return null;
    }
}
// Rate limiting helper (client-side)
export function checkRateLimit(key, maxAttempts, windowMs) {
    const now = Date.now();
    const attempts = secureGetItem(`ratelimit_${key}`) || [];
    // Filter out old attempts
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < windowMs);
    if (recentAttempts.length >= maxAttempts) {
        return false;
    }
    // Add current attempt
    recentAttempts.push(now);
    secureSetItem(`ratelimit_${key}`, recentAttempts);
    return true;
}
// Detect suspicious activity
export function detectSuspiciousActivity() {
    const reasons = [];
    // Check for automated tools
    if (navigator.webdriver) {
        reasons.push('webdriver_detected');
    }
    // Check for unusual user agent
    if (!navigator.userAgent || navigator.userAgent.length < 50) {
        reasons.push('suspicious_user_agent');
    }
    // Check for plugins (headless browsers often have none)
    if (navigator.plugins.length === 0) {
        reasons.push('no_plugins');
    }
    return {
        suspicious: reasons.length > 2,
        reasons,
    };
}
// Validate email format
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Validate phone number (Indian format)
export function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}
// Escape HTML entities
export function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
// Generate secure random string
export function generateSecureId(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
