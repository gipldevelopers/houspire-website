import { lazy } from 'react';
/**
 * Lazy load component with retry logic
 */
export function lazyWithRetry(componentImport, name) {
    return lazy(() => {
        const maxRetries = 3;
        const retryDelay = 1000;
        const retry = async (attempt = 1) => {
            try {
                return await componentImport();
            }
            catch (error) {
                if (attempt >= maxRetries) {
                    console.error(`Failed to load ${name} after ${maxRetries} attempts`);
                    throw error;
                }
                console.warn(`Retry ${attempt}/${maxRetries} for ${name}`);
                await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                return retry(attempt + 1);
            }
        };
        return retry();
    });
}
/**
 * Preload component
 */
export function preloadComponent(componentImport) {
    componentImport();
}
