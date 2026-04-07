'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { dataGet } from '@/lib/frontend-data';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ExternalLink, 
  Check, 
  Package, 
  Truck,
  Loader2,
  Share2,
  Filter
} from 'lucide-react';

export function ProjectShoppingTab({ project }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [checkedItems, setCheckedItems] = useState({});
  const [budget] = useState(250000); // Example budget

  useEffect(() => {
    fetchProducts();
  }, [project.id]);

  const fetchProducts = async () => {
    try {
      // First get concepts for this project
      const concepts = await dataGet(`/concepts?projectId=${project.id}`);
      
      if (concepts && concepts.length > 0) {
        const conceptIds = concepts.map(c => c.id);
        const data = await dataGet(`/concept-products?conceptIds=${conceptIds.join(',')}`);
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = products.reduce((sum, p) => sum + (p.price_inr * (p.quantity || 1)), 0);
  const budgetPercent = (totalCost / budget) * 100;
  const isBudgetExceeded = budgetPercent > 100;

  const toggleItemStatus = (id) => {
    setCheckedItems(prev => {
      const current = prev[id] || 'pending';
      const next = 
        current === 'pending' ? 'ordered' : 
        current === 'ordered' ? 'delivered' : 'pending';
      return { ...prev, [id]: next };
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered': return <Package className="h-4 w-4 text-amber-500" />;
      case 'delivered': return <Truck className="h-4 w-4 text-success" />;
      default: return null;
    }
  };

  const shareViaWhatsApp = () => {
    const text = `Shopping List for My Room Design:\n\n${products.map(p => 
      `• ${p.product_name} - ₹${p.price_inr.toLocaleString()}${p.product_link ? `\n  ${p.product_link}` : ''}`
    ).join('\n\n')}\n\nTotal: ₹${totalCost.toLocaleString()}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">
          Shopping list pending
        </h4>
        <p className="text-muted-foreground">
          Will be available once concepts are finalized
        </p>
      </div>
    );
  }

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.product_category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const filteredProducts = statusFilter === 'all' 
    ? products 
    : products.filter(p => (checkedItems[p.id] || 'pending') === statusFilter);

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">Budget Status</p>
          <Badge className={`${isBudgetExceeded ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'} border-0`}>
            {isBudgetExceeded ? 'Over Budget' : 'Within Budget'}
          </Badge>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <Progress 
            value={Math.min(budgetPercent, 100)} 
            className={`h-2 flex-1 ${isBudgetExceeded ? '[&>div]:bg-destructive' : ''}`} 
          />
          <span className="text-sm font-medium text-foreground">
            {Math.round(budgetPercent)}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            ₹{totalCost.toLocaleString()} of ₹{budget.toLocaleString()}
          </span>
          <span className={isBudgetExceeded ? 'text-destructive' : 'text-success'}>
            {isBudgetExceeded 
              ? `₹${(totalCost - budget).toLocaleString()} over`
              : `₹${(budget - totalCost).toLocaleString()} remaining`
            }
          </span>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {['all', 'pending', 'ordered', 'delivered'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="h-8 text-xs capitalize"
            >
              {status === 'all' ? 'All Items' : status}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={shareViaWhatsApp}
          className="h-8"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share via WhatsApp
        </Button>
      </div>

      {/* Products List by Category */}
      {Object.entries(groupedProducts).map(([category, items]) => {
        const filteredItems = statusFilter === 'all' 
          ? items 
          : items.filter(p => (checkedItems[p.id] || 'pending') === statusFilter);
        
        if (filteredItems.length === 0) return null;

        return (
          <div key={category}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              {category} ({filteredItems.length})
            </h4>
            <div className="space-y-2">
              {filteredItems.map((product, idx) => {
                const status = checkedItems[product.id] || 'pending';
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                      status === 'delivered' 
                        ? 'bg-success/5 border-success/20' 
                        : status === 'ordered'
                          ? 'bg-amber-500/5 border-amber-500/20'
                          : 'bg-card border-border/50 hover:bg-muted/50'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleItemStatus(product.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        status === 'delivered' 
                          ? 'bg-success border-success text-white' 
                          : status === 'ordered'
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'border-muted-foreground/30 hover:border-muted-foreground'
                      }`}
                    >
                      {status !== 'pending' && <Check className="h-4 w-4" />}
                    </button>

                    {/* Product Image */}
                    {product.product_image_url && (
                      <img
                        src={product.product_image_url}
                        alt={product.product_name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${status === 'delivered' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {product.product_name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {product.vendor_name && <span>{product.vendor_name}</span>}
                        {product.quantity && product.quantity > 1 && (
                          <Badge variant="secondary" className="text-xs">x{product.quantity}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Status Icon */}
                    {getStatusIcon(status)}

                    {/* Price */}
                    <p className="font-semibold text-foreground">
                      ₹{(product.price_inr * (product.quantity || 1)).toLocaleString()}
                    </p>

                    {/* Link */}
                    {product.product_link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(product.product_link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Summary Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="text-sm text-muted-foreground">
          {products.filter(p => (checkedItems[p.id] || 'pending') === 'delivered').length} of {products.length} items delivered
        </div>
        <p className="text-lg font-semibold text-foreground">
          Total: ₹{totalCost.toLocaleString()}
        </p>
      </div>
    </div>
  );
}


