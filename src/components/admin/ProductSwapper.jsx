import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Save, Package, ThumbsUp, ThumbsDown, Wand2, Loader2 } from 'lucide-react';
export function ProductSwapper({ product, onUpdate }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [formData, setFormData] = useState({
        product_name: product.product_name,
        product_category: product.product_category,
        product_image_url: product.product_image_url || '',
        product_link: product.product_link || '',
        vendor_name: product.vendor_name || '',
        price_inr: product.price_inr,
        quantity: product.quantity
    });
    const [alternatives, setAlternatives] = useState([]);
    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await appDataClient
                .from('concept_products')
                .update({
                product_name: formData.product_name,
                product_category: formData.product_category,
                product_image_url: formData.product_image_url || null,
                product_link: formData.product_link || null,
                vendor_name: formData.vendor_name || null,
                price_inr: formData.price_inr,
                quantity: formData.quantity
            })
                .eq('id', product.id);
            if (error)
                throw error;
            toast({
                title: 'Product updated!',
                description: 'Changes have been saved.',
            });
            onUpdate();
            setOpen(false);
        }
        catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update product.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const generateAlternatives = async () => {
        setGenerating(true);
        // Simulate AI-generated alternatives
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAlternatives([
            {
                name: `${product.product_name} (Budget Option)`,
                price: Math.round(product.price_inr * 0.7),
                vendor: 'Amazon',
                url: '#'
            },
            {
                name: `${product.product_name} (Premium)`,
                price: Math.round(product.price_inr * 1.3),
                vendor: 'Urban Ladder',
                url: '#'
            },
            {
                name: `${product.product_name} Alternative`,
                price: Math.round(product.price_inr * 0.85),
                vendor: 'Pepperfry',
                url: '#'
            }
        ]);
        setGenerating(false);
    };
    const selectAlternative = (alt) => {
        setFormData(prev => ({
            ...prev,
            product_name: alt.name,
            price_inr: alt.price,
            vendor_name: alt.vendor,
            product_link: alt.url
        }));
        setAlternatives([]);
    };
    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {product.product_image_url ? (<img src={product.product_image_url} alt={product.product_name} className="w-full h-full object-cover rounded-lg"/>) : (<Package className="h-6 w-6 text-muted-foreground"/>)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.product_name}</p>
              <p className="text-sm text-muted-foreground">{product.product_category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-primary">
                  ₹{product.price_inr.toLocaleString()}
                </span>
                {product.user_thumbs && (<Badge variant={product.user_thumbs === 'up' ? 'default' : 'destructive'} className="text-xs">
                    {product.user_thumbs === 'up' ? (<ThumbsUp className="h-3 w-3"/>) : (<ThumbsDown className="h-3 w-3"/>)}
                  </Badge>)}
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Feedback Indicator */}
          {product.user_thumbs && (<Card className={`p-4 ${product.user_thumbs === 'up'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                {product.user_thumbs === 'up' ? (<>
                    <ThumbsUp className="h-5 w-5 text-green-600"/>
                    <span className="text-green-800 font-medium">Customer loves this product!</span>
                  </>) : (<>
                    <ThumbsDown className="h-5 w-5 text-red-600"/>
                    <span className="text-red-800 font-medium">Customer wants alternatives</span>
                  </>)}
              </div>
            </Card>)}

          {/* Product Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={formData.product_name} onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))} className="mt-1"/>
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.product_category} onChange={(e) => setFormData(prev => ({ ...prev, product_category: e.target.value }))} className="mt-1"/>
            </div>
            
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" value={formData.price_inr} onChange={(e) => setFormData(prev => ({ ...prev, price_inr: parseInt(e.target.value) || 0 }))} className="mt-1"/>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" value={formData.quantity} onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))} className="mt-1"/>
            </div>
            
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input id="vendor" value={formData.vendor_name} onChange={(e) => setFormData(prev => ({ ...prev, vendor_name: e.target.value }))} className="mt-1"/>
            </div>
            
            <div>
              <Label htmlFor="link">Product Link</Label>
              <Input id="link" value={formData.product_link} onChange={(e) => setFormData(prev => ({ ...prev, product_link: e.target.value }))} placeholder="https://..." className="mt-1"/>
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" value={formData.product_image_url} onChange={(e) => setFormData(prev => ({ ...prev, product_image_url: e.target.value }))} placeholder="https://..." className="mt-1"/>
            </div>
          </div>

          {/* AI Alternatives */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>AI Suggested Alternatives</Label>
              <Button variant="outline" size="sm" onClick={generateAlternatives} disabled={generating}>
                {generating ? (<Loader2 className="h-4 w-4 mr-2 animate-spin"/>) : (<Wand2 className="h-4 w-4 mr-2"/>)}
                Generate Alternatives
              </Button>
            </div>
            
            {alternatives.length > 0 && (<div className="space-y-2">
                {alternatives.map((alt, index) => (<Card key={index} className="p-3 hover:bg-muted cursor-pointer transition-colors" onClick={() => selectAlternative(alt)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{alt.name}</p>
                        <p className="text-sm text-muted-foreground">{alt.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">₹{alt.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Click to use</p>
                      </div>
                    </div>
                  </Card>))}
              </div>)}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={loading}>
              {loading ? (<Loader2 className="h-4 w-4 mr-2 animate-spin"/>) : (<Save className="h-4 w-4 mr-2"/>)}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
}

