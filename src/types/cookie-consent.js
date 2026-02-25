export const COOKIE_CONSENT_VERSION = '1.0.0';
export const COOKIE_CONSENT_KEY = 'houspire_cookie_consent';
export const COOKIE_CATEGORIES = {
    essential: {
        name: 'Essential Cookies',
        description: 'These cookies are necessary for the website to function and cannot be disabled. They are usually set in response to actions you take, such as setting privacy preferences, logging in, or filling in forms.',
        cookies: [
            'Authentication tokens',
            'Session management',
            'Security features',
            'User preferences'
        ]
    },
    analytics: {
        name: 'Analytics Cookies',
        description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our service.',
        cookies: [
            'Google Analytics',
            'Usage statistics',
            'Performance monitoring'
        ]
    },
    marketing: {
        name: 'Marketing Cookies',
        description: 'These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.',
        cookies: [
            'Google Ads',
            'Facebook Pixel',
            'Retargeting pixels'
        ]
    },
    functional: {
        name: 'Functional Cookies',
        description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
        cookies: [
            'Language preferences',
            'Theme settings',
            'Personalized content'
        ]
    }
};
