import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Check, X, Star, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export function MaterialSideBySide({ tiers, isOpen, onClose }) {
    const [leftTier, setLeftTier] = useState('budget');
    const [rightTier, setRightTier] = useState('premium');
    if (!isOpen)
        return null;
    const left = tiers.find(t => t.id === leftTier) || tiers[0];
    const right = tiers.find(t => t.id === rightTier) || tiers[2];
    const renderStars = (count) => (<div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (<Star key={i} className={`h-4 w-4 ${i <= count ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}/>))}
    </div>);
    const tierColors = {
        budget: 'bg-blue-500',
        standard: 'bg-green-500',
        premium: 'bg-amber-500',
    };
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ArrowLeftRight className="h-5 w-5 text-primary"/>
              Side-by-Side Comparison
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4"/>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Selection */}
            <div>
              <Select value={leftTier} onValueChange={setLeftTier}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select tier"/>
                </SelectTrigger>
                <SelectContent>
                  {tiers.map(tier => (<SelectItem key={tier.id} value={tier.id}>
                      {tier.name}
                    </SelectItem>))}
                </SelectContent>
              </Select>

              <div className={`h-1 ${tierColors[left.id]} rounded-t-lg`}/>
              <div className="border border-t-0 rounded-b-lg p-4 space-y-4">
                <div className="text-center">
                  <Badge className={`${tierColors[left.id]} text-white`}>{left.name}</Badge>
                  <div className="flex items-center justify-center gap-1 mt-2 font-semibold">
                    <IndianRupee className="h-4 w-4"/>
                    {left.priceRange}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Durability</span>
                    {renderStars(left.durability)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Aesthetics</span>
                    {renderStars(left.aesthetics)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Maintenance</span>
                    <Badge variant="outline">{left.maintenance}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Warranty</span>
                    <span className="text-sm font-medium">{left.warranty}</span>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  {left.pros.slice(0, 3).map((pro, idx) => (<div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0"/>
                      {pro}
                    </div>))}
                </div>
              </div>
            </div>

            {/* Right Selection */}
            <div>
              <Select value={rightTier} onValueChange={setRightTier}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select tier"/>
                </SelectTrigger>
                <SelectContent>
                  {tiers.map(tier => (<SelectItem key={tier.id} value={tier.id}>
                      {tier.name}
                    </SelectItem>))}
                </SelectContent>
              </Select>

              <div className={`h-1 ${tierColors[right.id]} rounded-t-lg`}/>
              <div className="border border-t-0 rounded-b-lg p-4 space-y-4">
                <div className="text-center">
                  <Badge className={`${tierColors[right.id]} text-white`}>{right.name}</Badge>
                  <div className="flex items-center justify-center gap-1 mt-2 font-semibold">
                    <IndianRupee className="h-4 w-4"/>
                    {right.priceRange}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Durability</span>
                    {renderStars(right.durability)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Aesthetics</span>
                    {renderStars(right.aesthetics)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Maintenance</span>
                    <Badge variant="outline">{right.maintenance}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Warranty</span>
                    <span className="text-sm font-medium">{right.warranty}</span>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  {right.pros.slice(0, 3).map((pro, idx) => (<div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0"/>
                      {pro}
                    </div>))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>);
}
