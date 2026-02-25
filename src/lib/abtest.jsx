import { useState, useCallback, createContext, useContext } from 'react';
const ABTestContext = createContext(null);
// Simple hash function for consistent bucketing
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
// Get or create a persistent user ID for experiment assignment
function getExperimentUserId() {
    const key = 'houspire_exp_uid';
    let uid = localStorage.getItem(key);
    if (!uid) {
        uid = `exp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem(key, uid);
    }
    return uid;
}
// Defined experiments
export const EXPERIMENTS = {
    hero_cta: {
        id: 'hero_cta',
        variants: ['control', 'variant_a'],
        weights: [50, 50],
    },
    pricing_layout: {
        id: 'pricing_layout',
        variants: ['cards', 'comparison_table'],
        weights: [70, 30],
    },
    checkout_flow: {
        id: 'checkout_flow',
        variants: ['standard', 'simplified'],
        weights: [50, 50],
    },
};
function assignVariant(experiment, userId) {
    const hash = hashString(`${experiment.id}:${userId}`);
    const weights = experiment.weights || experiment.variants.map(() => 100 / experiment.variants.length);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const normalized = hash % totalWeight;
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (normalized < cumulative) {
            return experiment.variants[i];
        }
    }
    return experiment.variants[0];
}
export function useABTest(experimentId) {
    const ctx = useContext(ABTestContext);
    if (ctx)
        return ctx.getVariant(experimentId);
    // Fallback if used outside provider
    const [variant] = useState(() => {
        const storageKey = `ab_${experimentId}`;
        const stored = localStorage.getItem(storageKey);
        if (stored)
            return stored;
        const experiment = EXPERIMENTS[experimentId];
        if (!experiment)
            return 'control';
        const userId = getExperimentUserId();
        const assigned = assignVariant(experiment, userId);
        localStorage.setItem(storageKey, assigned);
        return assigned;
    });
    return variant;
}
export function useABTrack() {
    return useCallback((experimentId, eventName) => {
        const variant = localStorage.getItem(`ab_${experimentId}`) || 'unknown';
        // Log to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[A/B] ${experimentId}:${variant} → ${eventName}`);
        }
        // Store conversion events locally for batch upload
        const conversionsKey = 'ab_conversions';
        const existing = JSON.parse(localStorage.getItem(conversionsKey) || '[]');
        existing.push({
            experiment_id: experimentId,
            variant,
            event: eventName,
            timestamp: new Date().toISOString(),
            user_id: getExperimentUserId(),
        });
        // Keep last 100 conversions
        if (existing.length > 100)
            existing.splice(0, existing.length - 100);
        localStorage.setItem(conversionsKey, JSON.stringify(existing));
    }, []);
}
// Provider component
export function ABTestProvider({ children }) {
    const userId = getExperimentUserId();
    const getVariant = useCallback((experimentId) => {
        const storageKey = `ab_${experimentId}`;
        const stored = localStorage.getItem(storageKey);
        if (stored)
            return stored;
        const experiment = EXPERIMENTS[experimentId];
        if (!experiment)
            return 'control';
        const assigned = assignVariant(experiment, userId);
        localStorage.setItem(storageKey, assigned);
        return assigned;
    }, [userId]);
    const trackConversion = useCallback((experimentId, eventName) => {
        const variant = localStorage.getItem(`ab_${experimentId}`) || 'unknown';
        const conversionsKey = 'ab_conversions';
        const existing = JSON.parse(localStorage.getItem(conversionsKey) || '[]');
        existing.push({
            experiment_id: experimentId,
            variant,
            event: eventName,
            timestamp: new Date().toISOString(),
            user_id: userId,
        });
        if (existing.length > 100)
            existing.splice(0, existing.length - 100);
        localStorage.setItem(conversionsKey, JSON.stringify(existing));
    }, [userId]);
    return (<ABTestContext.Provider value={{ getVariant, trackConversion }}>
      {children}
    </ABTestContext.Provider>);
}
// Helper component for inline A/B testing
export function ABTest({ experimentId, control, variant, }) {
    const assignedVariant = useABTest(experimentId);
    return <>{assignedVariant === 'control' ? control : variant}</>;
}
