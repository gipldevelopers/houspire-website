import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Video, RefreshCcw, ImageIcon, Phone, ChevronRight, X, Gift, } from 'lucide-react';
const UPGRADE_BENEFITS = [
    {
        icon: ImageIcon,
        title: '5 Additional Renders',
        description: 'Multiple angles & variations',
    },
    {
        icon: Video,
        title: '30-min Video Consultation',
        description: 'One-on-one with a designer',
    },
    {
        icon: RefreshCcw,
        title: '2 Free Revisions',
        description: 'Fine-tune your design',
    },
    {
        icon: Phone,
        title: 'Priority Support',
        description: 'Direct access via WhatsApp',
    },
];
export function DesignUpgradePrompt({ orderId, currentPackageName, currentPrice, customerName, }) {
    const navigate = useNavigate();
    const [dismissed, setDismissed] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const storageKey = `houspire_upsell_dismissed_${orderId}`;
    // Check if already dismissed
    useEffect(() => {
        const wasDismissed = localStorage.getItem(storageKey);
        if (wasDismissed) {
            setDismissed(true);
            setShowBadge(true);
        }
    }, [storageKey]);
    const handleDismiss = () => {
        localStorage.setItem(storageKey, 'true');
        setDismissed(true);
        setShowBadge(true);
    };
    const handleReopen = () => {
        localStorage.removeItem(storageKey);
        setDismissed(false);
        setShowBadge(false);
    };
    const handleUpgrade = () => {
        // Navigate to package selection with upgrade context
        navigate(`/select-package?upgrade=true&from_order=${orderId}&current_package=${currentPackageName}`);
    };
    // Only show for basic tier (₹499 or lowest)
    const isBasicTier = currentPrice <= 999 || currentPackageName?.toLowerCase().includes('trial');
    if (!isBasicTier)
        return null;
    // Upgrade price calculation
    const upgradePrice = 1999;
    const savings = 500; // Simulated savings
    // Show subtle badge when dismissed
    if (showBadge && dismissed) {
        return (<motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={handleReopen} className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all">
        <Gift className="h-4 w-4"/>
        <span className="text-sm font-medium">Upgrade Available</span>
      </motion.button>);
    }
    if (dismissed)
        return null;
    return (<AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-6">
        <Card className="relative overflow-hidden border-2 border-transparent bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-accent to-primary opacity-20" style={{ padding: '2px' }}>
            <div className="absolute inset-[2px] rounded-lg bg-background"/>
          </div>

          {/* Dismiss button */}
          <button onClick={handleDismiss} className="absolute top-4 right-4 p-1 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10">
            <X className="h-4 w-4 text-muted-foreground"/>
          </button>

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <Sparkles className="h-6 w-6 text-primary"/>
              </div>
              <div>
                <Badge className="mb-2 bg-gradient-to-r from-primary to-accent text-white border-0">
                  Special Upgrade Offer
                </Badge>
                <h3 className="text-xl font-heading font-bold text-foreground">
                  {customerName ? `${customerName}, unlock` : 'Unlock'} the Full Experience
                </h3>
                <p className="text-muted-foreground mt-1">
                  Upgrade to our Full Service package and get everything you need
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {UPGRADE_BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (<motion.div key={benefit.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="h-4 w-4 text-primary"/>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{benefit.title}</p>
                      <p className="text-xs text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>);
        })}
            </div>

            {/* Pricing & CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
              <div className="text-center sm:text-left">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{(upgradePrice + savings).toLocaleString('en-IN')}
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    ₹{upgradePrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-success font-medium">
                  Save ₹{savings.toLocaleString('en-IN')} today!
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleDismiss}>
                  Maybe Later
                </Button>
                <Button onClick={handleUpgrade} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Upgrade Now
                  <ChevronRight className="h-4 w-4 ml-1"/>
                </Button>
              </div>
            </div>

            {/* Trust indicator */}
            <p className="text-xs text-center text-muted-foreground mt-4">
              ✓ 100% satisfaction guarantee • ✓ Pay only the difference
            </p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>);
}
