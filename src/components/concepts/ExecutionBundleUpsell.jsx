import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Gift, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
export function ExecutionBundleUpsell({ projectId }) {
    const navigate = useNavigate();
    const [selectedBundle, setSelectedBundle] = useState(null);
    const bundles = [
        {
            id: 'diy',
            name: 'DIY Executor',
            price: 299,
            originalPrice: 499,
            popular: false,
            features: [
                'Complete shopping list with links',
                'Room-wise budget breakdown',
                'Product alternatives (3 per item)',
                'Basic execution timeline',
            ],
        },
        {
            id: 'ready',
            name: 'Ready to Build',
            price: 599,
            originalPrice: 999,
            popular: true,
            features: [
                'Everything in DIY Executor',
                'Vendor contact directory',
                'Negotiation scripts',
                'Material specifications',
                'Contractor guidelines',
                'Installation sequence',
            ],
        },
        {
            id: 'premium',
            name: 'Premium Experience',
            price: 999,
            originalPrice: 1999,
            popular: false,
            features: [
                'Everything in Ready to Build',
                '30-min video call with designer',
                'Priority WhatsApp support (7 days)',
                'Implementation supervision tips',
                'Quality check guidelines',
                'Vendor rate cards',
            ],
        },
    ];
    const handlePurchase = () => {
        if (selectedBundle) {
            navigate('/checkout', {
                state: {
                    type: 'addon',
                    bundleId: selectedBundle,
                    projectId
                }
            });
        }
    };
    return (<Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="h-5 w-5 text-primary"/>
        <h3 className="font-semibold">Get Execution Tools</h3>
        <Badge className="bg-green-500">Save up to 50%</Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Turn your design into reality with our execution bundles. Available only now!
      </p>

      <div className="space-y-3">
        {bundles.map((bundle) => (<motion.div key={bundle.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <div onClick={() => setSelectedBundle(bundle.id)} className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedBundle === bundle.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'}`}>
              {bundle.popular && (<Badge className="absolute -top-2 right-2 bg-secondary text-secondary-foreground">
                  Most Popular
                </Badge>)}

              <div className="flex items-start gap-3">
                <Checkbox checked={selectedBundle === bundle.id} className="mt-1"/>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{bundle.name}</h4>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">
                        ₹{bundle.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ₹{bundle.originalPrice}
                      </span>
                    </div>
                  </div>
                  
                  <ul className="space-y-1">
                    {bundle.features.slice(0, 3).map((feature, index) => (<li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0"/>
                        {feature}
                      </li>))}
                    {bundle.features.length > 3 && (<li className="text-sm text-primary">
                        +{bundle.features.length - 3} more features
                      </li>)}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>))}
      </div>

      <Button onClick={handlePurchase} disabled={!selectedBundle} className="w-full mt-4" size="lg">
        <ShoppingCart className="h-4 w-4 mr-2"/>
        {selectedBundle
            ? `Add ${bundles.find(b => b.id === selectedBundle)?.name} - ₹${bundles.find(b => b.id === selectedBundle)?.price}`
            : 'Select a Bundle'}
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-3">
        ⚡ This offer is only available before you proceed to the next phase
      </p>
    </Card>);
}
