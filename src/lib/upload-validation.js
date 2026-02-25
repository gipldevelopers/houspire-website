export const FILE_VALIDATIONS = {
    images: {
        maxSize: 25 * 1024 * 1024, // 25MB
        minWidth: 3840, // 4K
        minHeight: 2160, // 4K
        allowedTypes: ['image/jpeg', 'image/png'],
        allowedExtensions: ['.jpg', '.jpeg', '.png']
    },
    documents: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ],
        allowedExtensions: ['.pdf', '.xlsx', '.xls', '.csv']
    }
};
export function validateImageFile(file) {
    // Check file type
    if (!FILE_VALIDATIONS.images.allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Only JPG and PNG images are allowed'
        };
    }
    // Check file size
    if (file.size > FILE_VALIDATIONS.images.maxSize) {
        return {
            valid: false,
            error: `File size must be less than ${FILE_VALIDATIONS.images.maxSize / 1024 / 1024}MB`
        };
    }
    return { valid: true };
}
export async function validateImageDimensions(file) {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            if (img.width < FILE_VALIDATIONS.images.minWidth ||
                img.height < FILE_VALIDATIONS.images.minHeight) {
                resolve({
                    valid: false,
                    error: `Image must be at least ${FILE_VALIDATIONS.images.minWidth}x${FILE_VALIDATIONS.images.minHeight} pixels (4K). Current: ${img.width}x${img.height}`
                });
            }
            else {
                resolve({ valid: true });
            }
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve({
                valid: false,
                error: 'Failed to load image for validation'
            });
        };
        img.src = url;
    });
}
export function validateDocumentFile(file) {
    // Check file type
    if (!FILE_VALIDATIONS.documents.allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Only PDF, Excel, and CSV files are allowed'
        };
    }
    // Check file size
    if (file.size > FILE_VALIDATIONS.documents.maxSize) {
        return {
            valid: false,
            error: `File size must be less than ${FILE_VALIDATIONS.documents.maxSize / 1024 / 1024}MB`
        };
    }
    return { valid: true };
}
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
export function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}
