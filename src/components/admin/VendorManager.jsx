import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Plus, Trash2, Edit, Phone, Mail, MapPin, ExternalLink, Star, Send, Store, Building2, Truck, Wrench, } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const VENDOR_CATEGORIES = [
    { value: 'furniture', label: 'Furniture Store', icon: Store },
    { value: 'contractor', label: 'Contractor', icon: Wrench },
    { value: 'material', label: 'Material Supplier', icon: Building2 },
    { value: 'delivery', label: 'Delivery Partner', icon: Truck },
];
export function VendorManager({ projectId }) {
    const { toast } = useToast();
    const [vendors, setVendors] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({
        category: 'furniture',
        rating: 5,
    });
    // Mock initial data
    useEffect(() => {
        setVendors([
            {
                id: '1',
                name: 'Urban Ladder',
                category: 'furniture',
                contact_name: 'Rahul Sharma',
                phone: '+91 98765 43210',
                email: 'rahul@urbanladder.com',
                address: 'Koramangala, Bangalore',
                website: 'https://urbanladder.com',
                rating: 4.5,
                notes: 'Preferred vendor for sofas and beds',
            },
            {
                id: '2',
                name: 'Pepperfry',
                category: 'furniture',
                contact_name: 'Priya Desai',
                phone: '+91 87654 32109',
                email: 'priya@pepperfry.com',
                address: 'HSR Layout, Bangalore',
                website: 'https://pepperfry.com',
                rating: 4.2,
                notes: 'Good for decor items',
            },
        ]);
    }, [projectId]);
    const handleAddVendor = () => {
        if (!formData.name) {
            toast({
                title: 'Name required',
                description: 'Please enter vendor name',
                variant: 'destructive',
            });
            return;
        }
        const newVendor = {
            id: Date.now().toString(),
            name: formData.name || '',
            category: formData.category || 'furniture',
            contact_name: formData.contact_name || '',
            phone: formData.phone || '',
            email: formData.email || '',
            address: formData.address || '',
            website: formData.website || '',
            rating: formData.rating || 5,
            notes: formData.notes || '',
        };
        setVendors((prev) => [...prev, newVendor]);
        setFormData({ category: 'furniture', rating: 5 });
        setShowAddDialog(false);
        toast({
            title: 'Vendor added!',
            description: `${newVendor.name} has been added`,
        });
    };
    const handleUpdateVendor = () => {
        if (!editingVendor)
            return;
        setVendors((prev) => prev.map((v) => (v.id === editingVendor.id ? { ...v, ...formData } : v)));
        setEditingVendor(null);
        setFormData({ category: 'furniture', rating: 5 });
        toast({
            title: 'Vendor updated!',
        });
    };
    const handleDeleteVendor = (id) => {
        setVendors((prev) => prev.filter((v) => v.id !== id));
        toast({
            title: 'Vendor removed',
        });
    };
    const shareWithCustomer = () => {
        toast({
            title: 'Vendors shared!',
            description: 'Customer has been sent vendor details',
        });
    };
    const getCategoryIcon = (category) => {
        const cat = VENDOR_CATEGORIES.find((c) => c.value === category);
        return cat?.icon || Store;
    };
    const getCategoryLabel = (category) => {
        const cat = VENDOR_CATEGORIES.find((c) => c.value === category);
        return cat?.label || category;
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Recommended Vendors</h3>
          <p className="text-sm text-muted-foreground">
            Manage vendor recommendations for this project
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2"/>
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vendor</DialogTitle>
                <DialogDescription>
                  Add a vendor recommendation for this project
                </DialogDescription>
              </DialogHeader>
              <VendorForm formData={formData} setFormData={setFormData} onSubmit={handleAddVendor} submitLabel="Add Vendor"/>
            </DialogContent>
          </Dialog>
          <Button onClick={shareWithCustomer}>
            <Send className="h-4 w-4 mr-2"/>
            Share with Customer
          </Button>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {vendors.map((vendor) => {
            const CategoryIcon = getCategoryIcon(vendor.category);
            return (<motion.div key={vendor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <CategoryIcon className="h-5 w-5 text-primary"/>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{vendor.name}</h4>
                        <Badge variant="secondary" className="mt-1">
                          {getCategoryLabel(vendor.category)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current"/>
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                  </div>

                  {vendor.contact_name && (<p className="text-sm text-muted-foreground mb-2">
                      Contact: {vendor.contact_name}
                    </p>)}

                  <div className="space-y-2 mb-4">
                    {vendor.phone && (<div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground"/>
                        <a href={`tel:${vendor.phone}`} className="hover:underline">
                          {vendor.phone}
                        </a>
                      </div>)}
                    {vendor.email && (<div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground"/>
                        <a href={`mailto:${vendor.email}`} className="hover:underline">
                          {vendor.email}
                        </a>
                      </div>)}
                    {vendor.address && (<div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground"/>
                        <span>{vendor.address}</span>
                      </div>)}
                  </div>

                  {vendor.notes && (<p className="text-sm text-muted-foreground italic mb-4">
                      "{vendor.notes}"
                    </p>)}

                  <div className="flex items-center justify-between pt-3 border-t">
                    {vendor.website && (<Button variant="link" size="sm" className="p-0 h-auto" onClick={() => window.open(vendor.website, '_blank')}>
                        <ExternalLink className="h-3.5 w-3.5 mr-1"/>
                        Website
                      </Button>)}
                    <div className="flex gap-1 ml-auto">
                      <Button variant="ghost" size="sm" onClick={() => {
                    setEditingVendor(vendor);
                    setFormData(vendor);
                }}>
                        <Edit className="h-4 w-4"/>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteVendor(vendor.id)}>
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>);
        })}
        </AnimatePresence>
      </div>

      {vendors.length === 0 && (<Card className="p-12 text-center">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
          <h3 className="font-medium text-foreground mb-2">No vendors yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add vendor recommendations for this project
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2"/>
            Add First Vendor
          </Button>
        </Card>)}

      {/* Edit Dialog */}
      <Dialog open={!!editingVendor} onOpenChange={(open) => !open && setEditingVendor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <VendorForm formData={formData} setFormData={setFormData} onSubmit={handleUpdateVendor} submitLabel="Update Vendor"/>
        </DialogContent>
      </Dialog>
    </div>);
}
function VendorForm({ formData, setFormData, onSubmit, submitLabel, }) {
    return (<div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Vendor Name *</Label>
          <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Urban Ladder"/>
        </div>
        <div>
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VENDOR_CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Contact Person</Label>
          <Input value={formData.contact_name || ''} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} placeholder="Contact name"/>
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210"/>
        </div>
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="vendor@example.com"/>
      </div>

      <div>
        <Label>Address</Label>
        <Input value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Full address"/>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Website</Label>
          <Input value={formData.website || ''} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://..."/>
        </div>
        <div>
          <Label>Rating (1-5)</Label>
          <Input type="number" min={1} max={5} step={0.1} value={formData.rating || 5} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}/>
        </div>
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Why this vendor is recommended..." rows={3}/>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>);
}
