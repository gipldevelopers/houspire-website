/**
 * Generate blur data URL for image placeholder
 */
export function generateBlurDataURL(width = 10, height = 10) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#e5e5e5');
        gradient.addColorStop(1, '#d4d4d4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    return canvas.toDataURL();
}
/**
 * Compress image file before upload
 */
export async function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                }
                else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    }
                    else {
                        reject(new Error('Failed to compress image'));
                    }
                }, 'image/jpeg', quality);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
/**
 * Validate image file
 */
export function validateImageFile(file, options = {}) {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], } = options;
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}`,
        };
    }
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File too large. Max: ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
        };
    }
    return { valid: true };
}
/**
 * Get image dimensions
 */
export function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
/**
 * Generate responsive srcset
 */
export function generateSrcSet(url, sizes = [640, 750, 828, 1080, 1200]) {
    return sizes.map(size => `${url} ${size}w`).join(', ');
}
