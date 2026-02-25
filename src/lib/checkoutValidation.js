// Checkout form validation utilities
import { z } from 'zod';
/**
 * Customer contact information schema
 */
export const customerInfoSchema = z.object({
    customerName: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    customerEmail: z
        .string()
        .email('Please enter a valid email address')
        .max(255, 'Email must be less than 255 characters')
        .trim(),
    customerPhone: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits')
        .regex(/^[+]?[\d\s-]+$/, 'Please enter a valid phone number'),
    customerCity: z
        .string()
        .min(2, 'City must be at least 2 characters')
        .max(100, 'City must be less than 100 characters')
        .trim(),
    customerAddress: z
        .string()
        .max(500, 'Address must be less than 500 characters')
        .optional(),
});
/**
 * Project details schema
 */
export const projectDetailsSchema = z.object({
    propertyType: z.enum([
        'apartment',
        'villa',
        'independent_house',
        'duplex',
        'penthouse',
    ]),
    selectedRooms: z.array(z.string()).optional(),
    specialRequests: z
        .string()
        .max(2000, 'Special requests must be less than 2000 characters')
        .optional(),
    designPreferences: z
        .string()
        .max(2000, 'Design preferences must be less than 2000 characters')
        .optional(),
});
/**
 * Complete checkout form schema
 */
export const checkoutFormSchema = customerInfoSchema.merge(projectDetailsSchema).extend({
    agreedToTerms: z.literal(true, {
        errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
});
/**
 * Validate file size
 */
export function validateFileSize(file, maxSizeMB) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}
/**
 * Validate file type
 */
export function validateFileType(file, allowedTypes) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
}
/**
 * Validate floor plan file
 */
export function validateFloorPlan(file) {
    const maxSizeMB = 10;
    const allowedTypes = ['pdf', 'png', 'jpg', 'jpeg'];
    if (!validateFileSize(file, maxSizeMB)) {
        return { valid: false, error: `Floor plan must be less than ${maxSizeMB}MB` };
    }
    if (!validateFileType(file, allowedTypes)) {
        return { valid: false, error: 'Floor plan must be PDF, PNG, or JPG' };
    }
    return { valid: true };
}
/**
 * Validate reference image
 */
export function validateReferenceImage(file) {
    const maxSizeMB = 5;
    const allowedTypes = ['png', 'jpg', 'jpeg', 'webp'];
    if (!validateFileSize(file, maxSizeMB)) {
        return { valid: false, error: `Image must be less than ${maxSizeMB}MB` };
    }
    if (!validateFileType(file, allowedTypes)) {
        return { valid: false, error: 'Image must be PNG, JPG, or WebP' };
    }
    return { valid: true };
}
/**
 * Validate reference images count
 */
export function validateReferenceImagesCount(currentCount, newFilesCount, maxCount = 5) {
    if (currentCount + newFilesCount > maxCount) {
        return {
            valid: false,
            error: `You can upload a maximum of ${maxCount} reference images`,
        };
    }
    return { valid: true };
}
/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone) {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    // If starts with +91, format as Indian number
    if (cleaned.startsWith('+91') && cleaned.length === 13) {
        return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
    }
    // If 10 digits, format as Indian number
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}
