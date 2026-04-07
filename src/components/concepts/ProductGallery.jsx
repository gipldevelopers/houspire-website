import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, ExternalLink, Package, IndianRupee } from 'lucide-react';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
export function ProductGallery({ products, onFeedback }) {
    const { toast } = useToast();
    const [loadingId, setLoadingId] = useState(null);
    const handleThumbsUp = async (productId, currentThumb) => {
        setLoadingId(productId);
        const newValue = currentThumb === 'up' ? null : 'up';
        const { error } = await appDataClient
            .from('concept_products')
            .update({ user_thumbs: newValue })
            .eq('id', productId);
        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to save feedback',
                variant: 'destructive',
            });
        }
        else {
            onFeedback(productId, 'up');
            if (newValue === 'up') {
                toast({
                    title: 'Great choice! 👍',
                    description: 'We\'ll prioritize this product in your shopping list',
                });
            }
        }
        setLoadingId(null);
    };
    const handleThumbsDown = async (productId, currentThumb) => {
        setLoadingId(productId);
        const newValue = currentThumb === 'down' ? null : 'down';
        const { error } = await appDataClient
            .from('concept_products')
            .update({ user_thumbs: newValue })
            .eq('id', productId);
        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to save feedback',
                variant: 'destructive',
            });
        }
        else {
            onFeedback(productId, 'down');
            if (newValue === 'down') {
                toast({
                    title: 'Noted! 👎',
                    description: 'We\'ll suggest alternatives for this product',
                });
            }
        }
        setLoadingId(null);
    };
    // Group products by category
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.product_category || 'Other';
        if (!acc[category])
            acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});
    const totalBudget = products.reduce((sum, p) => sum + (p.price_inr * p.quantity), 0);
    return (<div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary"/>
          <span className="font-medium">{products.length} Products</span>
        </div>
        <div className="flex items-center gap-1 font-semibold">
          <IndianRupee className="h-4 w-4"/>
          {(totalBudget / 1000).toFixed(0)}k Total
        </div>
      </div>

      {/* Grouped Products */}
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (<div key={category} className="space-y-3">
          <h4 className="font-semibold text-lg capitalize flex items-center gap-2">
            {category}
            <Badge variant="secondary">{categoryProducts.length}</Badge>
          </h4>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {categoryProducts.map((product, index) => (<motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-square bg-muted relative">
                    {product.product_image_url ? (<img src={product.product_image_url} alt={product.product_name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground/50"/>
                      </div>)}
                    
                    {/* Thumbs Overlay */}
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <Button size="icon" variant={product.user_thumbs === 'up' ? 'default' : 'secondary'} className="h-8 w-8 rounded-full" onClick={() => handleThumbsUp(product.id, product.user_thumbs)} disabled={loadingId === product.id}>
                        <ThumbsUp className="h-4 w-4"/>
                      </Button>
                      <Button size="icon" variant={product.user_thumbs === 'down' ? 'destructive' : 'secondary'} className="h-8 w-8 rounded-full" onClick={() => handleThumbsDown(product.id, product.user_thumbs)} disabled={loadingId === product.id}>
                        <ThumbsDown className="h-4 w-4"/>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-3 space-y-2">
                    <h5 className="font-medium line-clamp-1">{product.product_name}</h5>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {product.vendor_name || 'Various'}
                      </span>
                      <span className="font-semibold text-primary">
                        ₹{product.price_inr.toLocaleString()}
                      </span>
                    </div>
                    
                    {product.quantity > 1 && (<Badge variant="outline" className="text-xs">
                        Qty: {product.quantity}
                      </Badge>)}
                    
                    {product.product_link && (<Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                        <a href={product.product_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2"/>
                          View Product
                        </a>
                      </Button>)}
                  </div>
                </Card>
              </motion.div>))}
          </div>
        </div>))}

      {products.length === 0 && (<div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50"/>
          <p>No products added yet</p>
        </div>)}
    </div>);
}

