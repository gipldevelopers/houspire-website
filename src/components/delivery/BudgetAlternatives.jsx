import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Star, TrendingDown, TrendingUp, Sparkles, } from 'lucide-react';
const tierConfig = {
    premium: {
        label: 'Premium',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Sparkles,
    },
    standard: {
        label: 'Mid-Range',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: Star,
    },
    budget: {
        label: 'Budget',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: TrendingDown,
    },
};
export function BudgetItemAlternatives({ open, onOpenChange, itemName, currentPrice, category, alternatives, onSelect, }) {
    const [selectedTier, setSelectedTier] = useState(null);
    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg [&>button]:bg-background/80 [&>button]:border [&>button]:backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">Compare Alternatives</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {itemName} • {category}
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {alternatives.map((alt, idx) => {
            const config = tierConfig[alt.tier];
            const Icon = config.icon;
            const diff = alt.price - currentPrice;
            const isSelected = selectedTier === alt.tier;
            return (<motion.div key={alt.tier} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className={`p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border/50'}`} onClick={() => {
                    setSelectedTier(alt.tier);
                    onSelect(alt);
                }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-foreground"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${config.color} border text-xs`}>
                            {config.label}
                          </Badge>
                          {/* Quality stars */}
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-3 w-3 ${i < alt.quality
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-muted-foreground/30'}`}/>))}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {alt.name}
                        </p>
                        {alt.vendor && (<p className="text-xs text-muted-foreground">{alt.vendor}</p>)}
                        {alt.note && (<p className="text-xs text-muted-foreground mt-1 italic">{alt.note}</p>)}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground">{formatCurrency(alt.price)}</p>
                      {diff !== 0 && (<div className={`flex items-center gap-1 text-xs mt-0.5 ${diff < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                          {diff < 0 ? (<TrendingDown className="h-3 w-3"/>) : (<TrendingUp className="h-3 w-3"/>)}
                          <span>
                            {diff < 0 ? 'Save' : '+'} {formatCurrency(Math.abs(diff))}
                          </span>
                        </div>)}
                    </div>
                  </div>
                </Card>
              </motion.div>);
        })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Tap any option to update your budget estimate
        </p>
      </DialogContent>
    </Dialog>);
}
