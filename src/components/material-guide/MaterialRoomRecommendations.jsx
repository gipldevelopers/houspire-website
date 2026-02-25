import { motion } from 'framer-motion';
import { Lightbulb, Home, UtensilsCrossed, Bath, Briefcase, Bed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
const roomRecommendations = {
    flooring: [
        { room: 'Living Room', icon: <Home className="h-4 w-4"/>, recommendedTier: 'standard', reason: 'High traffic needs durability with good aesthetics', priority: ['Durability', 'Easy Clean'] },
        { room: 'Bedroom', icon: <Bed className="h-4 w-4"/>, recommendedTier: 'budget', reason: 'Low traffic, comfort over durability', priority: ['Comfort', 'Warmth'] },
        { room: 'Kitchen', icon: <UtensilsCrossed className="h-4 w-4"/>, recommendedTier: 'standard', reason: 'Needs water resistance and easy cleaning', priority: ['Water Resistant', 'Stain Proof'] },
        { room: 'Bathroom', icon: <Bath className="h-4 w-4"/>, recommendedTier: 'premium', reason: 'Water exposure demands best materials', priority: ['Water Proof', 'Anti-Slip'] },
    ],
    cabinets: [
        { room: 'Kitchen', icon: <UtensilsCrossed className="h-4 w-4"/>, recommendedTier: 'standard', reason: 'Daily use requires quality hardware and moisture resistance', priority: ['BWP Plywood', 'Soft-Close'] },
        { room: 'Bedroom', icon: <Bed className="h-4 w-4"/>, recommendedTier: 'budget', reason: 'Less moisture exposure, focus on storage', priority: ['Storage', 'Design'] },
        { room: 'Bathroom', icon: <Bath className="h-4 w-4"/>, recommendedTier: 'premium', reason: 'Humidity requires marine-grade materials', priority: ['Marine Ply', 'Waterproof'] },
    ],
    paint: [
        { room: 'Living Room', icon: <Home className="h-4 w-4"/>, recommendedTier: 'standard', reason: 'Visible space needs washable, lasting finish', priority: ['Washable', 'Low VOC'] },
        { room: 'Kitchen', icon: <UtensilsCrossed className="h-4 w-4"/>, recommendedTier: 'premium', reason: 'Oil and stain resistance needed', priority: ['Stain Guard', 'Anti-Bacterial'] },
        { room: 'Bedroom', icon: <Bed className="h-4 w-4"/>, recommendedTier: 'budget', reason: 'Protected space, focus on aesthetics', priority: ['Finish', 'Color Options'] },
    ],
    furniture: [
        { room: 'Living Room', icon: <Home className="h-4 w-4"/>, recommendedTier: 'premium', reason: 'Showcase pieces, long-term investment', priority: ['Solid Wood', 'Comfort'] },
        { room: 'Home Office', icon: <Briefcase className="h-4 w-4"/>, recommendedTier: 'standard', reason: 'Ergonomics and durability for daily use', priority: ['Ergonomic', 'Functional'] },
        { room: 'Bedroom', icon: <Bed className="h-4 w-4"/>, recommendedTier: 'standard', reason: 'Balance of comfort and longevity', priority: ['Quality', 'Design'] },
    ],
    countertops: [
        { room: 'Kitchen', icon: <UtensilsCrossed className="h-4 w-4"/>, recommendedTier: 'premium', reason: 'High-use surface needs durability and heat resistance', priority: ['Heat Resistant', 'Stain Proof'] },
        { room: 'Bathroom', icon: <Bath className="h-4 w-4"/>, recommendedTier: 'standard', reason: 'Less heat exposure, focus on water resistance', priority: ['Water Resistant', 'Easy Clean'] },
    ],
    lighting: [
        { room: 'Living Room', icon: <Home className="h-4 w-4"/>, recommendedTier: 'premium', reason: 'Statement pieces enhance ambiance', priority: ['Design', 'Dimming'] },
        { room: 'Kitchen', icon: <UtensilsCrossed className="h-4 w-4"/>, recommendedTier: 'standard', reason: 'Task lighting for functionality', priority: ['Brightness', 'Energy Efficient'] },
        { room: 'Bedroom', icon: <Bed className="h-4 w-4"/>, recommendedTier: 'budget', reason: 'Ambient lighting, simpler needs', priority: ['Warm Light', 'Dimmable'] },
    ],
};
const tierColors = {
    budget: 'bg-blue-100 text-blue-700',
    standard: 'bg-green-100 text-green-700',
    premium: 'bg-amber-100 text-amber-700',
};
export function MaterialRoomRecommendations({ categoryId }) {
    const recommendations = roomRecommendations[categoryId] || roomRecommendations['flooring'];
    return (<Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-amber-500"/>
          Room Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, idx) => (<motion.div key={rec.room} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {rec.icon}
                <span className="font-medium">{rec.room}</span>
              </div>
              <Badge className={tierColors[rec.recommendedTier]}>
                {rec.recommendedTier.charAt(0).toUpperCase() + rec.recommendedTier.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
            <div className="flex flex-wrap gap-1">
              {rec.priority.map(p => (<Badge key={p} variant="outline" className="text-xs">
                  {p}
                </Badge>))}
            </div>
          </motion.div>))}
      </CardContent>
    </Card>);
}
