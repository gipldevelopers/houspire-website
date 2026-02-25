import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Palette, Loader2, Save, Layers, CheckCircle, Send, } from 'lucide-react';
export function AdminMaterialsManager({ projectId }) {
    const { toast } = useToast();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const categories = ['Flooring', 'Wall Paint', 'Wall Covering', 'Tiles', 'Countertop', 'Hardware', 'Other'];
    useEffect(() => {
        fetchMaterials();
    }, [projectId]);
    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('project_materials')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });
            if (error)
                throw error;
            setMaterials(data || []);
        }
        catch (error) {
            console.error('Error fetching materials:', error);
            toast({
                title: 'Error',
                description: 'Failed to load materials',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddMaterial = () => {
        setMaterials([
            ...materials,
            {
                category: 'Flooring',
                material_type: '',
                brand: '',
                color: '',
                finish: '',
                unit: 'sq ft',
                specifications: '',
                is_published: false,
            },
        ]);
    };
    const handleUpdateMaterial = (index, field, value) => {
        const updated = [...materials];
        updated[index] = { ...updated[index], [field]: value };
        setMaterials(updated);
    };
    const handleDeleteMaterial = async (index) => {
        const material = materials[index];
        if (material.id) {
            try {
                const { error } = await supabase
                    .from('project_materials')
                    .delete()
                    .eq('id', material.id);
                if (error)
                    throw error;
            }
            catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to delete material',
                    variant: 'destructive',
                });
                return;
            }
        }
        setMaterials(materials.filter((_, i) => i !== index));
        toast({ title: 'Material removed' });
    };
    const handleSave = async () => {
        setSaving(true);
        try {
            for (const material of materials) {
                if (!material.material_type)
                    continue;
                const materialData = {
                    project_id: projectId,
                    category: material.category,
                    material_type: material.material_type,
                    brand: material.brand || null,
                    color: material.color || null,
                    finish: material.finish || null,
                    price_per_unit: material.price_per_unit || 0,
                    unit: material.unit || 'unit',
                    specifications: material.specifications || null,
                    is_published: material.is_published || false,
                };
                if (material.id) {
                    // Update existing
                    const { error } = await supabase
                        .from('project_materials')
                        .update(materialData)
                        .eq('id', material.id);
                    if (error)
                        throw error;
                }
                else {
                    // Insert new
                    const { error } = await supabase
                        .from('project_materials')
                        .insert(materialData);
                    if (error)
                        throw error;
                }
            }
            toast({
                title: 'Materials saved!',
                description: 'Material specifications saved successfully',
            });
            // Refresh to get IDs
            fetchMaterials();
        }
        catch (error) {
            console.error('Error saving materials:', error);
            toast({
                title: 'Error',
                description: 'Failed to save materials',
                variant: 'destructive',
            });
        }
        finally {
            setSaving(false);
        }
    };
    const handlePublish = async () => {
        setPublishing(true);
        try {
            const { error } = await supabase
                .from('project_materials')
                .update({
                is_published: true,
                published_at: new Date().toISOString()
            })
                .eq('project_id', projectId);
            if (error)
                throw error;
            toast({
                title: 'Published!',
                description: 'Materials are now visible to the customer',
            });
            fetchMaterials();
        }
        catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to publish materials',
                variant: 'destructive',
            });
        }
        finally {
            setPublishing(false);
        }
    };
    const hasUnpublished = materials.some(m => !m.is_published && m.id);
    if (loading) {
        return (<div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Material Specifications</h3>
          <p className="text-sm text-muted-foreground">Finishes, paints, and material details</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1"/> : <Save className="h-4 w-4 mr-1"/>}
            Save
          </Button>
          {materials.length > 0 && (<Button variant="default" size="sm" onClick={handlePublish} disabled={publishing || !hasUnpublished} className="bg-green-600 hover:bg-green-700">
              {publishing ? <Loader2 className="h-4 w-4 animate-spin mr-1"/> : <Send className="h-4 w-4 mr-1"/>}
              Publish
            </Button>)}
          <Button size="sm" onClick={handleAddMaterial}>
            <Plus className="h-4 w-4 mr-1"/>
            Add material
          </Button>
        </div>
      </div>

      {/* Materials List */}
      {materials.length > 0 ? (<div className="space-y-4">
          {materials.map((material, index) => (<Card key={material.id || index} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-primary"/>
                  </div>
                  <select value={material.category} onChange={(e) => handleUpdateMaterial(index, 'category', e.target.value)} className="h-9 px-3 rounded-md border border-input bg-background font-medium">
                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                  {material.is_published && (<Badge className="bg-green-100 text-green-700 border-0">
                      <CheckCircle className="h-3 w-3 mr-1"/>
                      Published
                    </Badge>)}
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteMaterial(index)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs">Material Type *</Label>
                  <Input value={material.material_type} onChange={(e) => handleUpdateMaterial(index, 'material_type', e.target.value)} placeholder="E.g., Vitrified Tiles" className="h-9"/>
                </div>
                <div>
                  <Label className="text-xs">Brand</Label>
                  <Input value={material.brand || ''} onChange={(e) => handleUpdateMaterial(index, 'brand', e.target.value)} placeholder="E.g., Kajaria" className="h-9"/>
                </div>
                <div>
                  <Label className="text-xs">Color/Shade</Label>
                  <Input value={material.color || ''} onChange={(e) => handleUpdateMaterial(index, 'color', e.target.value)} placeholder="E.g., Arctic White" className="h-9"/>
                </div>
                <div>
                  <Label className="text-xs">Finish</Label>
                  <Input value={material.finish || ''} onChange={(e) => handleUpdateMaterial(index, 'finish', e.target.value)} placeholder="E.g., Matte, Glossy" className="h-9"/>
                </div>
                <div>
                  <Label className="text-xs">Price/Unit</Label>
                  <Input type="number" value={material.price_per_unit || ''} onChange={(e) => handleUpdateMaterial(index, 'price_per_unit', parseFloat(e.target.value) || 0)} placeholder="₹" className="h-9"/>
                </div>
                <div>
                  <Label className="text-xs">Unit</Label>
                  <select value={material.unit || 'sq ft'} onChange={(e) => handleUpdateMaterial(index, 'unit', e.target.value)} className="w-full h-9 px-3 rounded-md border border-input bg-background">
                    <option value="sq ft">sq ft</option>
                    <option value="sq m">sq m</option>
                    <option value="litre">litre</option>
                    <option value="unit">unit</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Specifications / Notes</Label>
                  <Input value={material.specifications || ''} onChange={(e) => handleUpdateMaterial(index, 'specifications', e.target.value)} placeholder="Additional specs, dimensions, etc." className="h-9"/>
                </div>
              </div>
            </Card>))}
        </div>) : (<Card className="p-8 text-center">
          <Layers className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50"/>
          <p className="text-muted-foreground mb-4">No materials specified yet</p>
          <Button onClick={handleAddMaterial}>
            <Plus className="h-4 w-4 mr-1"/>
            Add first material
          </Button>
        </Card>)}
    </div>);
}
