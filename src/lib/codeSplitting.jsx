import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
/**
 * Default loading fallback component
 */
function DefaultFallback() {
    return (<div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary"/>
    </div>);
}
/**
 * Creates a lazy-loaded component with Suspense wrapper
 * Usage: const LazyDashboard = createLazyComponent(() => import('@/pages/Dashboard'))
 */
export function createLazyComponent(importFunc, fallback = <DefaultFallback />) {
    const LazyComponent = lazy(importFunc);
    return function LazyWrapper() {
        return (<Suspense fallback={fallback}>
        <LazyComponent />
      </Suspense>);
    };
}
/**
 * Preload a lazy component (call on hover/focus for better UX)
 */
export function preloadComponent(importFunc) {
    importFunc();
}
/**
 * Critical routes that should be preloaded on hover
 */
export const criticalRouteLoaders = {
    '/dashboard': () => import('@/pages/Dashboard'),
    '/checkout': () => import('@/pages/Checkout'),
};
/**
 * Preload a route by path (call on link hover)
 */
export function preloadRoute(path) {
    const loader = criticalRouteLoaders[path];
    if (loader) {
        loader();
    }
}
/**
 * Hook to preload on hover
 * Usage: <Link onMouseEnter={() => preloadRoute('/dashboard')}>Dashboard</Link>
 */
export function usePreloadOnHover(path) {
    return {
        onMouseEnter: () => preloadRoute(path),
        onFocus: () => preloadRoute(path),
    };
}
