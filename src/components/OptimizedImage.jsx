import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
export function OptimizedImage({ src, alt, blurDataURL, aspectRatio, objectFit = 'cover', priority = false, className, ...props }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        if (priority && src) {
            const img = new Image();
            img.src = src;
        }
    }, [src, priority]);
    const handleLoad = () => {
        setIsLoading(false);
    };
    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };
    return (<div className={cn('relative overflow-hidden bg-muted', className)} style={{ aspectRatio }}>
      {/* Blur Placeholder */}
      {isLoading && blurDataURL && (<img src={blurDataURL} alt="" className="absolute inset-0 w-full h-full object-cover blur-lg scale-110" aria-hidden="true"/>)}

      {/* Loading Skeleton */}
      {isLoading && !blurDataURL && (<div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"/>)}

      {/* Main Image */}
      {!hasError ? (<img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} onLoad={handleLoad} onError={handleError} className={cn('w-full h-full transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100', objectFit === 'cover' && 'object-cover', objectFit === 'contain' && 'object-contain', objectFit === 'fill' && 'object-fill', objectFit === 'none' && 'object-none', objectFit === 'scale-down' && 'object-scale-down')} {...props}/>) : (<div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <ImageOff className="h-8 w-8 mx-auto mb-2"/>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>)}
    </div>);
}
