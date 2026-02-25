/**
 * Performance monitoring utilities
 */
// Track page load performance
export function trackPageLoad() {
    if (typeof window === 'undefined')
        return;
    window.addEventListener('load', () => {
        // Use Navigation Timing API
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const pageLoadTime = navigation.loadEventEnd - navigation.startTime;
            if (process.env.NODE_ENV !== 'production') {
                console.log('📊 Performance Metrics:');
                console.log(`Page Load Time: ${pageLoadTime.toFixed(2)}ms`);
                console.log(`DOM Content Loaded: ${navigation.domContentLoadedEventEnd.toFixed(2)}ms`);
                console.log(`First Byte: ${navigation.responseStart.toFixed(2)}ms`);
            }
            // Track to analytics
            const gtag = window.gtag;
            if (gtag) {
                gtag('event', 'timing_complete', {
                    name: 'page_load',
                    value: Math.round(pageLoadTime),
                });
            }
        }
        // Paint metrics
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach((entry) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
                }
            });
        }
    });
}
// Track Core Web Vitals
export function trackWebVitals() {
    if (typeof window === 'undefined')
        return;
    // Largest Contentful Paint (LCP)
    const observeLCP = () => {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (process.env.NODE_ENV !== 'production') {
                    console.log('LCP:', lastEntry.startTime.toFixed(2), 'ms');
                }
            });
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        }
        catch (e) {
            // LCP not supported
        }
    };
    // First Input Delay (FID)
    const observeFID = () => {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    const fidEntry = entry;
                    const fid = fidEntry.processingStart - fidEntry.startTime;
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('FID:', fid.toFixed(2), 'ms');
                    }
                });
            });
            observer.observe({ type: 'first-input', buffered: true });
        }
        catch (e) {
            // FID not supported
        }
    };
    // Cumulative Layout Shift (CLS)
    const observeCLS = () => {
        try {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const layoutShift = entry;
                    if (!layoutShift.hadRecentInput) {
                        clsValue += layoutShift.value;
                        if (process.env.NODE_ENV !== 'production') {
                            console.log('CLS:', clsValue.toFixed(4));
                        }
                    }
                }
            });
            observer.observe({ type: 'layout-shift', buffered: true });
        }
        catch (e) {
            // CLS not supported
        }
    };
    observeLCP();
    observeFID();
    observeCLS();
}
// Measure component render time
export function measureRenderTime(componentName) {
    const startTime = performance.now();
    return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        if (renderTime > 50 && process.env.NODE_ENV !== 'production') {
            console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
        }
    };
}
// Debounce function for performance
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
// Throttle function for performance
export function throttle(func, limit) {
    let inThrottle = false;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
// Memory usage tracking
export function trackMemoryUsage() {
    if (typeof window === 'undefined')
        return;
    const memory = performance.memory;
    if (memory && process.env.NODE_ENV !== 'production') {
        console.log('Memory Usage:', {
            used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
            total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        });
    }
}
