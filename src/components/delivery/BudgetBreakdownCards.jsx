import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sofa, Palette, Lightbulb, Shirt, IndianRupee, ArrowLeftRight, } from 'lucide-react';
import { BudgetItemAlternatives } from './BudgetAlternatives';
const categoryIcons = {
    'Furniture': Sofa,
    'Decor': Palette,
    'Paint': Palette,
    'Lighting': Lightbulb,
    'Textiles': Shirt,
};
const categoryColors = {
    'Furniture': 'bg-blue-500',
    'Decor': 'bg-purple-500',
    'Paint': 'bg-amber-500',
    'Lighting': 'bg-yellow-500',
    'Textiles': 'bg-pink-500',
};
// Generate mock alternatives based on category and item price
function generateAlternatives(category, itemName, basePrice) {
    return [
        {
            tier: 'premium',
            name: `Premium ${itemName}`,
            price: Math.round(basePrice * 1.6),
            quality: 5,
            vendor: 'Premium Store',
            note: 'Top-tier quality, imported materials',
        },
        {
            tier: 'standard',
            name: itemName,
            price: basePrice,
            quality: 4,
            vendor: 'Recommended',
            note: 'Best value for quality',
        },
        {
            tier: 'budget',
            name: `Budget ${itemName}`,
            price: Math.round(basePrice * 0.5),
            quality: 3,
            vendor: 'Value Store',
            note: 'Affordable without compromising design',
        },
    ];
}
export function BudgetBreakdownCards({ breakdown, totalBudget }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [adjustedBudget, setAdjustedBudget] = useState(totalBudget);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };
    if (breakdown.length === 0) {
        return null;
    }
    const handleItemClick = (itemName, category, categoryAmount, itemCount) => {
        const estimatedItemPrice = Math.round(categoryAmount / Math.max(itemCount, 1));
        setSelectedItem({
            name: itemName,
            price: estimatedItemPrice,
            category,
        });
    };
    const handleAlternativeSelect = (alt) => {
        if (selectedItem) {
            const diff = alt.price - selectedItem.price;
            setAdjustedBudget(prev => prev + diff);
        }
    };
    return (<div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Budget Breakdown</h3>
        <div className="flex items-center gap-2 text-primary">
          <IndianRupee className="h-5 w-5"/>
          <span className="text-xl font-bold">
            {formatCurrency(adjustedBudget)}
          </span>
        </div>
      </div>

      {/* Total budget progress ring - simplified as a bar */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Estimated Budget</p>
              {adjustedBudget !== totalBudget && (<span className={`text-xs font-medium ${adjustedBudget < totalBudget ? 'text-green-600' : 'text-amber-600'}`}>
                  {adjustedBudget < totalBudget ? 'Saving' : '+'} {formatCurrency(Math.abs(adjustedBudget - totalBudget))}
                </span>)}
            </div>
            <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
              {breakdown.map((cat, index) => (<motion.div key={cat.category} initial={{ width: 0 }} animate={{ width: `${cat.percentage}%` }} transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }} className={categoryColors[cat.category] || 'bg-primary'}/>))}
            </div>
          </div>
        </div>
      </Card>

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {breakdown.map((category, index) => {
            const Icon = categoryIcons[category.category] || Palette;
            const colorClass = categoryColors[category.category] || 'bg-primary';
            return (<motion.div key={category.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}/10`}>
                      <Icon className={`h-5 w-5 ${colorClass.replace('bg-', 'text-')}`}/>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{category.category}</h4>
                      <p className="text-xs text-muted-foreground">
                        {category.percentage}% of budget
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground">
                    {formatCurrency(category.amount)}
                  </span>
                </div>

                {/* Progress bar */}
                <Progress value={category.percentage} className="h-2 mb-3"/>

                {/* Clickable Items */}
                <div className="space-y-1">
                  {category.items.slice(0, 3).map((item, i) => (<button key={i} onClick={() => handleItemClick(item, category.category, category.amount, category.items.length)} className="w-full text-left text-xs text-muted-foreground truncate hover:text-primary transition-colors flex items-center gap-1 group">
                      <span>•</span>
                      <span className="flex-1 truncate">{item}</span>
                      <ArrowLeftRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"/>
                    </button>))}
                  {category.items.length > 3 && (<p className="text-xs text-primary">
                      +{category.items.length - 3} more items
                    </p>)}
                </div>
              </Card>
            </motion.div>);
        })}
      </div>

      {/* Alternatives Modal */}
      {selectedItem && (<BudgetItemAlternatives open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} itemName={selectedItem.name} currentPrice={selectedItem.price} category={selectedItem.category} alternatives={generateAlternatives(selectedItem.category, selectedItem.name, selectedItem.price)} onSelect={handleAlternativeSelect}/>)}
    </div>);
}
