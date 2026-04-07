import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Plus, X } from 'lucide-react';
const styles = ['Modern', 'Contemporary', 'Traditional', 'Minimalist', 'Luxury', 'Bohemian'];
export function AdminUploadVariation({ projectId, onSuccess }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        variation_name: '',
        description: '',
        style: 'Modern',
        color_palette: {
            primary: '#ffffff',
            secondary: '#000000',
            accent: '#E8662E',
        },
    });
    const [renders, setRenders] = useState([]);
    const [uploading, setUploading] = useState(false);
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length + renders.length > 10) {
            toast({
                title: 'Too many files',
                description: 'Maximum 10 renders per variation',
                variant: 'destructive',
            });
            return;
        }
        setRenders([...renders, ...files]);
    };
    const removeRender = (index) => {
        setRenders(renders.filter((_, i) => i !== index));
    };
    const handleSubmit = async () => {
        if (!formData.variation_name || renders.length === 0) {
            toast({
                title: 'Missing information',
                description: 'Please provide variation name and at least one render',
                variant: 'destructive',
            });
            return;
        }
        setUploading(true);
        try {
            // Create variation
            const { data: variationData, error: variationError } = await appDataClient
                .from('design_variations')
                .insert({
                project_id: projectId,
                variation_name: formData.variation_name,
                description: formData.description,
                style: formData.style,
                color_palette: formData.color_palette,
            })
                .select()
                .single();
            if (variationError)
                throw variationError;
            // Upload renders
            for (let i = 0; i < renders.length; i++) {
                const file = renders[i];
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = `${projectId}/variations/${variationData.id}/${fileName}`;
                const { error: uploadError } = await appDataClient.storage
                    .from('project-renders')
                    .upload(filePath, file);
                if (uploadError)
                    throw uploadError;
                const { data: urlData } = appDataClient.storage
                    .from('project-renders')
                    .getPublicUrl(filePath);
                await appDataClient.from('variation_renders').insert({
                    variation_id: variationData.id,
                    render_url: urlData.publicUrl,
                    view_name: file.name.replace(/\.[^/.]+$/, ''),
                    order_index: i,
                });
            }
            toast({
                title: 'Variation uploaded! ✨',
                description: 'Design variation has been added',
            });
            onSuccess();
            // Reset form
            setFormData({
                variation_name: '',
                description: '',
                style: 'Modern',
                color_palette: {
                    primary: '#ffffff',
                    secondary: '#000000',
                    accent: '#E8662E',
                },
            });
            setRenders([]);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
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
    return (<Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Upload Design Variation
      </h3>

      <div className="space-y-4">
        <div>
          <Label>Variation Name</Label>
          <Input value={formData.variation_name} onChange={(e) => setFormData({ ...formData, variation_name: e.target.value })} placeholder="e.g., Option A - Minimalist" className="mt-1"/>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of this design variation..." rows={3} className="mt-1"/>
        </div>

        <div>
          <Label>Style</Label>
          <select value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })} className="w-full h-10 px-4 border border-input rounded-md mt-1">
            {styles.map((style) => (<option key={style} value={style}>
                {style}
              </option>))}
          </select>
        </div>

        <div>
          <Label>Color Palette</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <Label className="text-xs">Primary</Label>
              <Input type="color" value={formData.color_palette.primary} onChange={(e) => setFormData({
            ...formData,
            color_palette: {
                ...formData.color_palette,
                primary: e.target.value,
            },
        })} className="h-10 p-1"/>
            </div>
            <div>
              <Label className="text-xs">Secondary</Label>
              <Input type="color" value={formData.color_palette.secondary} onChange={(e) => setFormData({
            ...formData,
            color_palette: {
                ...formData.color_palette,
                secondary: e.target.value,
            },
        })} className="h-10 p-1"/>
            </div>
            <div>
              <Label className="text-xs">Accent</Label>
              <Input type="color" value={formData.color_palette.accent} onChange={(e) => setFormData({
            ...formData,
            color_palette: {
                ...formData.color_palette,
                accent: e.target.value,
            },
        })} className="h-10 p-1"/>
            </div>
          </div>
        </div>

        <div>
          <Label>Renders ({renders.length}/10)</Label>
          <div className="mt-2 space-y-3">
            {renders.map((file, index) => (<div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm truncate flex-1">
                  {file.name}
                </span>
                <button onClick={() => removeRender(index)} className="text-destructive hover:text-destructive/80 ml-2">
                  <X className="h-4 w-4"/>
                </button>
              </div>))}

            {renders.length < 10 && (<label className="block">
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden"/>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2"/>
                  <p className="text-sm text-muted-foreground">
                    Click to upload renders
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </label>)}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={uploading} className="w-full">
          {uploading ? (<>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>
              Uploading...
            </>) : (<>
              <Plus className="h-5 w-5 mr-2"/>
              Upload Variation
            </>)}
        </Button>
      </div>
    </Card>);
}

