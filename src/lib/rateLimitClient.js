/**
 * Client-side rate limit handler
 */
export class RateLimitError extends Error {
    constructor(message, retryAfter, resetAt) {
        super(message);
        this.retryAfter = retryAfter;
        this.resetAt = resetAt;
        this.name = 'RateLimitError';
    }
}
/**
 * Parse rate limit headers from response
 */
export function parseRateLimitHeaders(response) {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    const retryAfter = response.headers.get('Retry-After');
    if (remaining === null || reset === null) {
        return null;
    }
    return {
        remaining: parseInt(remaining),
        resetAt: new Date(reset),
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
    };
}
/**
 * Handle rate limited response
 */
export async function handleRateLimitedResponse(response) {
    const data = await response.json();
    const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
    const resetAt = new Date(response.headers.get('X-RateLimit-Reset') || Date.now() + 60000);
    throw new RateLimitError(data.message || 'Rate limit exceeded', retryAfter, resetAt);
}
/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
    let lastError = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (error instanceof RateLimitError) {
                // Wait for the specified retry-after time
                const delay = error.retryAfter * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            else {
                // Exponential backoff for other errors
                const delay = initialDelay * Math.pow(2, i);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
}
/**
 * Format retry time for user display
 */
export function formatRetryTime(retryAfter) {
    if (retryAfter < 60) {
        return `${retryAfter} second${retryAfter !== 1 ? 's' : ''}`;
    }
    const minutes = Math.ceil(retryAfter / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
export function checkLocalRateLimit(config) {
    const now = Date.now();
    const storageKey = `rate_limit_${config.key}`;
    // Get stored data
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
        localStorage.setItem(storageKey, JSON.stringify({
            count: 1,
            windowStart: now,
        }));
        return { allowed: true, remaining: config.maxRequests - 1 };
    }
    const data = JSON.parse(stored);
    // Check if window expired
    if (now - data.windowStart > config.windowMs) {
        localStorage.setItem(storageKey, JSON.stringify({
            count: 1,
            windowStart: now,
        }));
        return { allowed: true, remaining: config.maxRequests - 1 };
    }
    // Check count
    if (data.count >= config.maxRequests) {
        const resetIn = Math.ceil((data.windowStart + config.windowMs - now) / 1000);
        return { allowed: false, remaining: 0, resetIn };
    }
    // Increment count
    localStorage.setItem(storageKey, JSON.stringify({
        count: data.count + 1,
        windowStart: data.windowStart,
    }));
    return { allowed: true, remaining: config.maxRequests - data.count - 1 };
}
/**
 * Predefined rate limit configs
 */
export const RATE_LIMITS = {
    fileUpload: {
        key: 'file_upload',
        maxRequests: 50,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
    payment: {
        key: 'payment_attempt',
        maxRequests: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
    feedback: {
        key: 'feedback_submit',
        maxRequests: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
    support: {
        key: 'support_ticket',
        maxRequests: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
    },
};
