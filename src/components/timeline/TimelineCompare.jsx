import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ArrowLeftRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
// Industry averages by room and scope
const industryAverages = {
    bedroom: { refresh: 3, moderate: 4, complete: 6 },
    'living-room': { refresh: 4, moderate: 5, complete: 8 },
    kitchen: { refresh: 5, moderate: 7, complete: 10 },
    bathroom: { refresh: 4, moderate: 5, complete: 7 },
    'full-home': { refresh: 10, moderate: 14, complete: 20 },
    study: { refresh: 2, moderate: 4, complete: 5 },
    'dining-room': { refresh: 3, moderate: 4, complete: 6 },
    balcony: { refresh: 2, moderate: 3, complete: 4 },
    'kids-room': { refresh: 3, moderate: 4, complete: 6 },
};
export function TimelineCompare({ yourWeeks, roomType, scope }) {
    const [sliderPosition, setSliderPosition] = useState([50]);
    const industryWeeks = industryAverages[roomType]?.[scope] || yourWeeks;
    const difference = yourWeeks - industryWeeks;
    const percentDiff = Math.round((difference / industryWeeks) * 100);
    const maxWeeks = Math.max(yourWeeks, industryWeeks) + 2;
    const yourPercentage = (yourWeeks / maxWeeks) * 100;
    const industryPercentage = (industryWeeks / maxWeeks) * 100;
    return (<Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5"/>
            Industry Comparison
          </CardTitle>
          <Badge variant={difference === 0 ? 'secondary' : difference < 0 ? 'default' : 'outline'} className={difference < 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : ''}>
            {difference === 0 ? (<><Minus className="h-3 w-3 mr-1"/> On par</>) : difference < 0 ? (<><TrendingDown className="h-3 w-3 mr-1"/> {Math.abs(percentDiff)}% faster</>) : (<><TrendingUp className="h-3 w-3 mr-1"/> {percentDiff}% longer</>)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Comparison */}
        <div className="relative h-24 bg-muted rounded-xl overflow-hidden">
          {/* Slider divider */}
          <motion.div className="absolute top-0 bottom-0 w-1 bg-foreground z-20" style={{ left: `${sliderPosition[0]}%` }} animate={{ left: `${sliderPosition[0]}%` }}/>
          
          {/* Your Timeline (left side) */}
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition[0]}% 0 0)` }}>
            <div className="h-full flex flex-col justify-center px-4 bg-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Your Timeline</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">{yourWeeks}</span>
                <span className="text-sm text-muted-foreground pb-1">weeks</span>
              </div>
              <div className="mt-2 h-2 bg-primary/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${yourPercentage}%` }} transition={{ duration: 0.8 }}/>
              </div>
            </div>
          </div>

          {/* Industry Average (right side) */}
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderPosition[0]}%)` }}>
            <div className="h-full flex flex-col justify-center px-4 bg-muted">
              <p className="text-xs text-muted-foreground mb-1">Industry Average</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{industryWeeks}</span>
                <span className="text-sm text-muted-foreground pb-1">weeks</span>
              </div>
              <div className="mt-2 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-muted-foreground/50 rounded-full" initial={{ width: 0 }} animate={{ width: `${industryPercentage}%` }} transition={{ duration: 0.8 }}/>
              </div>
            </div>
          </div>

          {/* Drag handle */}
          <motion.div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-foreground rounded-full flex items-center justify-center z-30 cursor-ew-resize shadow-lg" style={{ left: `${sliderPosition[0]}%` }}>
            <ArrowLeftRight className="h-4 w-4 text-background"/>
          </motion.div>
        </div>

        {/* Slider control */}
        <Slider value={sliderPosition} onValueChange={setSliderPosition} min={10} max={90} step={1} className="mt-4"/>

        {/* Legend */}
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"/>
            <span className="text-muted-foreground">Your Timeline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted-foreground/50"/>
            <span className="text-muted-foreground">Industry Average</span>
          </div>
        </div>

        {/* Insight */}
        <div className="p-3 rounded-lg bg-muted/50 text-sm text-center text-muted-foreground">
          {difference === 0
            ? "Your timeline matches the industry average for this type of project."
            : difference < 0
                ? `Your timeline is ${Math.abs(difference)} week${Math.abs(difference) !== 1 ? 's' : ''} faster than typical projects of this scope.`
                : `Your timeline includes ${difference} extra week${difference !== 1 ? 's' : ''} compared to average, likely due to additional work or buffer time.`}
        </div>
      </CardContent>
    </Card>);
}
