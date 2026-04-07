/**
 * Cloudinary Upload Utilities
 *
 * Provides functions for securely uploading images to Cloudinary
 * using signed requests via the backend edge function.
 */
import { appDataClient } from '@/lib/static-client';
import { CLOUDINARY_CLOUD_NAME } from './cloudinary';
/**
 * Get a signed upload URL from the backend
 */
async function getUploadSignature(options) {
    const { data, error } = await appDataClient.functions.invoke('cloudinary-signature', {
        body: {
            folder: options.folder || 'uploads',
            uploadPreset: options.uploadPreset,
            publicId: options.publicId,
            eager: options.eager,
            tags: options.tags,
        },
    });
    if (error) {
        throw new Error(`Failed to get upload signature: ${error.message}`);
    }
    return data;
}
/**
 * Upload a file to Cloudinary with signed request
 *
 * @example
 * const result = await uploadToCloudinary(file, {
 *   folder: 'gallery',
 *   tags: ['interior', 'living-room'],
 *   onProgress: (p) => console.log(`${p}% uploaded`),
 * })
 */
export async function uploadToCloudinary(file, options = {}) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are supported');
    }
    // Get max file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
    }
    // Get signature from backend
    const signatureData = await getUploadSignature(options);
    // Build form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('signature', signatureData.signature);
    formData.append('folder', signatureData.folder);
    if (signatureData.uploadPreset) {
        formData.append('upload_preset', signatureData.uploadPreset);
    }
    if (signatureData.publicId) {
        formData.append('public_id', signatureData.publicId);
    }
    if (signatureData.eager) {
        formData.append('eager', signatureData.eager);
    }
    if (signatureData.tags) {
        formData.append('tags', signatureData.tags.join(','));
    }
    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // Track progress
        if (options.onProgress) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    options.onProgress?.(progress);
                }
            };
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve({
                        publicId: response.public_id,
                        secureUrl: response.secure_url,
                        width: response.width,
                        height: response.height,
                        format: response.format,
                        bytes: response.bytes,
                        resourceType: response.resource_type,
                        createdAt: response.created_at,
                    });
                }
                catch {
                    reject(new Error('Failed to parse upload response'));
                }
            }
            else {
                try {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.error?.message || 'Upload failed'));
                }
                catch {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            }
        };
        xhr.onerror = () => {
            reject(new Error('Network error during upload'));
        };
        xhr.open('POST', uploadUrl);
        xhr.send(formData);
    });
}
/**
 * Upload multiple files to Cloudinary
 */
export async function uploadMultipleToCloudinary(files, options = {}) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
        const result = await uploadToCloudinary(files[i], {
            ...options,
            onProgress: (progress) => options.onFileProgress?.(i, progress),
        });
        results.push(result);
        options.onFileComplete?.(i, result);
    }
    return results;
}
/**
 * Delete an image from Cloudinary (requires backend call)
 * Note: This requires additional edge function for security
 */
export async function deleteFromCloudinary(publicId) {
    // TODO: Implement delete endpoint if needed
    console.warn('Delete from Cloudinary not yet implemented:', publicId);
    return false;
}
/**
 * Check if Cloudinary upload is available
 */
export function isCloudinaryUploadEnabled() {
    return Boolean(CLOUDINARY_CLOUD_NAME);
}

