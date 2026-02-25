import { motion } from 'framer-motion';
import { PartyPopper, Users, Package, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/ui/tooltip';
const contractorOptions = [
    { id: 'limited', label: 'Limited', impact: '+25%', multiplier: 1.25 },
    { id: 'normal', label: 'Normal', impact: '+0%', multiplier: 1.0 },
    { id: 'available', label: 'Available', impact: '-10%', multiplier: 0.9 },
];
const materialOptions = [
    { id: 'local', label: 'Local Only', impact: '-10%', multiplier: 0.9 },
    { id: 'mixed', label: 'Mixed', impact: '+0%', multiplier: 1.0 },
    { id: 'imported', label: 'Imported', impact: '+30%', multiplier: 1.3 },
];
export function TimelineMultipliers({ multipliers, onMultipliersChange, baseWeeks }) {
    const calculateImpact = () => {
        let factor = 1;
        if (multipliers.festiveSeason)
            factor *= 1.25;
        const contractor = contractorOptions.find(c => c.id === multipliers.contractorAvailability);
        if (contractor)
            factor *= contractor.multiplier;
        const material = materialOptions.find(m => m.id === multipliers.materialSourcing);
        if (material)
            factor *= material.multiplier;
        return {
            factor,
            adjustedWeeks: Math.ceil(baseWeeks * factor),
            difference: Math.ceil(baseWeeks * factor) - baseWeeks,
        };
    };
    const impact = calculateImpact();
    return (<Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5"/>
            Custom Adjustments
          </CardTitle>
          {impact.difference !== 0 && (<Badge variant={impact.difference > 0 ? 'secondary' : 'default'}>
              {impact.difference > 0 ? '+' : ''}{impact.difference} week{Math.abs(impact.difference) !== 1 ? 's' : ''}
            </Badge>)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Festive Season Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950">
              <PartyPopper className="h-5 w-5 text-amber-600"/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="festive" className="font-medium cursor-pointer">
                  Festive Season
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground"/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Diwali, Christmas, New Year periods</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">Add +25% for holidays</p>
            </div>
          </div>
          <Switch id="festive" checked={multipliers.festiveSeason} onCheckedChange={(checked) => onMultipliersChange({ ...multipliers, festiveSeason: checked })}/>
        </motion.div>

        {/* Contractor Availability */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground"/>
            <Label className="font-medium">Contractor Availability</Label>
          </div>
          <RadioGroup value={multipliers.contractorAvailability} onValueChange={(value) => onMultipliersChange({ ...multipliers, contractorAvailability: value })} className="grid grid-cols-3 gap-2">
            {contractorOptions.map((option) => (<Label key={option.id} htmlFor={`contractor-${option.id}`} className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${multipliers.contractorAvailability === option.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'}`}>
                <RadioGroupItem value={option.id} id={`contractor-${option.id}`} className="sr-only"/>
                <span className="text-sm font-medium">{option.label}</span>
                <span className={`text-xs ${option.multiplier < 1 ? 'text-emerald-600' :
                option.multiplier > 1 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  {option.impact}
                </span>
              </Label>))}
          </RadioGroup>
        </motion.div>

        {/* Material Sourcing */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground"/>
            <Label className="font-medium">Material Sourcing</Label>
          </div>
          <RadioGroup value={multipliers.materialSourcing} onValueChange={(value) => onMultipliersChange({ ...multipliers, materialSourcing: value })} className="grid grid-cols-3 gap-2">
            {materialOptions.map((option) => (<Label key={option.id} htmlFor={`material-${option.id}`} className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${multipliers.materialSourcing === option.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'}`}>
                <RadioGroupItem value={option.id} id={`material-${option.id}`} className="sr-only"/>
                <span className="text-sm font-medium">{option.label}</span>
                <span className={`text-xs ${option.multiplier < 1 ? 'text-emerald-600' :
                option.multiplier > 1 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  {option.impact}
                </span>
              </Label>))}
          </RadioGroup>
        </motion.div>

        {/* Summary */}
        {impact.difference !== 0 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-muted text-sm text-center">
            Adjustments add <strong>{impact.difference > 0 ? '+' : ''}{impact.difference} week{Math.abs(impact.difference) !== 1 ? 's' : ''}</strong> to your base timeline
          </motion.div>)}
      </CardContent>
    </Card>);
}
