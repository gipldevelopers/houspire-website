import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { compressImage, validateImageFile } from '@/lib/imageUtils';
import { OptimizedImage } from '@/components/OptimizedImage';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Check, Loader2 } from 'lucide-react';
export function ImageUploadPreview({ images, onImagesChange, maxImages = 10, maxSize = 10 * 1024 * 1024, bucket, folder, }) {
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();
    const handleUpload = async (files) => {
        if (images.length + files.length > maxImages) {
            toast({
                title: 'Too many images',
                description: `Maximum ${maxImages} images allowed`,
                variant: 'destructive',
            });
            return;
        }
        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const validation = validateImageFile(file, { maxSize });
                if (!validation.valid) {
                    throw new Error(validation.error);
                }
                const compressed = await compressImage(file);
                const compressedFile = new File([compressed], file.name, {
                    type: 'image/jpeg',
                });
                const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const { error } = await appDataClient.storage
                    .from(bucket)
                    .upload(fileName, compressedFile);
                if (error)
                    throw error;
                const { data: urlData } = appDataClient.storage
                    .from(bucket)
                    .getPublicUrl(fileName);
                return urlData.publicUrl;
            });
            const urls = await Promise.all(uploadPromises);
            onImagesChange([...images, ...urls]);
            toast({
                title: 'Upload complete',
                description: `${urls.length} image(s) uploaded`,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Upload failed';
            toast({
                title: 'Upload failed',
                description: message,
                variant: 'destructive',
            });
        }
        finally {
            setUploading(false);
        }
    };
    const handleRemove = (index) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };
    return (<div className="space-y-4">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleUpload(e.target.files)} className="hidden" id="image-upload" disabled={uploading || images.length >= maxImages}/>
        <label htmlFor="image-upload" className="flex flex-col items-center justify-center p-8 cursor-pointer">
          {uploading ? (<div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin"/>
              <span>Uploading...</span>
            </div>) : (<>
              <Upload className="h-10 w-10 text-muted-foreground mb-3"/>
              <p className="font-medium text-foreground">
                Upload Images
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {images.length}/{maxImages} images • Max {maxSize / 1024 / 1024}MB each
              </p>
            </>)}
        </label>
      </Card>

      {/* Preview Grid */}
      {images.length > 0 && (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((url, idx) => (<div key={idx} className="relative group aspect-square">
              <OptimizedImage src={url} alt={`Upload ${idx + 1}`} aspectRatio="1/1" className="rounded-lg"/>
              
              <button type="button" onClick={() => handleRemove(idx)} className="absolute top-1 right-1 w-6 h-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-3 w-3"/>
              </button>

              <div className="absolute bottom-1 left-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white"/>
              </div>
            </div>))}
        </div>)}
    </div>);
}

