import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Calendar, Image as ImageIcon, Download, Grid3x3, List, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { BeforeAfterSlider } from '@/components/shared/BeforeAfterSlider';
export function ProgressPhotos({ projectId }) {
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [uploadDetails, setUploadDetails] = useState({
        photo_type: 'during',
        week_number: 1,
        caption: '',
    });
    const [viewingPhoto, setViewingPhoto] = useState(null);
    const { toast } = useToast();
    const onDrop = useCallback((acceptedFiles) => {
        setSelectedPhotos(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        },
        maxSize: 10 * 1024 * 1024,
        multiple: true,
        onDrop,
    });
    const fetchPhotos = useCallback(async () => {
        const { data, error } = await supabase
            .from('progress_photos')
            .select('*')
            .eq('project_id', projectId)
            .order('taken_at', { ascending: true });
        if (!error && data) {
            setPhotos(data);
        }
    }, [projectId]);
    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);
    const handleUpload = async () => {
        if (selectedPhotos.length === 0) {
            toast({
                title: 'No photos selected',
                variant: 'destructive',
            });
            return;
        }
        setUploading(true);
        try {
            for (const photo of selectedPhotos) {
                const fileExt = photo.name.split('.').pop();
                const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('progress-photos')
                    .upload(fileName, photo);
                if (uploadError)
                    throw uploadError;
                const { data: urlData } = supabase.storage
                    .from('progress-photos')
                    .getPublicUrl(fileName);
                await supabase.from('progress_photos').insert({
                    project_id: projectId,
                    photo_url: urlData.publicUrl,
                    photo_type: uploadDetails.photo_type,
                    week_number: uploadDetails.week_number,
                    caption: uploadDetails.caption || null,
                    taken_at: new Date().toISOString(),
                });
            }
            toast({
                title: 'Photos uploaded!',
                description: `${selectedPhotos.length} photo(s) added to your project`,
            });
            setSelectedPhotos([]);
            setUploadDetails({
                photo_type: 'during',
                week_number: 1,
                caption: '',
            });
            fetchPhotos();
        }
        catch (error) {
            toast({
                title: 'Upload failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setUploading(false);
        }
    };
    const deletePhoto = async (photoId, photoUrl) => {
        try {
            const filePath = photoUrl.split('/progress-photos/')[1];
            if (filePath) {
                await supabase.storage.from('progress-photos').remove([filePath]);
            }
            await supabase.from('progress_photos').delete().eq('id', photoId);
            toast({
                title: 'Photo deleted',
            });
            fetchPhotos();
        }
        catch (error) {
            toast({
                title: 'Delete failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const beforePhotos = photos.filter(p => p.photo_type === 'before');
    const afterPhotos = photos.filter(p => p.photo_type === 'after');
    const photoTypeColors = {
        before: 'bg-orange-100 text-orange-700 border-orange-200',
        during: 'bg-blue-100 text-blue-700 border-blue-200',
        after: 'bg-green-100 text-green-700 border-green-200',
    };
    return (<div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="h-5 w-5 text-primary"/>
          <h3 className="font-semibold">Document Your Progress</h3>
        </div>

        <div className="space-y-4">
          {/* Dropzone */}
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${selectedPhotos.length > 0 ? 'bg-muted' : ''}`}>
            <input {...getInputProps()}/>
            {selectedPhotos.length > 0 ? (<div className="space-y-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedPhotos.map((file, i) => (<div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover"/>
                    </div>))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedPhotos.length} photo(s) selected
                </p>
              </div>) : (<div className="space-y-2">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground"/>
                <p className="font-medium">
                  {isDragActive ? 'Drop photos here' : 'Upload progress photos'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to browse
                </p>
              </div>)}
          </div>

          {/* Upload Details */}
          {selectedPhotos.length > 0 && (<>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Photo Type</Label>
                  <Select value={uploadDetails.photo_type} onValueChange={(value) => setUploadDetails({ ...uploadDetails, photo_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before">Before</SelectItem>
                      <SelectItem value="during">During</SelectItem>
                      <SelectItem value="after">After</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Week Number</Label>
                  <Input type="number" min="1" max="12" value={uploadDetails.week_number} onChange={(e) => setUploadDetails({
                ...uploadDetails,
                week_number: parseInt(e.target.value) || 1
            })}/>
                </div>
                <div className="space-y-2">
                  <Label>Caption (Optional)</Label>
                  <Input placeholder="Describe the progress..." value={uploadDetails.caption} onChange={(e) => setUploadDetails({
                ...uploadDetails,
                caption: e.target.value
            })}/>
                </div>
              </div>

              <Button onClick={handleUpload} disabled={uploading} className="w-full">
                {uploading ? (<>Uploading...</>) : (<>
                    <Upload className="mr-2 h-4 w-4"/>
                    Upload {selectedPhotos.length} Photo(s)
                  </>)}
              </Button>
            </>)}
        </div>
      </Card>

      {/* View Toggle */}
      {photos.length > 0 && (<div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Your Progress ({photos.length} photos)</h3>
            <p className="text-sm text-muted-foreground">
              Track your transformation journey
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
              <Grid3x3 className="h-4 w-4"/>
            </Button>
            <Button variant={viewMode === 'timeline' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('timeline')}>
              <List className="h-4 w-4"/>
            </Button>
          </div>
        </div>)}

      {/* Before/After Comparison */}
      {beforePhotos.length > 0 && afterPhotos.length > 0 && (<Card className="p-6">
          <h3 className="font-semibold mb-4">Before & After Comparison</h3>
          <BeforeAfterSlider beforeImage={beforePhotos[0].photo_url} afterImage={afterPhotos[afterPhotos.length - 1].photo_url}/>
        </Card>)}

      {/* Photos Display */}
      {viewMode === 'grid' ? (<div className="space-y-6">
          {['before', 'during', 'after'].map((type) => {
                const typePhotos = photos.filter(p => p.photo_type === type);
                if (typePhotos.length === 0)
                    return null;
                return (<div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={photoTypeColors[type]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({typePhotos.length})
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {typePhotos.map((photo) => (<div key={photo.id} className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative" onClick={() => setViewingPhoto(photo)}>
                      <img src={photo.photo_url} alt={photo.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"/>
                    </div>))}
                </div>
              </div>);
            })}
        </div>) : (<div className="space-y-4">
          {Array.from({ length: 6 }).map((_, weekIndex) => {
                const weekPhotos = photos.filter(p => p.week_number === weekIndex + 1);
                if (weekPhotos.length === 0)
                    return null;
                return (<Card key={weekIndex} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground"/>
                  <h4 className="font-medium">Week {weekIndex + 1}</h4>
                  <span className="text-sm text-muted-foreground">
                    {weekPhotos.length} photos
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {weekPhotos.map((photo) => (<div key={photo.id} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer relative group" onClick={() => setViewingPhoto(photo)}>
                      <img src={photo.photo_url} alt="" className="w-full h-full object-cover"/>
                      <Badge className={`absolute bottom-1 left-1 text-xs ${photoTypeColors[photo.photo_type]}`}>
                        {photo.photo_type}
                      </Badge>
                    </div>))}
                </div>
              </Card>);
            })}
        </div>)}

      {/* Empty State */}
      {photos.length === 0 && (<Card className="p-12 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
          <h3 className="font-semibold mb-2">No progress photos yet</h3>
          <p className="text-muted-foreground text-sm">
            Upload photos to document your transformation journey
          </p>
        </Card>)}

      {/* Photo Viewer Modal */}
      <Dialog open={!!viewingPhoto} onOpenChange={() => setViewingPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Progress Photo</span>
              <div className="flex gap-2">
                {viewingPhoto && (<>
                    <a href={viewingPhoto.photo_url} download target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1"/>
                        Download
                      </Button>
                    </a>
                    <Button variant="outline" size="icon" onClick={() => {
                if (viewingPhoto) {
                    deletePhoto(viewingPhoto.id, viewingPhoto.photo_url);
                    setViewingPhoto(null);
                }
            }}>
                      <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                  </>)}
              </div>
            </DialogTitle>
          </DialogHeader>

          {viewingPhoto && (<div className="space-y-4">
              <img src={viewingPhoto.photo_url} alt={viewingPhoto.caption || ''} className="w-full rounded-lg max-h-[60vh] object-contain"/>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={photoTypeColors[viewingPhoto.photo_type]}>
                  {viewingPhoto.photo_type}
                </Badge>
                {viewingPhoto.week_number && (<Badge variant="outline">
                    Week {viewingPhoto.week_number}
                  </Badge>)}
                <span className="text-sm text-muted-foreground">
                  {new Date(viewingPhoto.taken_at).toLocaleDateString()}
                </span>
              </div>
              {viewingPhoto.caption && (<p className="text-muted-foreground">{viewingPhoto.caption}</p>)}
            </div>)}
        </DialogContent>
      </Dialog>
    </div>);
}
