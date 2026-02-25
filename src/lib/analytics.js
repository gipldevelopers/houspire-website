/**
 * Analytics Utility
 * Tracks events to multiple analytics services (Google Analytics, Mixpanel)
 */
class Analytics {
    constructor() {
        this.userId = null;
        this.userProperties = {};
        this.eventQueue = [];
        this.isInitialized = false;
        this.isDev = process.env.NODE_ENV !== 'production';
        this.mixpanelInitialized = false;
    }
    init() {
        if (this.isInitialized)
            return;
        this.isInitialized = true;
        // Initialize Mixpanel if token exists
        if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
            try {
                const mixpanel = window.mixpanel;
                if (mixpanel) {
                    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
                        debug: this.isDev,
                        track_pageview: true,
                        persistence: 'localStorage',
                    });
                    this.mixpanelInitialized = true;
                }
            }
            catch (error) {
                console.error('Mixpanel initialization failed:', error);
            }
        }
        if (this.isDev) {
            console.log('📊 Analytics initialized');
        }
        // Flush events periodically
        setInterval(() => this.flush(), 30000);
    }
    identify(userId, properties = {}) {
        this.userId = userId;
        this.userProperties = { ...this.userProperties, ...properties };
        if (this.isDev) {
            console.log('📊 User identified:', userId, properties);
        }
        // Mixpanel
        if (this.mixpanelInitialized) {
            const mixpanel = window.mixpanel;
            if (mixpanel) {
                mixpanel.identify(userId);
                if (Object.keys(properties).length > 0) {
                    mixpanel.people.set(properties);
                }
            }
        }
        // Google Analytics
        const gtag = window.gtag;
        if (gtag) {
            gtag('set', 'user_id', userId);
            if (Object.keys(properties).length > 0) {
                gtag('set', 'user_properties', properties);
            }
        }
        this.track('user_identified', properties);
    }
    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                userId: this.userId,
                timestamp: new Date().toISOString(),
                url: typeof window !== 'undefined' ? window.location.href : '',
                referrer: typeof document !== 'undefined' ? document.referrer : '',
            },
            timestamp: new Date(),
        };
        this.eventQueue.push(event);
        if (this.isDev) {
            console.log('📊 Event tracked:', eventName, properties);
        }
        // Mixpanel
        if (this.mixpanelInitialized) {
            const mixpanel = window.mixpanel;
            if (mixpanel) {
                mixpanel.track(eventName, properties);
            }
        }
        // Google Analytics
        const gtag = window.gtag;
        if (gtag) {
            gtag('event', eventName, properties);
        }
        // Flush immediately for important events
        const immediateEvents = ['purchase_completed', 'signup_completed', 'project_created', 'payment_completed'];
        if (immediateEvents.includes(eventName)) {
            this.flush();
        }
    }
    page(pageName, properties = {}) {
        if (this.isDev) {
            console.log('📄 Page view:', pageName, properties);
        }
        // Mixpanel
        if (this.mixpanelInitialized) {
            const mixpanel = window.mixpanel;
            if (mixpanel) {
                mixpanel.track('Page View', { page: pageName, ...properties });
            }
        }
        // Google Analytics
        const gtag = window.gtag;
        if (gtag) {
            gtag('event', 'page_view', {
                page_title: pageName,
                page_location: window.location.href,
                page_path: window.location.pathname,
                ...properties,
            });
        }
        this.track('page_view', { page: pageName, ...properties });
    }
    async flush() {
        if (this.eventQueue.length === 0)
            return;
        const events = [...this.eventQueue];
        this.eventQueue = [];
        try {
            if (this.isDev) {
                console.log('📊 Flushing', events.length, 'events');
            }
            // In production, you could send to a custom analytics endpoint
        }
        catch (error) {
            this.eventQueue = [...events, ...this.eventQueue];
            console.error('📊 Analytics flush failed:', error);
        }
    }
    reset() {
        this.userId = null;
        this.userProperties = {};
        this.eventQueue = [];
        if (this.mixpanelInitialized) {
            const mixpanel = window.mixpanel;
            if (mixpanel) {
                mixpanel.reset();
            }
        }
        if (this.isDev) {
            console.log('📊 Analytics reset');
        }
    }
}
export const analytics = new Analytics();
// ============================================
// PREDEFINED EVENT TRACKERS
// ============================================
export const trackEvents = {
    // Onboarding
    signupStarted: () => analytics.track('signup_started'),
    signupCompleted: (method) => analytics.track('signup_completed', { method }),
    loginCompleted: () => analytics.track('login_completed'),
    logoutCompleted: () => {
        analytics.track('logout_completed');
        analytics.reset();
    },
    // Quiz Events
    quizStarted: () => analytics.track('quiz_started'),
    quizStepCompleted: (step) => analytics.track('quiz_step_completed', { step }),
    quizCompleted: (designer, matchScore) => analytics.track('quiz_completed', { matched_designer: designer, match_score: matchScore }),
    // Pricing & Checkout
    viewedPricing: () => analytics.track('viewed_pricing'),
    selectedPackage: (packageName, price) => analytics.track('selected_package', { packageName, price }),
    addedToCart: (item, price) => analytics.track('added_to_cart', { item, price }),
    checkoutStarted: (total) => analytics.track('checkout_started', { total, currency: 'INR' }),
    paymentInitiated: (amount, orderId) => analytics.track('payment_initiated', { value: amount, currency: 'INR', order_id: orderId }),
    purchaseCompleted: (total, projectId) => analytics.track('purchase_completed', { total, projectId, currency: 'INR' }),
    paymentFailed: (error) => analytics.track('payment_failed', { error }),
    paymentRetry: (orderId) => analytics.track('payment_retry', { order_id: orderId }),
    // Intake Form
    intakeStarted: (projectId) => analytics.track('intake_started', { project_id: projectId }),
    intakeStepCompleted: (step, projectId) => analytics.track('intake_step_completed', { step, project_id: projectId }),
    intakeCompleted: (projectId, photosCount) => analytics.track('intake_completed', { project_id: projectId, photos_count: photosCount }),
    photoUploaded: (count) => analytics.track('photo_uploaded', { count }),
    // Content Events
    contentViewed: (contentType, projectId) => analytics.track('content_viewed', { content_type: contentType, project_id: projectId }),
    renderDownloaded: (projectId, renderId) => analytics.track('render_downloaded', { project_id: projectId, render_id: renderId }),
    allFilesDownloaded: (projectId, fileCount) => analytics.track('all_files_downloaded', { project_id: projectId, file_count: fileCount }),
    // Discovery Gallery
    viewedGallery: (filters) => analytics.track('viewed_gallery', { filters }),
    viewedDesign: (designId, style) => analytics.track('viewed_design', { designId, style }),
    savedDesign: (designId) => analytics.track('saved_design', { designId }),
    clickedGetThisDesign: (designId) => analytics.track('clicked_get_this_design', { designId }),
    // Dashboard
    viewedDashboard: () => analytics.track('viewed_dashboard'),
    downloadedPackage: (projectId) => analytics.track('downloaded_package', { projectId }),
    submittedFeedback: (projectId, rating) => analytics.track('submitted_feedback', { projectId, rating }),
    // Support
    openedSupport: () => analytics.track('opened_support'),
    submittedTicket: (category) => analytics.track('submitted_ticket', { category }),
    // Admin Events
    adminContentUploaded: (contentType, projectId, count) => analytics.track('admin_content_uploaded', { content_type: contentType, project_id: projectId, count }),
    adminContentPublished: (contentType, projectId) => analytics.track('admin_content_published', { content_type: contentType, project_id: projectId }),
    // Errors
    errorOccurred: (error, context) => analytics.track('error_occurred', { error, context }),
};
