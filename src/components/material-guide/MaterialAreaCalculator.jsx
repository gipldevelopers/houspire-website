import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, IndianRupee, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
export function MaterialAreaCalculator({ categoryName, tiers, unit }) {
    const [area, setArea] = useState(100);
    const [wastage, setWastage] = useState(10);
    const extractPriceRange = (priceRange) => {
        const match = priceRange.match(/₹([\d,]+)(?:-([\d,]+))?/);
        if (match) {
            const min = parseInt(match[1].replace(/,/g, ''));
            const max = match[2] ? parseInt(match[2].replace(/,/g, '')) : min;
            return { min, max };
        }
        return { min: 0, max: 0 };
    };
    const calculations = useMemo(() => {
        const areaWithWastage = area * (1 + wastage / 100);
        return tiers.map(tier => {
            const { min, max } = extractPriceRange(tier.priceRange);
            return {
                tier: tier.id,
                name: tier.name,
                minCost: Math.round(areaWithWastage * min),
                maxCost: Math.round(areaWithWastage * max),
                avgCost: Math.round(areaWithWastage * ((min + max) / 2)),
            };
        });
    }, [area, wastage, tiers]);
    const tierColors = {
        budget: 'bg-blue-100 text-blue-700 border-blue-200',
        standard: 'bg-green-100 text-green-700 border-green-200',
        premium: 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return (<Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary"/>
          Cost Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="area" className="text-sm">
              Area ({unit})
            </Label>
            <div className="flex items-center gap-3 mt-1.5">
              <Input id="area" type="number" value={area} onChange={(e) => setArea(Math.max(1, parseInt(e.target.value) || 1))} className="w-24" min={1}/>
              <Slider value={[area]} onValueChange={(v) => setArea(v[0])} min={10} max={1000} step={10} className="flex-1"/>
            </div>
          </div>

          <div>
            <Label className="text-sm">
              Wastage Allowance: {wastage}%
            </Label>
            <Slider value={[wastage]} onValueChange={(v) => setWastage(v[0])} min={5} max={20} step={1} className="mt-2"/>
          </div>
        </div>

        <div className="space-y-3">
          {calculations.map((calc, idx) => (<motion.div key={calc.tier} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`p-3 rounded-lg border ${tierColors[calc.tier]}`}>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-medium">
                  {calc.name}
                </Badge>
                <div className="flex items-center gap-1 font-semibold">
                  <IndianRupee className="h-4 w-4"/>
                  <span>{calc.minCost.toLocaleString('en-IN')}</span>
                  <ArrowRight className="h-3 w-3 mx-1"/>
                  <span>{calc.maxCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          *Estimates based on {area} {unit} + {wastage}% wastage. Actual costs may vary.
        </p>
      </CardContent>
    </Card>);
}
