'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { CheckCircle, X } from 'lucide-react';

const problems = [
  'Designers charge ₹50,000+ for consultations',
  '15-20% vendor commissions add hidden costs',
  'Weeks of waiting for basic designs',
  'Most homeowners settle for DIY chaos',
];

const solutions = [
  '₹999 flat fee - transparent pricing',
  'Zero vendor commissions - shop anywhere',
  '72-hour delivery - time is precious',
  'Professional quality - everyone deserves it',
];

export function MissionSection() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            Why We Started
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We saw a broken industry and decided to fix it.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                The Old Way
              </h3>
            </div>
            
            <div className="space-y-4">
              {problems.map((problem, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span className="text-muted-foreground">{problem}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* The Solution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-green-500/5 border border-green-500/20 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                The Houspire Way
              </h3>
            </div>
            
            <div className="space-y-4">
              {solutions.map((solution, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-foreground">{solution}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
