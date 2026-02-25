import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Plus, Trash2, Edit, Send, ExternalLink, Layers, PaintBucket, Ruler, CheckCircle, } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const MATERIAL_CATEGORIES = [
    { value: 'paint', label: 'Paint & Wall Finishes' },
    { value: 'flooring', label: 'Flooring' },
    { value: 'tiles', label: 'Tiles' },
    { value: 'fabric', label: 'Fabrics & Upholstery' },
    { value: 'hardware', label: 'Hardware & Fixtures' },
    { value: 'wallpaper', label: 'Wallpaper' },
    { value: 'wood', label: 'Wood & Laminates' },
    { value: 'stone', label: 'Stone & Marble' },
    { value: 'glass', label: 'Glass & Mirrors' },
    { value: 'other', label: 'Other' },
];
export function MaterialsSection({ projectId }) {
    const { toast } = useToast();
    const [materials, setMaterials] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [formData, setFormData] = useState({
        category: 'paint',
        approved: false,
    });
    // Mock initial data
    useEffect(() => {
        setMaterials([
            {
                id: '1',
                category: 'paint',
                name: 'Asian Paints Royale Matt',
                brand: 'Asian Paints',
                model_code: 'R5478',
                color_finish: 'Warm White (7820)',
                dimensions: '4L can',
                quantity: '3 cans',
                unit_price: 2450,
                product_link: 'https://asianpaints.com/royale',
                notes: 'For living room walls - 2 coats recommended',
                approved: true,
            },
            {
                id: '2',
                category: 'flooring',
                name: 'Pergo European Oak',
                brand: 'Pergo',
                model_code: 'PER-OAK-32',
                color_finish: 'Natural Oak',
                dimensions: '1380 x 190 x 8mm',
                quantity: '45 sqm',
                unit_price: 285,
                product_link: 'https://pergo.com/oak',
                notes: 'AC4 rating - suitable for residential use',
                approved: false,
            },
        ]);
    }, [projectId]);
    const handleAdd = () => {
        if (!formData.name || !formData.category) {
            toast({
                title: 'Name required',
                description: 'Please enter material name',
                variant: 'destructive',
            });
            return;
        }
        const newMaterial = {
            id: Date.now().toString(),
            category: formData.category || 'other',
            name: formData.name || '',
            brand: formData.brand || '',
            model_code: formData.model_code || '',
            color_finish: formData.color_finish || '',
            dimensions: formData.dimensions || '',
            quantity: formData.quantity || '',
            unit_price: formData.unit_price || 0,
            product_link: formData.product_link || '',
            notes: formData.notes || '',
            approved: false,
        };
        setMaterials((prev) => [...prev, newMaterial]);
        setFormData({ category: 'paint', approved: false });
        setShowAddDialog(false);
        toast({
            title: 'Material added!',
        });
    };
    const handleUpdate = () => {
        if (!editingMaterial)
            return;
        setMaterials((prev) => prev.map((m) => (m.id === editingMaterial.id ? { ...m, ...formData } : m)));
        setEditingMaterial(null);
        setFormData({ category: 'paint', approved: false });
        toast({
            title: 'Material updated!',
        });
    };
    const handleDelete = (id) => {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        toast({
            title: 'Material removed',
        });
    };
    const handleApprove = (id) => {
        setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, approved: !m.approved } : m)));
    };
    const publishToCustomer = () => {
        toast({
            title: 'Materials published!',
            description: 'Customer can now view material specifications',
        });
    };
    const getCategoryLabel = (cat) => {
        return MATERIAL_CATEGORIES.find((c) => c.value === cat)?.label || cat;
    };
    const groupedMaterials = MATERIAL_CATEGORIES.map((cat) => ({
        ...cat,
        items: materials.filter((m) => m.category === cat.value),
    })).filter((g) => g.items.length > 0);
    const totalValue = materials.reduce((sum, m) => sum + m.unit_price * (parseFloat(m.quantity) || 1), 0);
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Material Specifications</h3>
          <p className="text-sm text-muted-foreground">
            Detailed material specs with codes, finishes, and sourcing links
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2"/>
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Material</DialogTitle>
                <DialogDescription>
                  Add material specifications for the project
                </DialogDescription>
              </DialogHeader>
              <MaterialForm formData={formData} setFormData={setFormData} onSubmit={handleAdd} submitLabel="Add Material"/>
            </DialogContent>
          </Dialog>
          <Button onClick={publishToCustomer}>
            <Send className="h-4 w-4 mr-2"/>
            Publish to Customer
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Layers className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <p className="text-2xl font-bold">{materials.length}</p>
              <p className="text-sm text-muted-foreground">Total Materials</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
              <CheckCircle className="h-5 w-5 text-emerald-600"/>
            </div>
            <div>
              <p className="text-2xl font-bold">{materials.filter((m) => m.approved).length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50">
              <Ruler className="h-5 w-5 text-amber-600"/>
            </div>
            <div>
              <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Est. Value</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Materials by Category */}
      {groupedMaterials.map((group) => (<Card key={group.value}>
          <div className="p-4 border-b">
            <h4 className="font-semibold flex items-center gap-2">
              <PaintBucket className="h-4 w-4 text-muted-foreground"/>
              {group.label}
              <Badge variant="secondary">{group.items.length} items</Badge>
            </h4>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Code / Finish</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.items.map((material) => (<TableRow key={material.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-xs text-muted-foreground">{material.brand}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-mono text-sm">{material.model_code}</p>
                      <p className="text-xs text-muted-foreground">{material.color_finish}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{material.quantity}</p>
                      <p className="text-xs text-muted-foreground">{material.dimensions}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{material.unit_price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={material.approved ? 'default' : 'secondary'} className={material.approved ? 'bg-emerald-600' : ''}>
                      {material.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {material.product_link && (<Button variant="ghost" size="sm" onClick={() => window.open(material.product_link, '_blank')}>
                          <ExternalLink className="h-4 w-4"/>
                        </Button>)}
                      <Button variant="ghost" size="sm" onClick={() => handleApprove(material.id)}>
                        <CheckCircle className={`h-4 w-4 ${material.approved ? 'text-emerald-600' : ''}`}/>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                    setEditingMaterial(material);
                    setFormData(material);
                }}>
                        <Edit className="h-4 w-4"/>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(material.id)}>
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </Card>))}

      {materials.length === 0 && (<Card className="p-12 text-center">
          <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
          <h3 className="font-medium text-foreground mb-2">No materials yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add material specifications for this project
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2"/>
            Add First Material
          </Button>
        </Card>)}

      {/* Edit Dialog */}
      <Dialog open={!!editingMaterial} onOpenChange={(open) => !open && setEditingMaterial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          <MaterialForm formData={formData} setFormData={setFormData} onSubmit={handleUpdate} submitLabel="Update Material"/>
        </DialogContent>
      </Dialog>
    </div>);
}
function MaterialForm({ formData, setFormData, onSubmit, submitLabel, }) {
    return (<div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category *</Label>
          <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Material Name *</Label>
          <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Asian Paints Royale"/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Brand</Label>
          <Input value={formData.brand || ''} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g., Asian Paints"/>
        </div>
        <div>
          <Label>Model / Code</Label>
          <Input value={formData.model_code || ''} onChange={(e) => setFormData({ ...formData, model_code: e.target.value })} placeholder="e.g., R5478"/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Color / Finish</Label>
          <Input value={formData.color_finish || ''} onChange={(e) => setFormData({ ...formData, color_finish: e.target.value })} placeholder="e.g., Warm White (7820)"/>
        </div>
        <div>
          <Label>Dimensions</Label>
          <Input value={formData.dimensions || ''} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} placeholder="e.g., 1200 x 600mm"/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Quantity</Label>
          <Input value={formData.quantity || ''} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="e.g., 3 cans, 45 sqm"/>
        </div>
        <div>
          <Label>Unit Price (₹)</Label>
          <Input type="number" value={formData.unit_price || ''} onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })} placeholder="0"/>
        </div>
      </div>

      <div>
        <Label>Product Link</Label>
        <Input value={formData.product_link || ''} onChange={(e) => setFormData({ ...formData, product_link: e.target.value })} placeholder="https://..."/>
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Application notes, special instructions..." rows={3}/>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>);
}
