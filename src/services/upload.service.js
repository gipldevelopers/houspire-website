import { appDataClient } from '@/lib/static-client';

function sanitizeFileName(fileName = 'file') {
  return String(fileName)
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

function getFileExtension(fileName = '', fallbackType = '') {
  const nameExt = String(fileName).split('.').pop();
  if (nameExt && nameExt !== fileName) {
    return nameExt.toLowerCase();
  }

  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'image/heif': 'heif',
  };

  return mimeMap[fallbackType] || 'jpg';
}

async function uploadFileToStorage(path, file) {
  const { data, error } = await appDataClient.storage
    .from('design-files')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = appDataClient.storage
    .from('design-files')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

export const uploadService = {
  async uploadTemporaryFile(formData) {
    try {
      const file = formData?.get('file');

      if (!file) {
        throw new Error('No file provided for upload');
      }

      const extension = getFileExtension(file.name, file.type);
      const temporaryId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const safeName = sanitizeFileName(file.name || `upload.${extension}`);
      const storagePath = `temporary/${temporaryId}-${safeName}`;

      const fileUrl = await uploadFileToStorage(storagePath, file);

      return {
        success: true,
        data: {
          temporaryId,
          fileUrl,
          path: storagePath,
          roomType: formData.get('roomType') || null,
          dimensions: formData.get('dimensions') || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload file',
      };
    }
  },

  async moveTemporaryFile(temporaryId, projectId, fileName, roomType = 'GENERAL') {
    try {
      if (!temporaryId) {
        throw new Error('Temporary file ID is required');
      }

      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const extension = getFileExtension(fileName);
      const safeRoom = String(roomType || 'GENERAL').toLowerCase();
      const safeName = sanitizeFileName(fileName || `${temporaryId}.${extension}`);
      const permanentPath = `${projectId}/uploads/${safeRoom}-${Date.now()}-${safeName}`;

      const { data: publicUrlData } = appDataClient.storage
        .from('design-files')
        .getPublicUrl(permanentPath);

      return {
        success: true,
        data: {
          temporaryId,
          permanentUrl: publicUrlData.publicUrl,
          path: permanentPath,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to move temporary file',
      };
    }
  },
};

