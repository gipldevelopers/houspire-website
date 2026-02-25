/**
 * Cloudinary CDN Integration Utilities
 *
 * Provides URL building, responsive image generation, and transform presets
 * for optimized image delivery via Cloudinary's global CDN.
 */
// Cloud name from environment (public, safe for frontend)
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';
// Standard responsive image widths
export const CLOUDINARY_WIDTHS = [400, 800, 1200, 1920];
/**
 * Transform presets for common use cases
 * Format: Cloudinary URL transformation string
 *
 * c_fill = crop to fill exact dimensions
 * c_limit = resize within bounds, maintain aspect ratio
 * q_auto = automatic quality optimization
 * f_auto = automatic format (WebP/AVIF when supported)
 * r_max = maximum border radius (circular)
 */
export const CLOUDINARY_TRANSFORMS = {
    // Thumbnails for galleries and grids
    thumbnail: 'c_fill,w_400,h_300,q_auto,f_auto',
    thumbnailSquare: 'c_fill,w_400,h_400,q_auto,f_auto',
    // Card images
    card: 'c_fill,w_800,h_600,q_auto,f_auto',
    cardWide: 'c_fill,w_800,h_450,q_auto,f_auto',
    cardWatermarked: 'c_fill,w_800,h_600,q_auto,f_auto/l_text:Arial_56:Houspire,co_rgb:f97316,o_22/fl_layer_apply,g_center',
    // Hero and banner images
    hero: 'c_fill,w_1920,h_1080,q_auto,f_auto',
    heroBanner: 'c_fill,w_1920,h_600,q_auto,f_auto',
    // Gallery and portfolio
    gallery: 'c_limit,w_1200,q_auto,f_auto',
    galleryFull: 'c_limit,w_1920,q_auto,f_auto',
    galleryFullWatermarked: 'c_limit,w_1920,q_auto,f_auto/l_text:Arial_72:Houspire,co_rgb:f97316,o_18/fl_layer_apply,g_center',
    // Avatars and profiles
    avatar: 'c_fill,w_200,h_200,r_max,q_auto,f_auto',
    avatarLarge: 'c_fill,w_400,h_400,r_max,q_auto,f_auto',
    // Style covers
    styleCover: 'c_fill,w_800,h_600,q_auto:best,f_auto',
    styleHero: 'c_fill,w_1920,h_800,q_auto:best,f_auto',
    // Blur placeholder (low quality for LQIP)
    blur: 'c_limit,w_50,q_30,f_auto,e_blur:1000',
    // Default - just optimize
    default: 'q_auto,f_auto',
};
/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured() {
    return Boolean(CLOUDINARY_CLOUD_NAME);
}
/**
 * Build a Cloudinary delivery URL from a public_id
 *
 * @param publicId - The Cloudinary public_id of the image
 * @param transforms - Transform string or preset name
 * @returns Full Cloudinary URL
 *
 * @example
 * buildCloudinaryUrl('gallery/living-room-1', 'thumbnail')
 * // => https://res.cloudinary.com/CLOUD/image/upload/c_fill,w_400,h_300,q_auto,f_auto/gallery/living-room-1
 */
export function buildCloudinaryUrl(publicId, transforms = 'default') {
    if (!CLOUDINARY_CLOUD_NAME || !publicId) {
        return '';
    }
    // Use preset if it's a known transform name
    const transformString = transforms in CLOUDINARY_TRANSFORMS
        ? CLOUDINARY_TRANSFORMS[transforms]
        : transforms;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}
/**
 * Build a responsive srcset for an image
 *
 * @param publicId - The Cloudinary public_id
 * @param widths - Array of widths to generate
 * @returns srcset string for use in img element
 */
export function buildCloudinarySrcSet(publicId, widths = CLOUDINARY_WIDTHS) {
    if (!CLOUDINARY_CLOUD_NAME || !publicId) {
        return '';
    }
    return widths
        .map(w => `${buildCloudinaryUrl(publicId, `c_limit,w_${w},q_auto,f_auto`)} ${w}w`)
        .join(', ');
}
/**
 * Build a blur placeholder URL for LQIP (Low Quality Image Placeholder)
 */
export function buildBlurPlaceholder(publicId) {
    return buildCloudinaryUrl(publicId, 'blur');
}
/**
 * Build responsive sizes attribute based on breakpoints
 */
export function buildSizes(config) {
    const parts = [];
    if (config.mobile) {
        parts.push(`(max-width: 640px) ${config.mobile}`);
    }
    if (config.tablet) {
        parts.push(`(max-width: 1024px) ${config.tablet}`);
    }
    if (config.desktop) {
        parts.push(`(max-width: 1280px) ${config.desktop}`);
    }
    parts.push(config.default || '100vw');
    return parts.join(', ');
}
/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url) {
    return url.includes('res.cloudinary.com');
}
/**
 * Extract public_id from a Cloudinary URL
 */
export function extractPublicId(cloudinaryUrl) {
    if (!isCloudinaryUrl(cloudinaryUrl)) {
        return null;
    }
    try {
        // URL format: https://res.cloudinary.com/CLOUD/image/upload/TRANSFORMS/PUBLIC_ID
        const url = new URL(cloudinaryUrl);
        const pathParts = url.pathname.split('/');
        // Find 'upload' index and get everything after transforms
        const uploadIndex = pathParts.indexOf('upload');
        if (uploadIndex === -1)
            return null;
        // Skip the transform segment(s) and join the rest as public_id
        // Transforms usually start with letters like c_, w_, q_, f_, etc.
        const afterUpload = pathParts.slice(uploadIndex + 1);
        // Find first segment that doesn't look like a transform
        const publicIdStart = afterUpload.findIndex(part => !part.includes(',') && !part.match(/^[a-z]_/));
        if (publicIdStart === -1)
            return afterUpload.join('/');
        return afterUpload.slice(publicIdStart).join('/');
    }
    catch {
        return null;
    }
}
/**
 * Apply transforms to an existing Cloudinary URL
 */
export function applyTransformsToUrl(cloudinaryUrl, transforms) {
    const publicId = extractPublicId(cloudinaryUrl);
    if (!publicId)
        return cloudinaryUrl;
    return buildCloudinaryUrl(publicId, transforms);
}
/**
 * Get optimal image URL based on container width
 */
export function getOptimalCloudinaryUrl(publicId, containerWidth, options = {}) {
    const { aspectRatio, crop = 'limit', quality = 'auto' } = options;
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const targetWidth = Math.ceil(containerWidth * devicePixelRatio);
    // Find the smallest size that's larger than target
    const optimalWidth = CLOUDINARY_WIDTHS.find(w => w >= targetWidth)
        || CLOUDINARY_WIDTHS[CLOUDINARY_WIDTHS.length - 1];
    let transforms = `c_${crop},w_${optimalWidth}`;
    if (aspectRatio) {
        transforms += `,ar_${aspectRatio.replace(':', '_')}`;
    }
    transforms += `,q_${quality},f_auto`;
    return buildCloudinaryUrl(publicId, transforms);
}
