import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Send, DollarSign, Calculator, Loader2, Save, CheckCircle, } from 'lucide-react';
export function AdminBudgetManager({ projectId }) {
    const { toast } = useToast();
    const [budgetItems, setBudgetItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [published, setPublished] = useState(false);
    const categories = ['Furniture', 'Lighting', 'Flooring', 'Wall Finishes', 'Decor', 'Labor'];
    useEffect(() => {
        fetchBudget();
    }, [projectId]);
    const fetchBudget = async () => {
        setLoading(true);
        const { data } = await appDataClient
            .from('project_budgets')
            .select('*')
            .eq('project_id', projectId)
            .order('category');
        if (data && data.length > 0) {
            setBudgetItems(data.map((item) => ({
                id: item.id,
                category: item.category,
                item_name: item.item_name,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
            })));
            setPublished(data[0].is_published || false);
        }
        else {
            setBudgetItems([]);
        }
        setLoading(false);
    };
    const handleAddItem = (category) => {
        setBudgetItems([
            ...budgetItems,
            { category, item_name: '', quantity: 1, unit_price: 0, total_price: 0 },
        ]);
    };
    const handleUpdateItem = (index, field, value) => {
        const updated = [...budgetItems];
        updated[index] = { ...updated[index], [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
            updated[index].total_price = updated[index].quantity * updated[index].unit_price;
        }
        setBudgetItems(updated);
    };
    const handleDeleteItem = (index) => {
        setBudgetItems(budgetItems.filter((_, i) => i !== index));
    };
    const handleSave = async () => {
        setSaving(true);
        try {
            // Delete existing
            await appDataClient.from('project_budgets').delete().eq('project_id', projectId);
            // Insert new
            const itemsToInsert = budgetItems
                .filter(item => item.item_name.trim())
                .map(item => ({
                project_id: projectId,
                category: item.category,
                item_name: item.item_name,
                description: item.description || '',
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
                is_published: published,
            }));
            if (itemsToInsert.length === 0) {
                toast({
                    title: 'No items to save',
                    description: 'Add at least one budget item',
                    variant: 'destructive',
                });
                setSaving(false);
                return;
            }
            const { error } = await appDataClient.from('project_budgets').insert(itemsToInsert);
            if (error)
                throw error;
            toast({
                title: 'Budget saved!',
                description: 'Budget items saved successfully',
            });
            fetchBudget();
        }
        catch (error) {
            toast({
                title: 'Save failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSaving(false);
        }
    };
    const handlePublish = async () => {
        setSaving(true);
        try {
            // Save first
            await handleSave();
            const { error } = await appDataClient
                .from('project_budgets')
                .update({ is_published: true, published_at: new Date().toISOString() })
                .eq('project_id', projectId);
            if (error)
                throw error;
            // Notify user
            try {
                await appDataClient.functions.invoke('send-notification', {
                    body: {
                        type: 'budget_published',
                        project_id: projectId,
                    },
                });
            }
            catch (e) {
                console.error('Notification failed:', e);
            }
            toast({
                title: 'Budget published!',
                description: 'Customer can now view the budget',
            });
            setPublished(true);
        }
        catch (error) {
            toast({
                title: 'Publish failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSaving(false);
        }
    };
    const grandTotal = budgetItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
    const categoryTotals = categories.map(cat => ({
        category: cat,
        total: budgetItems
            .filter(item => item.category === cat)
            .reduce((sum, item) => sum + (item.total_price || 0), 0),
    }));
    if (loading) {
        return (<div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Budget Manager</h3>
          <p className="text-sm text-muted-foreground">Create itemized budget breakdown</p>
        </div>
        <div className="flex items-center gap-2">
          {published && (<Badge className="bg-emerald-100 text-emerald-700 gap-1">
              <CheckCircle className="h-3 w-3"/>
              Published
            </Badge>)}
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1"/> : <Save className="h-4 w-4 mr-1"/>}
            Save draft
          </Button>
          {!published && (<Button size="sm" onClick={handlePublish} disabled={saving || budgetItems.filter(i => i.item_name).length === 0} className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4 mr-1"/>
              Publish
            </Button>)}
        </div>
      </div>

      {/* Budget by Category */}
      {categories.map((category) => {
            const categoryItems = budgetItems.filter(item => item.category === category);
            const categoryTotal = categoryTotals.find(c => c.category === category)?.total || 0;
            return (<Card key={category} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary"/>
                </div>
                <div>
                  <h4 className="font-medium">{category}</h4>
                  <p className="text-xs text-muted-foreground">
                    {categoryItems.filter(i => i.item_name).length} items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-semibold">₹{categoryTotal.toLocaleString()}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAddItem(category)}>
                  <Plus className="h-4 w-4 mr-1"/>
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {categoryItems.map((item, idx) => {
                    const globalIndex = budgetItems.indexOf(item);
                    return (<div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                      <Label className="text-xs">Item Name</Label>
                      <Input value={item.item_name} onChange={(e) => handleUpdateItem(globalIndex, 'item_name', e.target.value)} placeholder="E.g., Sofa Set" className="h-9"/>
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Description</Label>
                      <Input value={item.description || ''} onChange={(e) => handleUpdateItem(globalIndex, 'description', e.target.value)} placeholder="Details..." className="h-9"/>
                    </div>
                    <div className="col-span-1">
                      <Label className="text-xs">Qty</Label>
                      <Input type="number" value={item.quantity} onChange={(e) => handleUpdateItem(globalIndex, 'quantity', parseInt(e.target.value) || 0)} className="h-9" min="0"/>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Unit ₹</Label>
                      <Input type="number" value={item.unit_price} onChange={(e) => handleUpdateItem(globalIndex, 'unit_price', parseInt(e.target.value) || 0)} className="h-9" min="0"/>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Total</Label>
                      <div className="h-9 px-3 flex items-center bg-muted rounded-md font-medium">
                        ₹{(item.total_price || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(globalIndex)} className="h-9 w-9 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </div>);
                })}

              {categoryItems.length === 0 && (<p className="text-sm text-muted-foreground text-center py-4">
                  No items in this category
                </p>)}
            </div>
          </Card>);
        })}

      {/* Grand Total */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-primary"/>
            <div>
              <p className="font-medium">Grand Total</p>
              <p className="text-2xl font-bold text-primary">
                ₹{grandTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>);
}

