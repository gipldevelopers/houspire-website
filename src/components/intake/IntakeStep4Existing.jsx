import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Plus, X, Check, RefreshCw } from 'lucide-react';
const commonItems = [
    'Bed Frame',
    'Mattress',
    'Wardrobe',
    'Study Table',
    'Dresser',
    'Side Tables',
    'Sofa',
    'Coffee Table',
    'Dining Table',
    'Chairs',
    'TV Unit',
    'Bookshelf',
    'Curtains',
    'Rug/Carpet',
    'Lighting Fixtures',
    'Wall Art',
    'Plants',
    'Storage Units',
];
export function IntakeStep4Existing({ value, onChange, }) {
    const [customItem, setCustomItem] = useState('');
    const toggleKeep = (item) => {
        const inKeep = value.keepItems.includes(item);
        const inReplace = value.replaceItems.includes(item);
        if (inKeep) {
            // Remove from keep
            onChange({
                ...value,
                keepItems: value.keepItems.filter((i) => i !== item),
            });
        }
        else {
            // Add to keep, remove from replace if there
            onChange({
                ...value,
                keepItems: [...value.keepItems, item],
                replaceItems: value.replaceItems.filter((i) => i !== item),
            });
        }
    };
    const toggleReplace = (item) => {
        const inKeep = value.keepItems.includes(item);
        const inReplace = value.replaceItems.includes(item);
        if (inReplace) {
            // Remove from replace
            onChange({
                ...value,
                replaceItems: value.replaceItems.filter((i) => i !== item),
            });
        }
        else {
            // Add to replace, remove from keep if there
            onChange({
                ...value,
                replaceItems: [...value.replaceItems, item],
                keepItems: value.keepItems.filter((i) => i !== item),
            });
        }
    };
    const addCustomItem = () => {
        if (customItem.trim() && !commonItems.includes(customItem.trim())) {
            onChange({
                ...value,
                keepItems: [...value.keepItems, customItem.trim()],
            });
            setCustomItem('');
        }
    };
    const getItemStatus = (item) => {
        if (value.keepItems.includes(item))
            return 'keep';
        if (value.replaceItems.includes(item))
            return 'replace';
        return 'none';
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Existing Items</h1>
        <p className="text-muted-foreground">
          Tell us what to keep and what can go
        </p>
        <Badge variant="secondary" className="mt-2">
          This step is optional
        </Badge>
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-muted/50">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white"/>
            </div>
            <span>Keep this item</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-white"/>
            </div>
            <span>Replace this item</span>
          </div>
        </div>
      </Card>

      {/* Items Grid */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Home className="h-5 w-5 text-primary"/>
          <h3 className="font-semibold">Common Furniture Items</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {commonItems.map((item) => {
            const status = getItemStatus(item);
            return (<div key={item} className={`p-3 rounded-lg border transition-all ${status === 'keep'
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                    : status === 'replace'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                        : 'border-border hover:border-muted-foreground/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleKeep(item)} className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${status === 'keep'
                    ? 'bg-green-500 text-white'
                    : 'bg-muted hover:bg-green-100 dark:hover:bg-green-900/30'}`}>
                    <Check className="h-3 w-3 inline mr-1"/>
                    Keep
                  </button>
                  <button onClick={() => toggleReplace(item)} className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${status === 'replace'
                    ? 'bg-amber-500 text-white'
                    : 'bg-muted hover:bg-amber-100 dark:hover:bg-amber-900/30'}`}>
                    <RefreshCw className="h-3 w-3 inline mr-1"/>
                    Replace
                  </button>
                </div>
              </div>);
        })}
        </div>
      </Card>

      {/* Add Custom Item */}
      <Card className="p-6">
        <Label className="font-semibold mb-3 block">
          Add Other Items
        </Label>
        <div className="flex gap-2">
          <Input placeholder="e.g., Antique Clock, Family Heirloom..." value={customItem} onChange={(e) => setCustomItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}/>
          <Button onClick={addCustomItem} variant="outline">
            <Plus className="h-4 w-4 mr-1"/>
            Add
          </Button>
        </div>
      </Card>

      {/* Summary */}
      {(value.keepItems.length > 0 || value.replaceItems.length > 0) && (<Card className="p-6">
          <h3 className="font-semibold mb-4">Summary</h3>
          
          {value.keepItems.length > 0 && (<div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500"/>
                Keeping ({value.keepItems.length} items)
              </p>
              <div className="flex flex-wrap gap-2">
                {value.keepItems.map((item) => (<Badge key={item} variant="secondary" className="gap-1">
                    {item}
                    <button onClick={() => toggleKeep(item)}>
                      <X className="h-3 w-3"/>
                    </button>
                  </Badge>))}
              </div>
            </div>)}

          {value.replaceItems.length > 0 && (<div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-amber-500"/>
                Replacing ({value.replaceItems.length} items)
              </p>
              <div className="flex flex-wrap gap-2">
                {value.replaceItems.map((item) => (<Badge key={item} variant="outline" className="gap-1 border-amber-500">
                    {item}
                    <button onClick={() => toggleReplace(item)}>
                      <X className="h-3 w-3"/>
                    </button>
                  </Badge>))}
              </div>
            </div>)}
        </Card>)}

      {/* Additional Notes */}
      <Card className="p-6">
        <Label htmlFor="notes" className="font-semibold mb-3 block">
          Additional Notes (Optional)
        </Label>
        <Textarea id="notes" placeholder="Any details about condition, sentimental value, or specific requirements for existing items..." value={value.notes} onChange={(e) => onChange({ ...value, notes: e.target.value })} rows={3}/>
      </Card>
    </div>);
}
