'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
export function PricingCard({ bundle, index }) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const handleSelect = () => {
        addItem({
            id: bundle.id,
            name: bundle.name,
            price: bundle.price,
            type: 'bundle'
        });
        router.push('/checkout');
    };
    return (<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }} className="h-full">
      <Card className={`relative h-full p-6 flex flex-col card-premium ${bundle.popular
            ? 'border-2 border-secondary ring-4 ring-secondary/10'
            : ''}`}>
        {/* Popular badge */}
        {bundle.popular && (<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <Badge className="gradient-secondary text-primary-foreground px-4 py-1.5 shadow-glow">
              <Star className="h-3 w-3 mr-1"/>
              Most Popular
            </Badge>
          </div>)}

        {/* Badge */}
        {bundle.badge && !bundle.popular && (<Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground">
            {bundle.badge}
          </Badge>)}

        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h3 className="text-xl font-heading font-bold text-foreground mb-2">
            {bundle.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>
          
          {/* Pricing */}
          <div className="space-y-2">
            {bundle.savings && (<div className="flex items-center justify-center gap-2 text-sm">
                <span className="line-through text-muted-foreground">
                  ₹{bundle.originalPrice.toLocaleString()}
                </span>
                <Badge variant="outline" className="text-success border-success bg-success/10">
                  Save ₹{bundle.savings.toLocaleString()}
                </Badge>
              </div>)}
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-foreground">
                ₹{bundle.price.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">One-time payment</p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 flex-1 mb-6">
          {bundle.features.map((feature, i) => (<motion.li key={i} className="flex items-start gap-3 text-sm" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} viewport={{ once: true }}>
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
                <Check className="h-3 w-3 text-success"/>
              </div>
              <span className="text-muted-foreground">{feature}</span>
            </motion.li>))}
        </ul>

        {/* CTA Button */}
        <Button onClick={handleSelect} className={`w-full ${bundle.popular
            ? 'btn-luxury'
            : 'hover:bg-primary hover:text-primary-foreground'}`} variant={bundle.popular ? 'default' : 'outline'} size="lg">
          {bundle.popular ? 'Get Started' : 'Choose Plan'}
        </Button>

        {/* Trust badge */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          ✓ Money-back guarantee • No hidden fees
        </p>
      </Card>
    </motion.div>);
}
