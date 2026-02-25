import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Check, ExternalLink, Calendar, Filter, Download, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
export function ShoppingChecklist({ projectId, products: initialProducts }) {
    const [products, setProducts] = useState(initialProducts.map(p => ({ ...p, purchased: p.purchased || false })));
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();
    const purchasedCount = products.filter(p => p.purchased).length;
    const totalCount = products.length;
    const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;
    const totalBudget = products.reduce((sum, p) => sum + (p.price_inr || 0), 0);
    const spentAmount = products
        .filter(p => p.purchased)
        .reduce((sum, p) => sum + (p.actual_price || p.price_inr || 0), 0);
    const filteredProducts = products
        .filter(p => {
        if (filter === 'purchased')
            return p.purchased;
        if (filter === 'pending')
            return !p.purchased;
        return true;
    })
        .filter(p => p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product_category.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleTogglePurchased = async (productId, purchased) => {
        setProducts(prev => prev.map(p => p.id === productId
            ? {
                ...p,
                purchased,
                purchase_date: purchased ? new Date().toISOString() : undefined
            }
            : p));
        toast({
            title: purchased ? 'Marked as purchased!' : 'Marked as pending',
            description: purchased
                ? 'Great progress on your project!'
                : 'Item moved back to shopping list',
        });
    };
    const handleUpdateActualPrice = (productId, actualPrice) => {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, actual_price: actualPrice } : p));
    };
    const exportToCSV = () => {
        const headers = ['Item', 'Category', 'Estimated Price', 'Actual Price', 'Vendor', 'Status', 'Purchase Date'];
        const rows = products.map(p => [
            p.product_name,
            p.product_category,
            p.price_inr,
            p.actual_price || '',
            p.vendor_name || '',
            p.purchased ? 'Purchased' : 'Pending',
            p.purchase_date ? new Date(p.purchase_date).toLocaleDateString() : ''
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shopping-list-${projectId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    return (<div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Shopping Progress</h3>
            <p className="text-sm text-muted-foreground">
              {purchasedCount} of {totalCount} items purchased
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-secondary">
              {Math.round(progress)}%
            </p>
            <p className="text-sm text-muted-foreground">Complete</p>
          </div>
        </div>
        <Progress value={progress} className="h-3"/>
      </Card>

      {/* Budget Tracking */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Estimated Budget</p>
          <p className="text-xl font-bold text-foreground">₹{(totalBudget / 1000).toFixed(1)}k</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Amount Spent</p>
          <p className="text-xl font-bold text-foreground">₹{(spentAmount / 1000).toFixed(1)}k</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className={`text-xl font-bold ${totalBudget - spentAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{((totalBudget - spentAmount) / 1000).toFixed(1)}k
          </p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2"/>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg z-50">
              <SelectItem value="all">All Items ({totalCount})</SelectItem>
              <SelectItem value="pending">Pending ({totalCount - purchasedCount})</SelectItem>
              <SelectItem value="purchased">Purchased ({purchasedCount})</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2"/>
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Shopping List */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (<Card key={product.id} className={`p-4 ${product.purchased ? 'bg-accent/30' : ''}`}>
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <Checkbox checked={product.purchased} onCheckedChange={(checked) => handleTogglePurchased(product.id, !!checked)} className="mt-1"/>

              {/* Product Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-medium ${product.purchased ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {product.product_name}
                    </h4>
                    <Badge variant="outline" className="mt-1">
                      {product.product_category}
                    </Badge>
                  </div>

                  {product.purchased && (<Badge className="bg-green-500 text-white">
                      <Check className="h-3 w-3 mr-1"/>
                      Purchased
                    </Badge>)}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>
                    <span className="font-medium">Estimated:</span> ₹{product.price_inr?.toLocaleString()}
                  </span>
                  {product.purchased && (<div className="flex items-center gap-2">
                      <span className="font-medium">Actual:</span>
                      <Input type="number" placeholder="Enter price" defaultValue={product.actual_price} onChange={(e) => handleUpdateActualPrice(product.id, parseFloat(e.target.value))} className="h-7 w-28"/>
                    </div>)}
                  {product.vendor_name && (<span>
                      <span className="font-medium">Vendor:</span> {product.vendor_name}
                    </span>)}
                </div>

                {product.purchase_date && (<div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3"/>
                    Purchased on {new Date(product.purchase_date).toLocaleDateString()}
                  </div>)}

                {/* Actions */}
                {product.product_link && (<div className="pt-2">
                    <a href={product.product_link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2"/>
                        Buy Online
                      </Button>
                    </a>
                  </div>)}
              </div>
            </div>
          </Card>))}

        {filteredProducts.length === 0 && (<Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No items found matching your filters
            </p>
          </Card>)}
      </div>

      {/* Completion Celebration */}
      {purchasedCount === totalCount && totalCount > 0 && (<Card className="p-8 text-center bg-secondary/10 border-secondary/20">
          <p className="text-4xl mb-4">🎉</p>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Shopping Complete!
          </h3>
          <p className="text-muted-foreground mb-4">
            You've purchased all items. Ready to start installation!
          </p>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            View Implementation Timeline
          </Button>
        </Card>)}
    </div>);
}
