'use client';

import { motion, useInView } from 'framer-motion';
import { Clock, Shield, Users, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const features = [
    {
      icon: Clock,
      title: '72-hour guarantee',
      description: 'Your complete design package delivered in three days, or your money back.',
      gradient: 'from-orange-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Transparent pricing',
      description: 'One flat fee. No hidden costs, markups, or commissions. Ever.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Expert designers',
      description: 'Matched with a designer who understands your style and space.',
      gradient: 'from-purple-500 to-violet-500'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-accent font-medium tracking-[0.1em] uppercase text-xs mb-4">
            Why Houspire
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            Design made simple.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group text-center md:text-left bg-background border border-border/50 rounded-2xl p-8 hover:border-accent/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            >
              <div className={`w-16 h-16 mx-auto md:mx-0 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:rotate-3`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                {feature.description}
              </p>
              <button className="inline-flex items-center text-accent text-sm font-medium hover:text-accent/80 transition-colors group/link">
                Learn more
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
