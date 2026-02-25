import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import { buildCloudinaryUrl, buildCloudinarySrcSet, buildBlurPlaceholder, isCloudinaryConfigured, isCloudinaryUrl, extractPublicId, CLOUDINARY_TRANSFORMS, } from '@/lib/cloudinary';
/**
 * Optimized image component with Cloudinary CDN support
 *
 * Features:
 * - Automatic format conversion (WebP/AVIF)
 * - Responsive srcset generation
 * - Blur-up placeholder effect
 * - Graceful fallback for non-Cloudinary images
 * - Priority loading for LCP optimization
 *
 * @example
 * // With Cloudinary public_id
 * <CloudinaryImage src="gallery/living-room" transform="card" alt="Living room" />
 *
 * // With existing Cloudinary URL
 * <CloudinaryImage src="https://res.cloudinary.com/..." alt="Room" />
 *
 * // With fallback for non-Cloudinary URLs
 * <CloudinaryImage src="https://example.com/image.jpg" alt="Image" />
 */
export function CloudinaryImage({ src, alt, transform = 'default', width, height, aspectRatio, objectFit = 'cover', priority = false, enableBlur = true, fallbackUrl, sizes = '100vw', className, ...props }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState('');
    // Determine if this is a Cloudinary image and get the public_id
    const imageConfig = useMemo(() => {
        // If Cloudinary isn't configured, use original URL
        if (!isCloudinaryConfigured()) {
            return { isCloudinary: false, url: src, srcset: '', blur: '' };
        }
        // Check if src is already a Cloudinary URL
        if (isCloudinaryUrl(src)) {
            const publicId = extractPublicId(src);
            if (publicId) {
                return {
                    isCloudinary: true,
                    url: buildCloudinaryUrl(publicId, transform),
                    srcset: buildCloudinarySrcSet(publicId),
                    blur: enableBlur ? buildBlurPlaceholder(publicId) : '',
                };
            }
        }
        // Check if src looks like a public_id (no http/https, no common extensions in path)
        if (!src.startsWith('http') && !src.startsWith('data:')) {
            return {
                isCloudinary: true,
                url: buildCloudinaryUrl(src, transform),
                srcset: buildCloudinarySrcSet(src),
                blur: enableBlur ? buildBlurPlaceholder(src) : '',
            };
        }
        // Non-Cloudinary URL - pass through
        return { isCloudinary: false, url: src, srcset: '', blur: '' };
    }, [src, transform, enableBlur]);
    // Set initial src
    useEffect(() => {
        setCurrentSrc(imageConfig.url);
        setHasError(false);
        setIsLoading(true);
    }, [imageConfig.url]);
    // Preload priority images
    useEffect(() => {
        if (priority && imageConfig.url) {
            const img = new Image();
            img.src = imageConfig.url;
        }
    }, [priority, imageConfig.url]);
    const handleLoad = () => {
        setIsLoading(false);
    };
    const handleError = () => {
        // Try fallback URL if available
        if (fallbackUrl && currentSrc !== fallbackUrl) {
            setCurrentSrc(fallbackUrl);
            return;
        }
        // If we were using Cloudinary transforms, try the original URL
        if (imageConfig.isCloudinary && currentSrc !== src && src.startsWith('http')) {
            setCurrentSrc(src);
            return;
        }
        setIsLoading(false);
        setHasError(true);
    };
    const containerStyle = {
        aspectRatio: aspectRatio,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
    };
    return (<div className={cn('relative overflow-hidden bg-muted', className)} style={containerStyle}>
      {/* Blur Placeholder */}
      {isLoading && enableBlur && imageConfig.blur && (<img src={imageConfig.blur} alt="" className="absolute inset-0 w-full h-full object-cover blur-lg scale-110" aria-hidden="true"/>)}

      {/* Loading Skeleton */}
      {isLoading && !imageConfig.blur && (<div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"/>)}

      {/* Main Image */}
      {!hasError ? (<img src={currentSrc} alt={alt} srcSet={imageConfig.srcset || undefined} sizes={imageConfig.srcset ? sizes : undefined} loading={priority ? 'eager' : 'lazy'} decoding={priority ? 'sync' : 'async'} onLoad={handleLoad} onError={handleError} className={cn('w-full h-full transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100', objectFit === 'cover' && 'object-cover', objectFit === 'contain' && 'object-contain', objectFit === 'fill' && 'object-fill', objectFit === 'none' && 'object-none', objectFit === 'scale-down' && 'object-scale-down')} {...props}/>) : (<div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <ImageOff className="h-8 w-8 mx-auto mb-2"/>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>)}
    </div>);
}
// Export transform presets for convenience
export { CLOUDINARY_TRANSFORMS };
