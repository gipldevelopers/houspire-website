/**
 * Gallery Dual Upload Service
 *
 * Uploads images to both Cloudinary CDN (primary) and Supabase Storage (backup).
 * Returns both URLs for database storage.
 */
import { appDataClient } from '@/lib/static-client';
import { uploadToCloudinary } from './cloudinaryUpload';
/**
 * Upload a gallery image to both Cloudinary and Supabase Storage
 */
export async function uploadGalleryImage(file, options) {
    const { roomType, style, title, description, tags = [], designerId, projectId, onProgress } = options;
    // Generate a unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${sanitizedName}`;
    // Phase 1: Upload to Cloudinary (primary CDN)
    onProgress?.(0, 'cloudinary');
    let cloudinaryResult;
    try {
        cloudinaryResult = await uploadToCloudinary(file, {
            folder: `gallery/${roomType}`,
            tags: [roomType, style, ...tags],
            onProgress: (p) => onProgress?.(p * 0.6, 'cloudinary'), // 0-60%
        });
    }
    catch (error) {
        throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    // Phase 2: Upload to Supabase Storage (backup)
    onProgress?.(60, 'storage');
    let storageBackupUrl;
    try {
        const storagePath = `${roomType}/${style}/${filename}`;
        const { error: uploadError } = await appDataClient.storage
            .from('gallery-images')
            .upload(storagePath, file, {
            cacheControl: '31536000', // 1 year cache
            upsert: false,
        });
        if (uploadError) {
            console.warn('Storage backup failed, continuing with Cloudinary only:', uploadError.message);
            storageBackupUrl = ''; // Non-fatal - we still have Cloudinary
        }
        else {
            const { data: urlData } = appDataClient.storage
                .from('gallery-images')
                .getPublicUrl(storagePath);
            storageBackupUrl = urlData.publicUrl;
        }
    }
    catch (error) {
        console.warn('Storage backup error:', error);
        storageBackupUrl = '';
    }
    onProgress?.(80, 'storage');
    // Phase 3: Create database record
    const { data: dbRecord, error: dbError } = await appDataClient
        .from('gallery_images')
        .insert({
        image_url: cloudinaryResult.secureUrl, // Primary display URL
        cloudinary_public_id: cloudinaryResult.publicId,
        cloudinary_url: cloudinaryResult.secureUrl,
        storage_backup_url: storageBackupUrl || null,
        room_type: roomType,
        style: style,
        title: title || null,
        description: description || null,
        tags: tags.length > 0 ? tags : null,
        designer_id: designerId || null,
        project_id: projectId || null,
        original_size: file.size,
        metadata: {
            width: cloudinaryResult.width,
            height: cloudinaryResult.height,
            format: cloudinaryResult.format,
            bytes: cloudinaryResult.bytes,
            uploadedAt: new Date().toISOString(),
        },
    })
        .select('id')
        .single();
    if (dbError) {
        throw new Error(`Database insert failed: ${dbError.message}`);
    }
    onProgress?.(100, 'storage');
    return {
        id: dbRecord.id,
        cloudinaryPublicId: cloudinaryResult.publicId,
        cloudinaryUrl: cloudinaryResult.secureUrl,
        storageBackupUrl,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
    };
}
/**
 * Upload multiple gallery images with progress tracking
 */
export async function uploadMultipleGalleryImages(files, options) {
    const results = [];
    const errors = [];
    for (let i = 0; i < files.length; i++) {
        try {
            const result = await uploadGalleryImage(files[i], {
                ...options,
                onProgress: (progress, phase) => options.onFileProgress?.(i, progress, phase),
            });
            results.push(result);
            options.onFileComplete?.(i, result);
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            errors.push({ index: i, error: err });
            options.onFileError?.(i, err);
        }
    }
    return { results, errors };
}

