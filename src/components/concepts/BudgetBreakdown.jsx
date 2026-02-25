import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, TrendingUp, TrendingDown, Minus } from 'lucide-react';
export function BudgetBreakdown({ products, targetBudget }) {
    // Calculate totals by category
    const categoryTotals = products.reduce((acc, product) => {
        const category = product.product_category || 'Other';
        if (!acc[category])
            acc[category] = 0;
        acc[category] += product.price_inr * product.quantity;
        return acc;
    }, {});
    const totalBudget = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    const budgetDifference = totalBudget - targetBudget;
    const budgetPercentage = Math.min((totalBudget / targetBudget) * 100, 100);
    // Category colors
    const categoryColors = {
        'Furniture': 'bg-blue-500',
        'Lighting': 'bg-yellow-500',
        'Decor': 'bg-pink-500',
        'Textiles': 'bg-purple-500',
        'Storage': 'bg-green-500',
        'Art': 'bg-orange-500',
        'Plants': 'bg-emerald-500',
        'Other': 'bg-gray-500',
    };
    return (<div className="space-y-6">
      {/* Overall Budget */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Total Budget</h3>
          <div className="flex items-center gap-2">
            {budgetDifference > 0 ? (<Badge variant="destructive" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3"/>
                ₹{Math.abs(budgetDifference / 1000).toFixed(0)}k over
              </Badge>) : budgetDifference < 0 ? (<Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700">
                <TrendingDown className="h-3 w-3"/>
                ₹{Math.abs(budgetDifference / 1000).toFixed(0)}k under
              </Badge>) : (<Badge variant="secondary" className="flex items-center gap-1">
                <Minus className="h-3 w-3"/>
                On budget
              </Badge>)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ₹{(totalBudget / 1000).toFixed(0)}k of ₹{(targetBudget / 1000).toFixed(0)}k
            </span>
            <span className="font-medium">{budgetPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={budgetPercentage} className={budgetDifference > 0 ? '[&>div]:bg-destructive' : ''}/>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Target Budget</p>
            <p className="text-2xl font-bold flex items-center justify-center">
              <IndianRupee className="h-5 w-5"/>
              {(targetBudget / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
            <p className="text-2xl font-bold flex items-center justify-center">
              <IndianRupee className="h-5 w-5"/>
              {(totalBudget / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Breakdown by Category</h3>
        
        <div className="space-y-4">
          {Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => {
            const percentage = (amount / totalBudget) * 100;
            const colorClass = categoryColors[category] || categoryColors['Other'];
            return (<div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colorClass}`}/>
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <span className="text-sm">
                      ₹{(amount / 1000).toFixed(0)}k ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${percentage}%` }}/>
                  </div>
                </div>);
        })}
        </div>
      </Card>

      {/* Savings Tips */}
      {budgetDifference > 0 && (<Card className="p-6 border-yellow-200 bg-yellow-50">
          <h3 className="text-lg font-semibold mb-2 text-yellow-800">💡 Budget Tips</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• Consider marking expensive items with 👎 for alternatives</li>
            <li>• Phased implementation can spread costs over time</li>
            <li>• Some items can be sourced locally for better prices</li>
            <li>• Ask for execution tools to get vendor negotiation tips</li>
          </ul>
        </Card>)}
    </div>);
}
