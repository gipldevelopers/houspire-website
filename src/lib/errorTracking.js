// Error tracking service - lightweight implementation
// Can be replaced with Sentry in production
class ErrorTracker {
    constructor() {
        this.errors = [];
        this.isInitialized = false;
        this.userId = null;
    }
    init() {
        if (this.isInitialized)
            return;
        this.isInitialized = true;
        // Global error handler
        window.addEventListener('error', (event) => {
            this.captureError(event.error || new Error(event.message), {
                type: 'unhandled_error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
            });
        });
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), { type: 'unhandled_promise_rejection' });
        });
        console.log('🔍 Error tracking initialized');
    }
    setUser(userId) {
        this.userId = userId;
    }
    captureError(error, context = {}) {
        const trackedError = {
            message: error.message,
            stack: error.stack,
            context: {
                ...context,
                userId: this.userId || context.userId,
                route: typeof window !== 'undefined' ? window.location.pathname : '',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            },
            timestamp: new Date(),
            level: 'error',
        };
        this.errors.push(trackedError);
        console.error('🔍 Error captured:', error.message, context);
        // In production, send to error tracking service
        this.sendToBackend(trackedError);
        // Keep only last 100 errors in memory
        if (this.errors.length > 100) {
            this.errors = this.errors.slice(-100);
        }
    }
    captureMessage(message, level = 'info', context = {}) {
        const trackedError = {
            message,
            context: {
                ...context,
                userId: this.userId || context.userId,
                route: typeof window !== 'undefined' ? window.location.pathname : '',
            },
            timestamp: new Date(),
            level,
        };
        this.errors.push(trackedError);
        console.log(`🔍 Message captured [${level}]:`, message);
        if (level === 'error') {
            this.sendToBackend(trackedError);
        }
    }
    async sendToBackend(error) {
        try {
            // In production, send to Sentry or custom endpoint
            // await fetch('/api/errors', {
            //   method: 'POST',
            //   body: JSON.stringify(error),
            // })
            // For now, just log
            if (error.level === 'error') {
                console.group('🔍 Error Report');
                console.log('Message:', error.message);
                console.log('Context:', error.context);
                console.log('Stack:', error.stack);
                console.groupEnd();
            }
        }
        catch (e) {
            // Silently fail - don't cause more errors
            console.warn('Failed to send error to backend:', e);
        }
    }
    getRecentErrors() {
        return this.errors.slice(-20);
    }
    clearErrors() {
        this.errors = [];
    }
}
export const errorTracker = new ErrorTracker();
// React Error Boundary helper
export function captureComponentError(error, errorInfo) {
    errorTracker.captureError(error, {
        componentStack: errorInfo.componentStack,
        type: 'react_error_boundary',
    });
}
