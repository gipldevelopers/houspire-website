/**
 * Image Optimization Utilities for Gallery
 */
import { appDataClient } from '@/lib/static-client';
// Standard responsive image widths
export const RESPONSIVE_WIDTHS = [400, 800, 1200, 1920];
/**
 * Generate responsive srcset from base URL
 */
export function generateSrcSet(baseUrl, widths = RESPONSIVE_WIDTHS) {
    // For Supabase Storage URLs, append width parameter
    if (baseUrl.includes('appDataClient')) {
        return widths.map(w => `${baseUrl}?width=${w} ${w}w`).join(', ');
    }
    // For other URLs, just return widths
    return widths.map(w => `${baseUrl} ${w}w`).join(', ');
}
/**
 * Get optimal image size based on container width
 */
export function getOptimalSize(containerWidth) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const targetWidth = containerWidth * devicePixelRatio;
    // Find the smallest size that's larger than target
    for (const width of RESPONSIVE_WIDTHS) {
        if (width >= targetWidth) {
            return width;
        }
    }
    return RESPONSIVE_WIDTHS[RESPONSIVE_WIDTHS.length - 1];
}
/**
 * Preload an image
 */
export function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
    });
}
/**
 * Preload multiple images
 */
export async function preloadImages(urls) {
    await Promise.allSettled(urls.map(preloadImage));
}
/**
 * Check WebP support
 */
export function supportsWebP() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}
/**
 * Compress image client-side before upload
 */
export async function compressImageForUpload(file, options = {}) {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.85, format = supportsWebP() ? 'webp' : 'jpeg' } = options;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                // Calculate new dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                // Draw with smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    }
                    else {
                        reject(new Error('Failed to compress image'));
                    }
                }, `image/${format}`, quality);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
/**
 * Upload and optimize image via edge function
 */
export async function uploadAndOptimize(file, bucket = 'gallery-images', folder = 'uploads') {
    // First compress client-side
    const compressed = await compressImageForUpload(file);
    // Upload to storage
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { data: uploadData, error: uploadError } = await appDataClient.storage
        .from(bucket)
        .upload(fileName, compressed, {
        contentType: 'image/jpeg',
        cacheControl: '31536000',
    });
    if (uploadError)
        throw uploadError;
    const { data: urlData } = appDataClient.storage
        .from(bucket)
        .getPublicUrl(fileName);
    const originalUrl = urlData.publicUrl;
    // Call edge function for server-side optimization
    try {
        const { data: optimizeData } = await appDataClient.functions.invoke('compress-image', {
            body: {
                imageUrl: originalUrl,
                sizes: RESPONSIVE_WIDTHS,
                quality: 85,
            },
        });
        if (optimizeData?.srcset) {
            return {
                originalUrl,
                srcset: optimizeData.srcset,
                thumbnailUrl: optimizeData.compressed?.['400w'] || originalUrl,
            };
        }
    }
    catch (error) {
        console.warn('Server optimization failed, using original:', error);
    }
    // Fallback to original URL
    return {
        originalUrl,
        srcset: generateSrcSet(originalUrl),
        thumbnailUrl: originalUrl,
    };
}
/**
 * Lazy load observer for images
 */
export function createImageObserver(callback, options) {
    return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback(entry);
            }
        });
    }, {
        rootMargin: '200px',
        threshold: 0.01,
        ...options,
    });
}
/**
 * Get blur data URL placeholder
 */
export function getBlurPlaceholder(color = '#e5e5e5') {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='${encodeURIComponent(color)}' width='100' height='100'/%3E%3C/svg%3E`;
}

