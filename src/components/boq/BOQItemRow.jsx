import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
export function BOQItemRow({ item, formatCurrency, onQuantityChange, editable = false }) {
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [quantity, setQuantity] = useState(item.quantity);
    const handleQuantityChange = (delta) => {
        const newQty = Math.max(0, quantity + delta);
        setQuantity(newQty);
        onQuantityChange?.(item.id, newQty);
    };
    const currentAmount = quantity * item.rate;
    return (<>
      <tr className="hover:bg-muted/30 transition-colors group">
        <td className="px-4 py-3">
          <div className="flex items-start gap-3">
            {item.imageUrl && (<img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover hidden sm:block"/>)}
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              {item.specification && (<p className="text-xs text-muted-foreground mt-0.5">
                  {item.specification}
                </p>)}
              {item.alternatives && item.alternatives.length > 0 && (<button onClick={() => setShowAlternatives(!showAlternatives)} className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3"/>
                  {showAlternatives ? 'Hide' : 'Show'} alternatives
                  {showAlternatives ? (<ChevronUp className="h-3 w-3"/>) : (<ChevronDown className="h-3 w-3"/>)}
                </button>)}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">
          {item.unit}
        </td>
        <td className="px-4 py-3 text-center hidden sm:table-cell">
          {editable ? (<div className="flex items-center justify-center gap-1">
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(-1)}>
                <Minus className="h-3 w-3"/>
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(1)}>
                <Plus className="h-3 w-3"/>
              </Button>
            </div>) : (item.quantity)}
        </td>
        <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
          {formatCurrency(item.rate)}
        </td>
        <td className="px-4 py-3 text-right font-medium">
          <motion.span key={currentAmount} initial={{ scale: 1.1, color: 'hsl(var(--primary))' }} animate={{ scale: 1, color: 'inherit' }} transition={{ duration: 0.3 }}>
            {formatCurrency(currentAmount)}
          </motion.span>
        </td>
      </tr>
      
      {/* Alternatives Row */}
      <AnimatePresence>
        {showAlternatives && item.alternatives && (<motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <td colSpan={5} className="px-4 py-3 bg-muted/30">
              <div className="pl-4 border-l-2 border-primary/20 space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Alternative options:
                </p>
                {item.alternatives.map((alt, i) => (<div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{alt.name}</span>
                      <Badge variant={alt.tier === 'budget' ? 'secondary' : 'default'} className="text-xs">
                        {alt.tier === 'budget' ? 'Budget' : 'Premium'}
                      </Badge>
                    </div>
                    <span className={cn('font-medium', alt.tier === 'budget' ? 'text-green-600' : 'text-amber-600')}>
                      {formatCurrency(alt.rate * quantity)}
                    </span>
                  </div>))}
              </div>
            </td>
          </motion.tr>)}
      </AnimatePresence>
    </>);
}
