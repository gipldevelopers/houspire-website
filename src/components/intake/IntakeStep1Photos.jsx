import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Camera, AlertCircle, CheckCircle, Image as ImageIcon, FileText, Loader2, } from 'lucide-react';
export function IntakeStep1Photos({ photos, floorPlan, onPhotosChange, onFloorPlanChange, projectId, }) {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [uploadingFloorPlan, setUploadingFloorPlan] = useState(false);
    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0)
            return;
        setUploading(true);
        const uploadedUrls = [];
        try {
            for (const file of acceptedFiles) {
                if (file.size > 10 * 1024 * 1024) {
                    toast({
                        title: 'File too large',
                        description: `${file.name} exceeds 10MB limit`,
                        variant: 'destructive',
                    });
                    continue;
                }
                const fileName = `${projectId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const { error } = await supabase.storage
                    .from('project-uploads')
                    .upload(fileName, file);
                if (error) {
                    console.error('Upload error:', error);
                    continue;
                }
                const { data: urlData } = supabase.storage
                    .from('project-uploads')
                    .getPublicUrl(fileName);
                uploadedUrls.push(urlData.publicUrl);
            }
            if (uploadedUrls.length > 0) {
                onPhotosChange([...photos, ...uploadedUrls]);
                toast({
                    title: 'Photos uploaded!',
                    description: `${uploadedUrls.length} photo(s) added successfully`,
                });
            }
        }
        catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload failed',
                description: 'Failed to upload photos',
                variant: 'destructive',
            });
        }
        finally {
            setUploading(false);
        }
    }, [photos, projectId, onPhotosChange, toast]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        },
        disabled: uploading,
    });
    const handleRemovePhoto = (url) => {
        onPhotosChange(photos.filter((p) => p !== url));
    };
    const handleFloorPlanUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploadingFloorPlan(true);
        try {
            const fileName = `${projectId}/floorplan_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const { error } = await supabase.storage
                .from('project-uploads')
                .upload(fileName, file);
            if (error)
                throw error;
            const { data: urlData } = supabase.storage
                .from('project-uploads')
                .getPublicUrl(fileName);
            onFloorPlanChange(urlData.publicUrl);
            toast({
                title: 'Floor plan uploaded!',
                description: 'Your floor plan has been added',
            });
        }
        catch (error) {
            console.error('Floor plan upload error:', error);
            toast({
                title: 'Upload failed',
                description: 'Failed to upload floor plan',
                variant: 'destructive',
            });
        }
        finally {
            setUploadingFloorPlan(false);
        }
    };
    const photoGuidelines = [
        { icon: '📐', title: 'Full room view', desc: 'Capture entire room from corners' },
        { icon: '💡', title: 'Good lighting', desc: 'Natural daylight works best' },
        { icon: '🔍', title: 'Detail shots', desc: 'Problem areas & focal points' },
        { icon: '📏', title: 'Clear space', desc: 'Temporarily move clutter' },
    ];
    const minPhotos = 1;
    const hasEnoughPhotos = photos.length >= minPhotos || !!floorPlan;
    return (<div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Upload Room Photos</h1>
        <p className="text-muted-foreground">
          Help your designer understand your space
        </p>
        <Badge variant={hasEnoughPhotos ? 'default' : 'outline'} className="mt-3">
          {hasEnoughPhotos ? (<>
              <CheckCircle className="h-3 w-3 mr-1"/>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
            </>) : (<>Upload at least {minPhotos} photo or a floor plan</>)}
        </Badge>
      </div>

      {/* Photo Upload Area */}
      <Card {...getRootProps()} className={`p-8 border-2 border-dashed cursor-pointer transition-colors ${isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'}`}>
        <input {...getInputProps()}/>
        <div className="text-center">
          {uploading ? (<div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 animate-spin text-primary"/>
              <p className="text-muted-foreground">Uploading photos...</p>
            </div>) : (<>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-primary"/>
              </div>
              <p className="font-medium mb-1">
                {isDragActive ? 'Drop photos here' : 'Drag & drop photos or click to browse'}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, WEBP up to 10MB each
              </p>
              <Button variant="outline" className="mt-4 gap-2">
                <Camera className="h-4 w-4"/>
                Choose Photos
              </Button>
            </>)}
        </div>
      </Card>

      {/* Photo Guidelines */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {photoGuidelines.map((guide, idx) => (<Card key={idx} className="p-3 text-center">
            <div className="text-2xl mb-1">{guide.icon}</div>
            <p className="font-medium text-sm">{guide.title}</p>
            <p className="text-xs text-muted-foreground">{guide.desc}</p>
          </Card>))}
      </div>

      {/* Uploaded Photos Grid */}
      {photos.length > 0 && (<div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <ImageIcon className="h-4 w-4"/>
            Uploaded Photos ({photos.length})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {photos.map((url, idx) => (<div key={idx} className="relative aspect-square group">
                <img src={url} alt={`Room photo ${idx + 1}`} className="w-full h-full object-cover rounded-lg"/>
                <button onClick={() => handleRemovePhoto(url)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-4 w-4"/>
                </button>
              </div>))}
          </div>
        </div>)}

      {/* Floor Plan Upload */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="h-5 w-5 text-muted-foreground"/>
            </div>
            <div>
              <p className="font-medium">Floor Plan (Optional)</p>
              <p className="text-sm text-muted-foreground">
                Upload if you have one
              </p>
            </div>
          </div>

          {floorPlan ? (<div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3"/>
                Uploaded
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => onFloorPlanChange(null)}>
                <X className="h-4 w-4"/>
              </Button>
            </div>) : (<label>
              <input type="file" accept="image/*,.pdf" onChange={handleFloorPlanUpload} className="hidden" disabled={uploadingFloorPlan}/>
              <Button variant="outline" size="sm" asChild disabled={uploadingFloorPlan}>
                <span className="cursor-pointer">
                  {uploadingFloorPlan ? (<Loader2 className="h-4 w-4 animate-spin"/>) : ('Upload')}
                </span>
              </Button>
            </label>)}
        </div>
      </Card>

      {/* Validation Warning */}
      {!hasEnoughPhotos && (<Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Photos help create accurate designs
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Upload at least {minPhotos} photo or a floor plan to continue. More photos = better results!
              </p>
            </div>
          </div>
        </Card>)}
    </div>);
}
