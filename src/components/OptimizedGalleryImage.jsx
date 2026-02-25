import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
export function OptimizedGalleryImage({ src, srcset, alt, className = '', priority = false, aspectRatio = '4/3', sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw', onLoad, onError, }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef(null);
    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || !imgRef.current)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.disconnect();
            }
        }, {
            rootMargin: '200px', // Start loading 200px before viewport
            threshold: 0.01,
        });
        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, [priority]);
    const handleLoad = () => {
        setLoaded(true);
        onLoad?.();
    };
    const handleError = () => {
        setError(true);
        onError?.();
    };
    return (<div ref={imgRef} className={cn('relative overflow-hidden bg-muted', className)} style={{ aspectRatio }}>
      {/* Blur placeholder / skeleton */}
      {!loaded && !error && (<div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"/>)}

      {/* Error state */}
      {error && (<div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Failed to load</span>
        </div>)}

      {/* Actual image - only render when in view */}
      {isInView && !error && (<img src={src} srcSet={srcset} sizes={sizes} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" onLoad={handleLoad} onError={handleError} className={cn('w-full h-full object-cover transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}/>)}
    </div>);
}
