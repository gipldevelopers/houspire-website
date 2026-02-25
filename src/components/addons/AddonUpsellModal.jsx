import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getRecommendedAddons, addAddonToOrder } from '@/lib/addon-recommendation-service';
export function AddonUpsellModal({ orderId, open, onClose, onPurchase }) {
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    useEffect(() => {
        if (open && orderId) {
            loadAddons();
        }
    }, [open, orderId]);
    async function loadAddons() {
        setLoading(true);
        const recommendations = await getRecommendedAddons(orderId);
        setAddons(recommendations);
        setLoading(false);
    }
    async function handleAddAddon(addon) {
        setPurchasing(addon.id);
        const result = await addAddonToOrder(orderId, addon.id, addon.price);
        if (result.success) {
            toast({
                title: 'Add-on added!',
                description: `${addon.name} has been added to your order`
            });
            if (onPurchase) {
                onPurchase(addon.id, addon.price);
            }
            // Remove from list
            setAddons(prev => prev.filter(a => a.id !== addon.id));
        }
        else {
            toast({
                variant: 'destructive',
                title: 'Failed to add',
                description: 'Please try again or contact support'
            });
        }
        setPurchasing(null);
    }
    function formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
    return (<Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary"/>
            Enhance Your Design
          </DialogTitle>
          <DialogDescription>
            Complete your project with these premium add-ons
          </DialogDescription>
        </DialogHeader>

        {loading ? (<div className="space-y-4 py-4">
            {[1, 2, 3].map(i => (<Skeleton key={i} className="h-32 w-full rounded-xl"/>))}
          </div>) : addons.length === 0 ? (<div className="py-8 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500 mb-3"/>
            <p className="text-foreground font-medium">You're all set!</p>
            <p className="text-sm text-muted-foreground mt-1">
              No additional add-ons available for this order
            </p>
          </div>) : (<div className="space-y-4 py-4">
            {addons.map(addon => (<Card key={addon.id} className="p-4 border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{addon.icon || '✨'}</span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{addon.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {addon.short_description}
                        </p>
                        <p className="text-xs text-primary mt-1">
                          {addon.relevance_reason}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        {addon.discount_percentage > 0 && addon.original_price && (<p className="text-sm line-through text-muted-foreground">
                            {formatPrice(addon.original_price)}
                          </p>)}
                        <p className="text-lg font-bold text-foreground">
                          {formatPrice(addon.price)}
                        </p>
                        {addon.discount_percentage > 0 && (<Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600">
                            Save {addon.discount_percentage}%
                          </Badge>)}
                      </div>
                    </div>

                    {addon.features && addon.features.length > 0 && (<div className="flex flex-wrap gap-2 mt-3 mb-3">
                        {addon.features.slice(0, 3).map((feature, index) => (<span key={index} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                            {feature}
                          </span>))}
                      </div>)}

                    <Button size="sm" onClick={() => handleAddAddon(addon)} disabled={purchasing === addon.id} className="w-full sm:w-auto">
                      {purchasing === addon.id ? (<>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                          Adding...
                        </>) : (<>Add to Order</>)}
                    </Button>
                  </div>
                </div>
              </Card>))}
          </div>)}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            💡 Add-ons integrate seamlessly with your design
          </p>
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>);
}
