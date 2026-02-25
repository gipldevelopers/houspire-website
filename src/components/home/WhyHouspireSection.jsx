'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Image, IndianRupee, ShoppingBag, Users, ArrowRight } from 'lucide-react';

const valueCards = [
  {
    icon: Image,
    title: 'Photorealistic Designs',
    description: 'See your rooms designed before spending anything',
    gradient: 'from-accent to-accent/80',
  },
  {
    icon: IndianRupee,
    title: 'Complete Budget Plan',
    description: 'Good / Better / Best pricing for every item',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: ShoppingBag,
    title: 'Shopping Lists',
    description: 'Direct links to buy everything you need',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Users,
    title: 'Verified Contractors',
    description: 'Trusted local pros to execute the design',
    gradient: 'from-purple-500 to-purple-600',
  },
];

export function WhyHouspireSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-14"
        >
          <p className="text-accent font-medium tracking-[0.1em] uppercase text-xs mb-4">
            Why Houspire
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground max-w-3xl mx-auto">
            Professional Design Reports, Not Expensive Consultations
          </h2>
        </motion.div>

        {/* 4 Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto mb-14">
          {valueCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-background border border-border/50 rounded-2xl p-6 text-center hover:border-accent/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How it works one-liner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-accent/[0.04] border border-border/50 rounded-2xl px-8 py-6 text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">How it works</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-foreground font-medium">
              <span>Take Quiz</span>
              <ArrowRight className="h-4 w-4 text-accent hidden sm:block" />
              <span className="text-accent sm:hidden">↓</span>
              <span>Choose Package</span>
              <ArrowRight className="h-4 w-4 text-accent hidden sm:block" />
              <span className="text-accent sm:hidden">↓</span>
              <span>Get Your Report in 72 Hours</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
