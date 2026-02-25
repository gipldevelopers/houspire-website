import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Image, Palette, ShoppingBag, Users, CalendarDays, ArrowRight, Sparkles, PartyPopper, } from 'lucide-react';
const deliverables = [
    {
        icon: Image,
        title: 'Photorealistic Room Designs',
        description: 'Multiple angle views of your transformed space',
        delay: 0.3,
    },
    {
        icon: Palette,
        title: 'Custom Color Palette',
        description: 'With paint brand shade names & hex codes',
        delay: 0.5,
    },
    {
        icon: ShoppingBag,
        title: 'Itemized Shopping List',
        description: 'Every product with price & purchase links',
        delay: 0.7,
    },
    {
        icon: Users,
        title: 'Verified Contractor Contacts',
        description: 'City-specific vendor recommendations',
        delay: 0.9,
    },
    {
        icon: CalendarDays,
        title: 'Week-by-Week Execution Plan',
        description: 'Step-by-step roadmap to bring it to life',
        delay: 1.1,
    },
];
export function ValueReceiptModal({ open, onOpenChange, packageName, finalPrice, orderNumber, orderId, onGoToDashboard, }) {
    const [showDeliverables, setShowDeliverables] = useState(false);
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => setShowDeliverables(true), 600);
            return () => clearTimeout(timer);
        }
        else {
            setShowDeliverables(false);
        }
    }, [open]);
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none [&>button]:bg-background/80 [&>button]:border [&>button]:backdrop-blur-sm">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20 }} className="bg-card rounded-2xl overflow-hidden border shadow-2xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background p-6 text-center relative overflow-hidden">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="h-8 w-8 text-primary"/>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-xl font-bold text-foreground mb-1">
              You're all set!
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-sm text-muted-foreground">
              Order #{orderNumber}
            </motion.p>
          </div>

          {/* Package info */}
          <div className="px-6 py-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="font-semibold text-foreground">{packageName}</p>
              </div>
              <Badge className="bg-primary/10 text-primary border-0 font-semibold text-base px-3 py-1">
                ₹{finalPrice.toLocaleString('en-IN')}
              </Badge>
            </div>
          </div>

          {/* What you'll receive */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary"/>
              <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                What you'll receive
              </p>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {showDeliverables &&
            deliverables.map((item, idx) => (<motion.div key={item.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15 }} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-primary/5">
                        <item.icon className="h-4 w-4 text-primary"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"/>
                    </motion.div>))}
              </AnimatePresence>
            </div>
          </div>

          {/* Timeline info */}
          <div className="px-6 pb-3">
            <div className="p-3 rounded-xl bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground">
                Estimated delivery within <span className="font-semibold text-foreground">72 hours</span>
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            <Button onClick={onGoToDashboard} className="w-full h-12 text-base font-semibold">
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>);
}
