import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Send, Trash2, Store, Phone, Mail, MapPin, User, Loader2, CheckCircle, } from 'lucide-react';
export function AdminVendorsManager({ projectId }) {
    const { toast } = useToast();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [published, setPublished] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVendor, setNewVendor] = useState({
        name: '',
        category: 'Furniture',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        items_supplied: '',
        price_range: '',
    });
    const categories = ['Furniture', 'Lighting', 'Flooring', 'Materials', 'Contractor', 'Decor'];
    useEffect(() => {
        fetchVendors();
    }, [projectId]);
    const fetchVendors = async () => {
        setLoading(true);
        const { data } = await appDataClient
            .from('project_vendors')
            .select('*')
            .eq('project_id', projectId)
            .order('category');
        if (data && data.length > 0) {
            setVendors(data);
            setPublished(data[0].is_published || false);
        }
        else {
            setVendors([]);
        }
        setLoading(false);
    };
    const handleAddVendor = async () => {
        if (!newVendor.name || !newVendor.category) {
            toast({
                title: 'Missing info',
                description: 'Please fill vendor name and category',
                variant: 'destructive',
            });
            return;
        }
        setSaving(true);
        const { error } = await appDataClient.from('project_vendors').insert({
            project_id: projectId,
            name: newVendor.name,
            category: newVendor.category,
            contact_person: newVendor.contact_person || null,
            phone: newVendor.phone || null,
            email: newVendor.email || null,
            address: newVendor.address || null,
            items_supplied: newVendor.items_supplied || null,
            price_range: newVendor.price_range || null,
            is_published: false,
        });
        if (!error) {
            toast({ title: 'Vendor added!' });
            setShowAddForm(false);
            setNewVendor({
                name: '',
                category: 'Furniture',
                contact_person: '',
                phone: '',
                email: '',
                address: '',
                items_supplied: '',
                price_range: '',
            });
            fetchVendors();
        }
        else {
            toast({ title: 'Failed to add vendor', description: error.message, variant: 'destructive' });
        }
        setSaving(false);
    };
    const handleDeleteVendor = async (vendorId) => {
        await appDataClient.from('project_vendors').delete().eq('id', vendorId);
        toast({ title: 'Vendor deleted' });
        fetchVendors();
    };
    const handlePublish = async () => {
        setSaving(true);
        const { error } = await appDataClient
            .from('project_vendors')
            .update({ is_published: true, published_at: new Date().toISOString() })
            .eq('project_id', projectId);
        if (!error) {
            toast({
                title: 'Vendors published!',
                description: 'Customer can now view vendors',
            });
            setPublished(true);
            try {
                await appDataClient.functions.invoke('send-notification', {
                    body: {
                        type: 'vendors_published',
                        project_id: projectId,
                    },
                });
            }
            catch (e) {
                console.error('Notification failed:', e);
            }
        }
        setSaving(false);
    };
    if (loading) {
        return (<div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Vendor Recommendations</h3>
          <p className="text-sm text-muted-foreground">Curated vendor list with contacts</p>
        </div>
        <div className="flex items-center gap-2">
          {published && (<Badge className="bg-emerald-100 text-emerald-700 gap-1">
              <CheckCircle className="h-3 w-3"/>
              Published
            </Badge>)}
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-1"/>
            Add vendor
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (<Card className="p-6">
          <h4 className="font-medium mb-4">Add New Vendor</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>Vendor Name *</Label>
              <Input value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} placeholder="E.g., Urban Ladder"/>
            </div>
            <div>
              <Label>Category *</Label>
              <select value={newVendor.category} onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background">
                {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div>
              <Label>Contact Person</Label>
              <Input value={newVendor.contact_person} onChange={(e) => setNewVendor({ ...newVendor, contact_person: e.target.value })} placeholder="Name"/>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={newVendor.phone} onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} placeholder="+91 XXXXX XXXXX"/>
            </div>
            <div>
              <Label>Email</Label>
              <Input value={newVendor.email} onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })} placeholder="contact@vendor.com"/>
            </div>
            <div>
              <Label>Items Supplied</Label>
              <Input value={newVendor.items_supplied} onChange={(e) => setNewVendor({ ...newVendor, items_supplied: e.target.value })} placeholder="Sofas, chairs, tables"/>
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input value={newVendor.address} onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })} placeholder="Full address"/>
            </div>
            <div>
              <Label>Price Range</Label>
              <Input value={newVendor.price_range} onChange={(e) => setNewVendor({ ...newVendor, price_range: e.target.value })} placeholder="₹10k - ₹50k"/>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddVendor} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1"/>}
              Add vendor
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>)}

      {/* Vendors List */}
      {vendors.length > 0 ? (<div className="grid gap-4">
          {vendors.map((vendor) => (<Card key={vendor.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary"/>
                  </div>
                  <div>
                    <h4 className="font-medium">{vendor.name}</h4>
                    <Badge variant="outline" className="mt-1">{vendor.category}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => vendor.id && handleDeleteVendor(vendor.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {vendor.contact_person && (<div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4"/>
                    {vendor.contact_person}
                  </div>)}
                {vendor.phone && (<div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4"/>
                    {vendor.phone}
                  </div>)}
                {vendor.email && (<div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4"/>
                    {vendor.email}
                  </div>)}
                {vendor.address && (<div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4"/>
                    {vendor.address}
                  </div>)}
              </div>

              {(vendor.items_supplied || vendor.price_range) && (<div className="flex gap-4 mt-3 pt-3 border-t text-sm">
                  {vendor.items_supplied && (<div>
                      <span className="text-muted-foreground">Items: </span>
                      {vendor.items_supplied}
                    </div>)}
                  {vendor.price_range && (<div>
                      <span className="text-muted-foreground">Price: </span>
                      {vendor.price_range}
                    </div>)}
                </div>)}
            </Card>))}
        </div>) : (<Card className="p-8 text-center">
          <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50"/>
          <p className="text-muted-foreground mb-4">No vendors added yet</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-1"/>
            Add first vendor
          </Button>
        </Card>)}

      {/* Publish */}
      {vendors.length > 0 && !published && (<div className="flex justify-end">
          <Button onClick={handlePublish} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-1"/>}
            <Send className="h-4 w-4 mr-1"/>
            Publish vendor list
          </Button>
        </div>)}
    </div>);
}

