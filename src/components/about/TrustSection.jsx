'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Shield, Award, Clock, CreditCard } from 'lucide-react';

const trustBadges = [
  {
    icon: Shield,
    title: 'Money-Back Guarantee',
    description: 'Not satisfied? Full refund within 7 days',
  },
  {
    icon: Clock,
    title: '72-Hour Delivery',
    description: 'Guaranteed or your money back',
  },
  {
    icon: Award,
    title: 'Vetted Designers',
    description: 'Every designer is hand-picked and verified',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Bank-grade encryption with Razorpay',
  },
];

const pressLogos = [
  { name: 'YourStory', logo: '/logos/yourstory.svg' },
  { name: 'Economic Times', logo: '/logos/et.svg' },
  { name: 'Inc42', logo: '/logos/inc42.svg' },
  { name: 'Entrepreneur', logo: '/logos/entrepreneur.svg' },
];

export function TrustSection() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <Container>
        {/* Trust Badges */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Featured In - Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8">
            As Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            {['YourStory', 'Economic Times', 'Inc42', 'Entrepreneur'].map((name) => (
              <div
                key={name}
                className="text-lg md:text-xl font-semibold text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
