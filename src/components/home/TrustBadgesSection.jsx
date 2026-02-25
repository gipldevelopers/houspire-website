'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Lock, Clock, CreditCard } from 'lucide-react';

export function TrustBadgesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const badges = [
    {
      icon: Clock,
      title: '72-Hour Delivery',
      subtitle: 'Or money back guaranteed',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Lock,
      title: '100% Secure',
      subtitle: 'Bank-level encryption',
      gradient: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Money-Back Guarantee',
      subtitle: 'Full refund if not delivered',
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-600'
    },
    {
      icon: CreditCard,
      title: 'Secured by Razorpay',
      subtitle: 'Safe & trusted payments',
      gradient: 'from-purple-500/20 to-purple-500/5',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <section ref={ref} className="py-12 md:py-16 bg-background border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, idx) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center group"
            >
              <div 
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105`}
              >
                <badge.icon className={`h-6 w-6 md:h-7 md:w-7 ${badge.iconColor}`} />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base">
                {badge.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                {badge.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
