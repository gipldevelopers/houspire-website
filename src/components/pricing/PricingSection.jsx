'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PackageBuilderModal } from './PackageBuilderModal';
import { useRouter } from 'next/navigation';
export function PricingSection() {
    const [builderOpen, setBuilderOpen] = useState(false);
    const router = useRouter();
    const features = [
        'Professional 3D renders (multiple angles)',
        'Complete shopping list with vendor details',
        'Detailed budget breakdown by category',
        'Designer matched to your style',
        '72-hour delivery guarantee',
        'One round of revisions included',
        'Color palette & material specifications',
        'Implementation timeline'
    ];
    return (<section id="pricing" className="py-20 lg:py-28 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            <Wand2 className="w-3 h-3 mr-1"/>
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            One Price. Everything Included.
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            No hidden fees, no surprises. Professional design starting at ₹499.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="max-w-xl mx-auto">
          <Card className="relative p-8 bg-white border-2 border-purple-200 shadow-xl rounded-2xl overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 right-0">
              <Badge className="rounded-none rounded-bl-lg bg-purple-600 text-white border-0 px-4 py-1">
                Most Popular
              </Badge>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Complete Design Package
              </h3>
              <div className="text-5xl font-bold text-neutral-900 mb-2">
                ₹499
              </div>
              <p className="text-neutral-500">One-time payment, no subscription</p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, idx) => (<div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-green-600"/>
                  </div>
                  <span className="text-neutral-700">{feature}</span>
                </div>))}
            </div>

            <Button className="w-full h-14 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl" onClick={() => router.push('/style-quiz')}>
              Get Started Now
            </Button>

            <p className="text-center text-sm text-neutral-500 mt-4">
              ✓ Money-back guarantee • No hidden fees
            </p>
          </Card>
        </motion.div>

        {/* Custom Builder CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-center mt-12">
          <p className="text-neutral-600 mb-4">
            Need something more customized?
          </p>
          <Button variant="outline" size="lg" onClick={() => setBuilderOpen(true)} className="border-2 border-neutral-200 hover:border-purple-300 hover:bg-purple-50">
            <Wand2 className="mr-2 h-4 w-4 text-purple-600"/>
            Build Your Custom Package
          </Button>
        </motion.div>
      </div>

      {/* Custom Package Builder Modal */}
      <PackageBuilderModal open={builderOpen} onOpenChange={setBuilderOpen}/>
    </section>);
}
