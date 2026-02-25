import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ADD_ONS, BASE_PACKAGE, FREE_ADDON_OPTIONS } from '@/lib/pricing';
import { Gift, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useNavigate } from 'react-router-dom';
export function PackageBuilderModal({ open, onOpenChange }) {
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [freeAddon, setFreeAddon] = useState('');
    const navigate = useNavigate();
    const addItem = useCartStore((state) => state.addItem);
    const toggleAddon = (id) => {
        setSelectedAddons(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const calculateTotal = () => {
        const addonsTotal = selectedAddons.reduce((sum, id) => {
            const addon = ADD_ONS.find(a => a.id === id);
            return sum + (addon?.price || 0);
        }, 0);
        return BASE_PACKAGE.price + addonsTotal;
    };
    const handleCheckout = () => {
        // Add base package
        addItem({
            id: BASE_PACKAGE.id,
            name: BASE_PACKAGE.name,
            price: BASE_PACKAGE.price,
            type: 'base'
        });
        // Add selected addons
        selectedAddons.forEach(id => {
            const addon = ADD_ONS.find(a => a.id === id);
            if (addon) {
                addItem({
                    id: addon.id,
                    name: addon.name,
                    price: addon.price,
                    type: 'addon'
                });
            }
        });
        onOpenChange(false);
        navigate('/checkout');
    };
    const addonsByCategory = {
        visual: ADD_ONS.filter(a => a.category === 'visual'),
        execution: ADD_ONS.filter(a => a.category === 'execution'),
        design: ADD_ONS.filter(a => a.category === 'design'),
        premium: ADD_ONS.filter(a => a.category === 'premium'),
        support: ADD_ONS.filter(a => a.category === 'support'),
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">Build Your Custom Package</DialogTitle>
          <DialogDescription>
            Start with the base package and add only what you need
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Base Package */}
          <div className="bg-accent/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground">Start with Base: ₹{BASE_PACKAGE.price}</h4>
              <Badge>Required</Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ 1 design concept</p>
              <p>✓ 2 high-quality 3D renders</p>
              <p>✓ Your designer: Priya/Arjun/Meera</p>
            </div>
          </div>

          {/* Free Add-on Gift */}
          <div className="border-2 border-dashed border-secondary/50 rounded-lg p-4 bg-secondary/5">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-5 w-5 text-secondary"/>
              <h4 className="font-semibold text-foreground">Choose 1 FREE Add-on (First-time customer)</h4>
            </div>
            <div className="space-y-2">
              {FREE_ADDON_OPTIONS.map(option => (<label key={option.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="freeAddon" value={option.id} checked={freeAddon === option.id} onChange={(e) => setFreeAddon(e.target.value)} className="w-4 h-4 text-secondary"/>
                  <span className="text-sm">
                    {option.name} <span className="text-green-600">(₹{option.value} value)</span>
                  </span>
                </label>))}
            </div>
          </div>

          <Separator />

          {/* Visual Upgrades */}
          <div>
            <h4 className="font-semibold text-muted-foreground mb-3">━━━ Visual Upgrades ━━━</h4>
            <div className="space-y-3">
              {addonsByCategory.visual.map(addon => (<label key={addon.id} className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox checked={selectedAddons.includes(addon.id)} onCheckedChange={() => toggleAddon(addon.id)} className="mt-0.5"/>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground group-hover:text-secondary transition-colors">
                        {addon.name}
                      </span>
                      <span className="text-sm font-semibold text-foreground">₹{addon.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                </label>))}
            </div>
          </div>

          {/* Execution Tools */}
          <div>
            <h4 className="font-semibold text-muted-foreground mb-3">━━━ Execution Tools ━━━</h4>
            <div className="space-y-3">
              {addonsByCategory.execution.map(addon => (<label key={addon.id} className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox checked={selectedAddons.includes(addon.id)} onCheckedChange={() => toggleAddon(addon.id)} className="mt-0.5"/>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground group-hover:text-secondary transition-colors">
                        {addon.name}
                      </span>
                      <span className="text-sm font-semibold text-foreground">₹{addon.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                </label>))}
            </div>
          </div>

          {/* Design Options */}
          <div>
            <h4 className="font-semibold text-muted-foreground mb-3">━━━ Design Options ━━━</h4>
            <div className="space-y-3">
              {addonsByCategory.design.map(addon => (<label key={addon.id} className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox checked={selectedAddons.includes(addon.id)} onCheckedChange={() => toggleAddon(addon.id)} className="mt-0.5"/>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground group-hover:text-secondary transition-colors">
                        {addon.name}
                      </span>
                      <span className="text-sm font-semibold text-foreground">₹{addon.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                </label>))}
            </div>
          </div>

          {/* Premium Features */}
          <div>
            <h4 className="font-semibold text-muted-foreground mb-3">━━━ Premium Features ━━━</h4>
            <div className="space-y-3">
              {addonsByCategory.premium.map(addon => (<label key={addon.id} className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox checked={selectedAddons.includes(addon.id)} onCheckedChange={() => toggleAddon(addon.id)} className="mt-0.5"/>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground group-hover:text-secondary transition-colors">
                        {addon.name}
                      </span>
                      <span className="text-sm font-semibold text-foreground">₹{addon.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                </label>))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-muted-foreground mb-3">━━━ Support ━━━</h4>
            <div className="space-y-3">
              {addonsByCategory.support.map(addon => (<label key={addon.id} className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox checked={selectedAddons.includes(addon.id)} onCheckedChange={() => toggleAddon(addon.id)} className="mt-0.5"/>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground group-hover:text-secondary transition-colors">
                        {addon.name}
                      </span>
                      <span className="text-sm font-semibold text-foreground">₹{addon.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                </label>))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Your Package Total</span>
            <span className="text-2xl font-bold text-foreground">
              ₹{calculateTotal().toLocaleString()}
            </span>
          </div>
          <Button onClick={handleCheckout} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <ShoppingCart className="mr-2 h-4 w-4"/>
            Continue to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
