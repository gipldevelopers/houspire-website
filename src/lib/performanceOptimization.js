/**
 * Performance Optimization Helpers
 */
// Batch DOM updates using requestAnimationFrame
export function batchUpdates(callback) {
    requestAnimationFrame(() => {
        callback();
    });
}
// Throttle function execution
export function throttle(func, wait) {
    let timeout = null;
    let previous = 0;
    return function (...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        }
        else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}
// Memoize expensive computations
export function memoize(fn) {
    const cache = new Map();
    return ((...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    });
}
// Prefetch resource
export function prefetch(url, type = 'script') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = type;
    link.href = url;
    document.head.appendChild(link);
}
// Preconnect to domain
export function preconnect(domain) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
}
// Measure performance
export function measurePerformance(name, fn) {
    const start = performance.now();
    fn();
    const end = performance.now();
    if (process.env.NODE_ENV !== 'production') {
        console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    }
}
// Defer non-critical operations
export function defer(callback) {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
    }
    else {
        setTimeout(callback, 1);
    }
}
// Check if user prefers reduced motion
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
// Check connection quality
export function getConnectionQuality() {
    const nav = navigator;
    if (nav.connection?.effectiveType) {
        const type = nav.connection.effectiveType;
        if (type === 'slow-2g' || type === '2g')
            return 'slow';
        return 'fast';
    }
    return 'unknown';
}
