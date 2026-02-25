'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Image, 
  Calculator, 
  ShoppingBag, 
  Users, 
  ClipboardList,
  ArrowRight,
  Check
} from 'lucide-react';

const deliverables = [
  {
    icon: Image,
    title: 'Photorealistic Room Designs',
    description: 'Multiple angles of every room in your chosen style — real designs created by Houspire, not stock images.',
    gradient: 'from-accent to-accent/80'
  },
  {
    icon: Calculator,
    title: 'Room-by-Room Cost Breakdown',
    description: 'Item-by-item cost breakdown with three budget tiers (Good / Better / Best) so you can make informed choices.',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    icon: ShoppingBag,
    title: 'Shopping Guide',
    description: 'Direct links to purchase every item, with alternatives at different price points. No guesswork.',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: Users,
    title: 'Verified Contractors & Suppliers',
    description: 'City-specific contractors who can execute this exact design. Ratings and past work included.',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    icon: ClipboardList,
    title: 'Execution Roadmap',
    description: 'What to do first, what to order when, and common mistakes to avoid — a step-by-step guide.',
    gradient: 'from-amber-500 to-amber-600'
  }
];

const highlights = [
  'Personalized to your home & budget',
  'Used to brief any contractor',
  'Yours to keep — no lock-in'
];

export function WhatYouGetSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const router = useRouter();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-accent/[0.02]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-8"
        >
          <p className="text-accent font-medium tracking-[0.1em] uppercase text-xs mb-4">
            Your Home Design Report
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            Everything You Need to Execute
          </h2>
          <p className="mt-4 text-xl text-foreground/60 max-w-2xl mx-auto">
            This isn't "just designs". It's a professional home design report.
          </p>
        </motion.div>

        {/* Highlight bullets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-16"
        >
          {highlights.map((h) => (
            <div key={h} className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-accent" />
              </div>
              {h}
            </div>
          ))}
        </motion.div>

        {/* Deliverable blocks */}
        <div className="max-w-4xl mx-auto space-y-6">
          {deliverables.map((d, idx) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * idx, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-start gap-6 bg-background border border-border/50 rounded-2xl p-6 md:p-8 hover:border-accent/20 hover:shadow-lg transition-all duration-500"
            >
              <div className={`w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${d.gradient} flex items-center justify-center shadow-lg`}>
                <d.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
                  {d.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {d.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12 text-lg text-foreground/60 font-medium"
        >
          Traditional designers charge ₹50,000–₹2,00,000+ for this phase alone.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-8"
        >
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/report-preview')}
            className="group border-2"
          >
            Download a Sample Report
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
