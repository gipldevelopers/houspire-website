import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { appDataClient } from '@/lib/static-client';
import { Upload, FileText, Image as ImageIcon, Loader2, Trash2, Eye, } from 'lucide-react';
const MAX_FLOOR_PLAN_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_REFERENCE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_REFERENCE_IMAGES = 5;
const ALLOWED_FLOOR_PLAN_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const ALLOWED_REFERENCE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export default function OrderFileUpload({ orderId, floorPlanUrl, referenceImages = [], onFilesUpdated, editable = true, }) {
    const { toast } = useToast();
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [isDeleting, setIsDeleting] = useState(null);
    const currentReferenceImages = referenceImages || [];
    const canAddMoreReferences = currentReferenceImages.length < MAX_REFERENCE_IMAGES;
    const uploadFile = async (file, type) => {
        const uploadId = `${Date.now()}-${Math.random()}`;
        setUploadingFiles(prev => [...prev, {
                id: uploadId,
                file,
                progress: 0,
                type,
            }]);
        try {
            // Generate file path
            const timestamp = Date.now();
            const extension = file.name.split('.').pop();
            const fileName = type === 'floor_plan'
                ? `floor-plan-${timestamp}.${extension}`
                : `reference-${currentReferenceImages.length + 1}-${timestamp}.${extension}`;
            const filePath = `${orderId}/${fileName}`;
            // Upload to storage
            const { data: uploadData, error: uploadError } = await appDataClient.storage
                .from('order-files')
                .upload(filePath, file, {
                cacheControl: '3600',
                upsert: type === 'floor_plan', // Overwrite floor plan
            });
            if (uploadError)
                throw uploadError;
            // Simulate progress
            setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, progress: 80 } : f));
            // Get public URL
            const { data: urlData } = appDataClient.storage
                .from('order-files')
                .getPublicUrl(filePath);
            const fileUrl = urlData.publicUrl;
            // Update order record
            if (type === 'floor_plan') {
                const { error: updateError } = await appDataClient
                    .from('orders')
                    .update({ floor_plan_url: fileUrl })
                    .eq('id', orderId);
                if (updateError)
                    throw updateError;
            }
            else {
                const newReferenceImages = [...currentReferenceImages, fileUrl];
                const { error: updateError } = await appDataClient
                    .from('orders')
                    .update({ reference_images: newReferenceImages })
                    .eq('id', orderId);
                if (updateError)
                    throw updateError;
            }
            setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, progress: 100 } : f));
            toast({
                title: 'File uploaded',
                description: `${type === 'floor_plan' ? 'Floor plan' : 'Reference image'} uploaded successfully`,
            });
            // Small delay before removing from uploading state
            setTimeout(() => {
                setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
                onFilesUpdated?.();
            }, 500);
        }
        catch (error) {
            console.error('Upload error:', error);
            setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
            toast({
                title: 'Upload failed',
                description: error.message || 'Failed to upload file',
                variant: 'destructive',
            });
        }
    };
    const handleFloorPlanDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file)
            return;
        if (!ALLOWED_FLOOR_PLAN_TYPES.includes(file.type)) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a PDF, JPG, or PNG file',
                variant: 'destructive',
            });
            return;
        }
        if (file.size > MAX_FLOOR_PLAN_SIZE) {
            toast({
                title: 'File too large',
                description: 'Floor plan must be under 10MB',
                variant: 'destructive',
            });
            return;
        }
        uploadFile(file, 'floor_plan');
    }, [orderId]);
    const handleReferenceDrop = useCallback((acceptedFiles) => {
        const remainingSlots = MAX_REFERENCE_IMAGES - currentReferenceImages.length;
        const filesToUpload = acceptedFiles.slice(0, remainingSlots);
        for (const file of filesToUpload) {
            if (!ALLOWED_REFERENCE_TYPES.includes(file.type)) {
                toast({
                    title: 'Invalid file type',
                    description: `${file.name} is not a valid image format`,
                    variant: 'destructive',
                });
                continue;
            }
            if (file.size > MAX_REFERENCE_SIZE) {
                toast({
                    title: 'File too large',
                    description: `${file.name} exceeds 5MB limit`,
                    variant: 'destructive',
                });
                continue;
            }
            uploadFile(file, 'reference');
        }
    }, [orderId, currentReferenceImages.length]);
    const floorPlanDropzone = useDropzone({
        onDrop: handleFloorPlanDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        maxFiles: 1,
        disabled: !editable,
    });
    const referenceDropzone = useDropzone({
        onDrop: handleReferenceDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxFiles: MAX_REFERENCE_IMAGES - currentReferenceImages.length,
        disabled: !editable || !canAddMoreReferences,
    });
    const deleteReferenceImage = async (imageUrl) => {
        setIsDeleting(imageUrl);
        try {
            const newImages = currentReferenceImages.filter(url => url !== imageUrl);
            const { error } = await appDataClient
                .from('orders')
                .update({ reference_images: newImages })
                .eq('id', orderId);
            if (error)
                throw error;
            toast({
                title: 'Image removed',
                description: 'Reference image has been removed',
            });
            onFilesUpdated?.();
        }
        catch (error) {
            toast({
                title: 'Failed to remove image',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setIsDeleting(null);
        }
    };
    const deleteFloorPlan = async () => {
        setIsDeleting('floor_plan');
        try {
            const { error } = await appDataClient
                .from('orders')
                .update({ floor_plan_url: null })
                .eq('id', orderId);
            if (error)
                throw error;
            toast({
                title: 'Floor plan removed',
                description: 'Floor plan has been removed',
            });
            onFilesUpdated?.();
        }
        catch (error) {
            toast({
                title: 'Failed to remove floor plan',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setIsDeleting(null);
        }
    };
    const isUploadingFloorPlan = uploadingFiles.some(f => f.type === 'floor_plan');
    const isUploadingReference = uploadingFiles.some(f => f.type === 'reference');
    return (<div className="space-y-6">
      {/* Floor Plan Section */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4"/>
          Floor Plan
          {floorPlanUrl && <Badge variant="secondary" className="text-xs">Uploaded</Badge>}
        </h4>

        {floorPlanUrl ? (<div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary"/>
              </div>
              <div>
                <p className="font-medium text-sm">Floor Plan</p>
                <p className="text-xs text-muted-foreground">PDF or Image</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href={floorPlanUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-1"/>
                  View
                </a>
              </Button>
              {editable && (<Button variant="ghost" size="sm" onClick={deleteFloorPlan} disabled={isDeleting === 'floor_plan'} className="text-destructive hover:text-destructive">
                  {isDeleting === 'floor_plan' ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<Trash2 className="h-4 w-4"/>)}
                </Button>)}
            </div>
          </div>) : isUploadingFloorPlan ? (<div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary"/>
              <span className="text-sm">Uploading floor plan...</span>
            </div>
            <Progress value={uploadingFiles.find(f => f.type === 'floor_plan')?.progress || 0}/>
          </div>) : editable ? (<div {...floorPlanDropzone.getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
              ${floorPlanDropzone.isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}`}>
            <input {...floorPlanDropzone.getInputProps()}/>
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground"/>
            <p className="text-sm font-medium">Drop your floor plan here</p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, PNG, or JPG up to 10MB
            </p>
          </div>) : (<div className="p-4 border rounded-lg text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50"/>
            <p className="text-sm">No floor plan uploaded</p>
          </div>)}
      </div>

      {/* Reference Images Section */}
      <div>
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <ImageIcon className="h-4 w-4"/>
          Reference Images
          <Badge variant="secondary" className="text-xs">
            {currentReferenceImages.length}/{MAX_REFERENCE_IMAGES}
          </Badge>
        </h4>

        {/* Existing Images Grid */}
        {currentReferenceImages.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            {currentReferenceImages.map((imageUrl, idx) => (<div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border">
                <img src={imageUrl} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4"/>
                    </a>
                  </Button>
                  {editable && (<Button variant="destructive" size="sm" onClick={() => deleteReferenceImage(imageUrl)} disabled={isDeleting === imageUrl}>
                      {isDeleting === imageUrl ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<Trash2 className="h-4 w-4"/>)}
                    </Button>)}
                </div>
              </div>))}
          </div>)}

        {/* Uploading Preview */}
        {isUploadingReference && (<div className="space-y-2 mb-3">
            {uploadingFiles
                .filter(f => f.type === 'reference')
                .map(file => (<div key={file.id} className="p-3 border rounded-lg flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                  <div className="flex-1">
                    <p className="text-sm truncate">{file.file.name}</p>
                    <Progress value={file.progress} className="h-1 mt-1"/>
                  </div>
                </div>))}
          </div>)}

        {/* Drop Zone */}
        {editable && canAddMoreReferences && (<div {...referenceDropzone.getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
              ${referenceDropzone.isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}`}>
            <input {...referenceDropzone.getInputProps()}/>
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground"/>
            <p className="text-sm font-medium">Add inspiration images</p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, or WebP up to 5MB each
            </p>
          </div>)}

        {!editable && currentReferenceImages.length === 0 && (<div className="p-4 border rounded-lg text-center text-muted-foreground">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50"/>
            <p className="text-sm">No reference images uploaded</p>
          </div>)}
      </div>
    </div>);
}

