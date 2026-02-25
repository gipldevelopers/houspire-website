'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Palette, Zap } from 'lucide-react';

const approachItems = [
  {
    icon: Palette,
    title: 'Expert Creative Direction',
    description: 'Experienced design professionals guide every project — choosing styles, curating materials, and ensuring every design feels personal to your space.',
  },
  {
    icon: Zap,
    title: 'Advanced Design Technology',
    description: 'We use cutting-edge visualization technology to create photorealistic room designs in hours, not weeks. This is how we deliver professional quality at a fraction of traditional costs.',
  },
  {
    icon: Lightbulb,
    title: 'Human Quality Review',
    description: 'Every design goes through a professional review before delivery. Technology handles speed; our team ensures quality, accuracy, and that personal touch.',
  },
];

const teamStats = [
  { label: 'Average Experience', value: '8+ years' },
  { label: 'Design Styles', value: '15+ covered' },
  { label: 'Cities Served', value: '25+ across India' },
];

export function TeamSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-accent/10 text-accent border-0">
            Our Approach
          </Badge>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            Design Expertise Meets Smart Technology
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We combine experienced design professionals with advanced technology to deliver professional results in 72 hours instead of 3–6 weeks.
          </p>
        </motion.div>

        {/* Approach Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {approachItems.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="group relative bg-secondary/30 rounded-3xl p-8 hover:bg-secondary/50 transition-all duration-500"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-accent/10 via-purple-500/10 to-accent/10 rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {teamStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
