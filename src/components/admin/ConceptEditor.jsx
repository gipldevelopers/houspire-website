import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Save, X, Plus, Trash2, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
export function ConceptEditor({ concept, onSave, onClose }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        concept_name: concept.concept_name,
        style_direction: concept.style_direction || '',
        estimated_budget: concept.estimated_budget,
        designer_message: concept.designer_message || '',
        ai_quality_score: concept.ai_quality_score || 0.8,
        admin_approved: concept.admin_approved || false,
        admin_notes: concept.admin_notes || '',
        render_urls: concept.render_urls || []
    });
    const [newRenderUrl, setNewRenderUrl] = useState('');
    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await appDataClient
                .from('concepts')
                .update({
                concept_name: formData.concept_name,
                style_direction: formData.style_direction,
                estimated_budget: formData.estimated_budget,
                designer_message: formData.designer_message,
                ai_quality_score: formData.ai_quality_score,
                admin_approved: formData.admin_approved,
                admin_notes: formData.admin_notes,
                render_urls: formData.render_urls,
                updated_at: new Date().toISOString()
            })
                .eq('id', concept.id);
            if (error)
                throw error;
            toast({
                title: 'Concept updated!',
                description: 'Changes have been saved successfully.',
            });
            onSave();
        }
        catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save changes. Please try again.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const addRenderUrl = () => {
        if (newRenderUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                render_urls: [...prev.render_urls, newRenderUrl.trim()]
            }));
            setNewRenderUrl('');
        }
    };
    const removeRenderUrl = (index) => {
        setFormData(prev => ({
            ...prev,
            render_urls: prev.render_urls.filter((_, i) => i !== index)
        }));
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Edit Concept</h3>
          <p className="text-sm text-muted-foreground">ID: {concept.id.slice(0, 8)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2"/>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (<Loader2 className="h-4 w-4 mr-2 animate-spin"/>) : (<Save className="h-4 w-4 mr-2"/>)}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Basic Information</h4>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Concept Name</Label>
              <Input id="name" value={formData.concept_name} onChange={(e) => setFormData(prev => ({ ...prev, concept_name: e.target.value }))} className="mt-1"/>
            </div>
            
            <div>
              <Label htmlFor="style">Style Direction</Label>
              <Input id="style" value={formData.style_direction} onChange={(e) => setFormData(prev => ({ ...prev, style_direction: e.target.value }))} placeholder="e.g., Modern Minimalist" className="mt-1"/>
            </div>
            
            <div>
              <Label htmlFor="budget">Estimated Budget (₹)</Label>
              <Input id="budget" type="number" value={formData.estimated_budget} onChange={(e) => setFormData(prev => ({ ...prev, estimated_budget: parseInt(e.target.value) || 0 }))} className="mt-1"/>
              <p className="text-xs text-muted-foreground mt-1">
                ₹{(formData.estimated_budget / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </Card>

        {/* Quality & Approval */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Quality & Approval</h4>
          
          <div className="space-y-6">
            <div>
              <Label className="mb-3 block">
                AI Quality Score: {(formData.ai_quality_score * 100).toFixed(0)}%
              </Label>
              <Slider value={[formData.ai_quality_score * 100]} onValueChange={([value]) => setFormData(prev => ({ ...prev, ai_quality_score: value / 100 }))} max={100} step={5}/>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Admin Approved</Label>
                <p className="text-xs text-muted-foreground">
                  Approve to make visible to customer
                </p>
              </div>
              <Switch checked={formData.admin_approved} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, admin_approved: checked }))}/>
            </div>
            
            {formData.admin_approved && (<Badge className="bg-green-100 text-green-800 w-full justify-center py-2">
                <CheckCircle className="h-4 w-4 mr-2"/>
                Approved & Visible to Customer
              </Badge>)}
          </div>
        </Card>

        {/* Designer Message */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Designer Message</h4>
          
          <Textarea value={formData.designer_message} onChange={(e) => setFormData(prev => ({ ...prev, designer_message: e.target.value }))} placeholder="Write a personalized message from the designer..." className="min-h-[150px]"/>
          <p className="text-xs text-muted-foreground mt-2">
            This message will be shown to the customer along with their concept
          </p>
        </Card>

        {/* Admin Notes */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Admin Notes (Internal)</h4>
          
          <Textarea value={formData.admin_notes} onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))} placeholder="Internal notes about this concept..." className="min-h-[150px]"/>
          <p className="text-xs text-muted-foreground mt-2">
            These notes are only visible to admins
          </p>
        </Card>
      </div>

      {/* Render URLs */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Render Images</h4>
          <Badge variant="secondary">{formData.render_urls.length} images</Badge>
        </div>
        
        {/* Existing Renders */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          {formData.render_urls.map((url, index) => (<div key={index} className="relative group">
              <img src={url} alt={`Render ${index + 1}`} className="w-full aspect-video object-cover rounded-lg border"/>
              <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeRenderUrl(index)}>
                <Trash2 className="h-3 w-3"/>
              </Button>
            </div>))}
        </div>
        
        {/* Add New Render */}
        <div className="flex gap-2">
          <Input value={newRenderUrl} onChange={(e) => setNewRenderUrl(e.target.value)} placeholder="Paste render image URL..." className="flex-1"/>
          <Button variant="outline" onClick={addRenderUrl}>
            <Plus className="h-4 w-4 mr-2"/>
            Add
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2"/>
            Regenerate
          </Button>
        </div>
      </Card>

      {/* Products Summary */}
      {concept.concept_products && concept.concept_products.length > 0 && (<Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Products</h4>
            <Badge variant="secondary">{concept.concept_products.length} items</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>View and edit products in the Product Manager section.</p>
          </div>
        </Card>)}
    </div>);
}

