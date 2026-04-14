'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Eye, Wallet } from 'lucide-react';

const problems = [
  {
    icon: Clock,
    title: 'Weeks of Waiting',
    description: 'Traditional designers take 3–6 weeks for initial concepts. You receive yours in 72 hours.',
    gradient: 'from-orange-500 to-pink-500'
  },
  {
    icon: Eye,
    title: 'Opaque Pricing',
    description: 'Material markups, vendor commissions, and revision fees add up. We show you exactly what everything costs.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Wallet,
    title: 'High Entry Barrier',
    description: 'Most designers require ₹50,000+ upfront before you see a single concept. We start from ₹499 with a full money-back guarantee.',
    gradient: 'from-purple-500 to-violet-500'
  }
];

export function ProblemStatementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]">
            Traditional Interior Design Is Expensive, Slow, and Opaque.{' '}
            <span className="text-accent">It Doesn't Have to Be.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {problems.map((problem, idx) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group text-center md:text-left bg-background border border-border/50 rounded-2xl p-8 hover:border-accent/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-smooth"
            >
              <div className={`w-16 h-16 mx-auto md:mx-0 mb-6 rounded-2xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:rotate-3`}>
                <problem.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
