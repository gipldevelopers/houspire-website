'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { 
  Target, 
  Heart, 
  Zap, 
  Shield,
  Palette,
  Users
} from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Radical Transparency',
    description: 'No hidden fees, no vendor kickbacks. What you see is exactly what you pay.',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: Heart,
    title: 'Customer Obsession',
    description: 'Every pixel, every recommendation is crafted with your satisfaction in mind.',
    color: 'bg-pink-500/10 text-pink-600',
  },
  {
    icon: Zap,
    title: 'Speed Without Sacrifice',
    description: '72 hours is our promise. Fast delivery, no compromise on quality.',
    color: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: Shield,
    title: 'Trust First',
    description: 'Money-back guarantee on every project. Your confidence is our priority.',
    color: 'bg-green-500/10 text-green-600',
  },
  {
    icon: Palette,
    title: 'Design Excellence',
    description: 'Beautiful spaces for every budget. Luxury aesthetics, accessible pricing.',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    icon: Users,
    title: 'Human Touch',
    description: 'Real designers, real conversations. Technology enhances, never replaces.',
    color: 'bg-accent/10 text-accent',
  },
];

export function ValuesSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            What We Stand For
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Six principles that guide every decision we make
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-background border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:border-accent/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
