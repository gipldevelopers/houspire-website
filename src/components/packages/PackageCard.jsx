import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Clock, MessageCircle, Users } from 'lucide-react';
export function PackageCard({ package: pkg, index, selected, onSelect, vertical = false, }) {
    const getBadgeColor = () => {
        switch (pkg.badge_color) {
            case 'blue': return 'bg-primary';
            case 'green': return 'bg-green-600';
            case 'gold': return 'bg-yellow-600';
            default: return 'bg-purple-600';
        }
    };
    const features = pkg.features || {};
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="h-full">
      <Card onClick={() => onSelect(pkg)} className={`group cursor-pointer rounded-2xl transition-all h-full relative overflow-hidden ${selected
            ? 'border-2 border-primary shadow-xl ring-2 ring-primary/20'
            : pkg.is_popular
                ? 'border-2 border-purple-300 hover:border-purple-400 hover:shadow-lg'
                : 'border hover:border-primary/50 hover:shadow-lg'}`}>
        {/* Badge */}
        {(pkg.is_popular || pkg.badge_text) && (<div className={`absolute top-0 right-0 ${getBadgeColor()} text-white text-xs font-bold px-3 py-1 rounded-bl-lg`}>
            {pkg.badge_text || 'MOST POPULAR'}
          </div>)}

        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {pkg.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {pkg.tagline}
            </p>
            
            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                ₹{pkg.price.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {pkg.room_count_display}
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-muted rounded">
                <Sparkles className="h-3.5 w-3.5 text-primary"/>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revisions</p>
                <p className="text-sm font-medium">{pkg.revisions_display}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-muted rounded">
                <Clock className="h-3.5 w-3.5 text-primary"/>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Delivery</p>
                <p className="text-sm font-medium">{features.delivery || '72hrs'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-muted rounded">
                <MessageCircle className="h-3.5 w-3.5 text-primary"/>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Support</p>
                <p className="text-sm font-medium">{pkg.whatsapp_response_time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-muted rounded">
                <Users className="h-3.5 w-3.5 text-primary"/>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vendors</p>
                <p className="text-sm font-medium">{pkg.vendor_display}</p>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-2 mb-6 flex-1">
            {pkg.deliverables?.slice(0, vertical ? 4 : 6).map((item, idx) => (<div key={idx} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5"/>
                <span className="text-muted-foreground">{item}</span>
              </div>))}
            {pkg.deliverables && pkg.deliverables.length > (vertical ? 4 : 6) && (<p className="text-xs text-muted-foreground pl-6">
                +{pkg.deliverables.length - (vertical ? 4 : 6)} more features
              </p>)}
          </div>

          {/* CTA */}
          <Button className={`w-full ${selected ? 'bg-primary' : ''}`} variant={selected ? 'default' : 'outline'}>
            {selected ? (<>
                <Check className="h-4 w-4 mr-2"/>
                Selected
              </>) : ('Select Package')}
          </Button>

          {/* Money-back guarantee for trials */}
          {pkg.is_trial && features.money_back && (<p className="text-xs text-center text-green-600 mt-3 font-medium">
              ✓ 100% Money-Back Guarantee
            </p>)}
        </div>
      </Card>
    </motion.div>);
}
