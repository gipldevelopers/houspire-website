import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Plus, Trash2, Save, Send, DollarSign, Package, Sofa, Lightbulb, PaintBucket, Hammer, ShoppingCart, } from 'lucide-react';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
const CATEGORIES = [
    { value: 'furniture', label: 'Furniture', icon: Sofa },
    { value: 'lighting', label: 'Lighting', icon: Lightbulb },
    { value: 'decor', label: 'Decor', icon: Package },
    { value: 'paint', label: 'Paint & Finishes', icon: PaintBucket },
    { value: 'labor', label: 'Labor & Installation', icon: Hammer },
    { value: 'other', label: 'Other', icon: ShoppingCart },
];
export function BudgetEditor({ projectId, conceptId }) {
    const { toast } = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        fetchBudgetItems();
    }, [projectId, conceptId]);
    const fetchBudgetItems = async () => {
        setLoading(true);
        if (conceptId) {
            const { data } = await appDataClient
                .from('concept_products')
                .select('*')
                .eq('concept_id', conceptId)
                .order('product_category');
            if (data) {
                setItems(data.map((p) => ({
                    id: p.id,
                    category: p.product_category,
                    item_name: p.product_name,
                    quantity: p.quantity || 1,
                    unit_price: p.price_inr,
                    vendor_name: p.vendor_name || '',
                    product_link: p.product_link || '',
                    notes: p.notes || '',
                })));
            }
        }
        setLoading(false);
    };
    const addItem = () => {
        const newItem = {
            id: `temp_${Date.now()}`,
            category: 'furniture',
            item_name: '',
            quantity: 1,
            unit_price: 0,
            vendor_name: '',
            product_link: '',
            notes: '',
        };
        setItems((prev) => [...prev, newItem]);
    };
    const updateItem = (id, field, value) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };
    const removeItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };
    const saveItems = async () => {
        if (!conceptId) {
            toast({
                title: 'No concept selected',
                description: 'Please select a concept to add budget items',
                variant: 'destructive',
            });
            return;
        }
        setSaving(true);
        // Delete existing items
        await appDataClient.from('concept_products').delete().eq('concept_id', conceptId);
        // Insert new items
        const { error } = await appDataClient.from('concept_products').insert(items.map((item) => ({
            concept_id: conceptId,
            product_category: item.category,
            product_name: item.item_name,
            quantity: item.quantity,
            price_inr: item.unit_price,
            vendor_name: item.vendor_name || null,
            product_link: item.product_link || null,
            notes: item.notes || null,
        })));
        if (error) {
            toast({
                title: 'Save failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        else {
            toast({
                title: 'Budget saved!',
                description: 'All items have been saved successfully',
            });
            fetchBudgetItems();
        }
        setSaving(false);
    };
    const publishBudget = async () => {
        await saveItems();
        // Send notification to customer
        try {
            await appDataClient.functions.invoke('send-notification', {
                body: {
                    type: 'budget_ready',
                    project_id: projectId,
                },
            });
            toast({
                title: 'Budget published!',
                description: 'Customer has been notified',
            });
        }
        catch (error) {
            console.error('Failed to send notification:', error);
        }
    };
    const totalBudget = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const categoryTotals = CATEGORIES.map((cat) => ({
        ...cat,
        total: items
            .filter((item) => item.category === cat.value)
            .reduce((sum, item) => sum + item.quantity * item.unit_price, 0),
    }));
    if (loading) {
        return (<div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading budget...</div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <p className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </div>
          </div>
        </Card>

        {categoryTotals.slice(0, 3).map((cat) => (<Card key={cat.value} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <cat.icon className="h-5 w-5 text-muted-foreground"/>
              </div>
              <div>
                <p className="text-lg font-semibold">₹{cat.total.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{cat.label}</p>
              </div>
            </div>
          </Card>))}
      </div>

      {/* Items Table */}
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Budget Items ({items.length})</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2"/>
              Add Item
            </Button>
            <Button variant="outline" size="sm" onClick={saveItems} disabled={saving}>
              <Save className="h-4 w-4 mr-2"/>
              Save
            </Button>
            <Button size="sm" onClick={publishBudget} disabled={saving}>
              <Send className="h-4 w-4 mr-2"/>
              Publish to Customer
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead className="w-20">Qty</TableHead>
              <TableHead className="w-28">Unit Price</TableHead>
              <TableHead className="w-28">Total</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (<TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No items yet. Click "Add Item" to start building the budget.
                </TableCell>
              </TableRow>) : (items.map((item) => (<TableRow key={item.id}>
                  <TableCell>
                    <Select value={item.category} onValueChange={(val) => updateItem(item.id, 'category', val)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input value={item.item_name} onChange={(e) => updateItem(item.id, 'item_name', e.target.value)} placeholder="Item name..." className="min-w-[200px]"/>
                  </TableCell>
                  <TableCell>
                    <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)} className="w-16"/>
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={item.unit_price} onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)} className="w-24"/>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{(item.quantity * item.unit_price).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Input value={item.vendor_name} onChange={(e) => updateItem(item.id, 'vendor_name', e.target.value)} placeholder="Vendor..." className="w-28"/>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </TableCell>
                </TableRow>)))}
          </TableBody>
        </Table>

        {items.length > 0 && (<div className="p-4 border-t bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="font-medium">Grand Total</span>
              <span className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>)}
      </Card>
    </div>);
}

