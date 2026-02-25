'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Camera, Paintbrush, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Share Your Space',
    description: 'Upload room photos and tell us your style preferences, budget range, and must-haves.',
    time: '10 min',
    icon: Camera
  },
  {
    number: '02',
    title: 'We Design',
    description: 'Our design team uses advanced technology to create photorealistic visualizations of your space in your chosen style.',
    time: '72 hours',
    icon: Paintbrush
  },
  {
    number: '03',
    title: 'Your Design Report',
    description: 'Receive your complete Home Design Report: room designs, itemized budgets, shopping lists, and contractor contacts.',
    time: 'Delivered',
    icon: FileText
  },
  {
    number: '04',
    title: 'Execute with Confidence',
    description: 'Use your report to work with any contractor or vendor. You own the design — no lock-in, no commissions.',
    time: 'Your pace',
    icon: CheckCircle
  }
];

export function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-accent/[0.01]">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-accent font-medium tracking-[0.1em] uppercase text-xs mb-4">
            Simple Process
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            From Photos to a Complete Design Plan in 72 Hours
          </h2>
        </motion.div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block max-w-6xl mx-auto mb-16">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-border via-accent/30 to-border" />
            
            <div className="grid grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative text-center"
                >
                  {/* Icon circle */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-lg relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Time badge */}
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium">
                      {step.time}
                    </span>
                  </div>
                  
                  <p className="text-accent font-mono text-xs tracking-wider mb-2">
                    STEP {step.number}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical layout */}
        <div className="lg:hidden max-w-md mx-auto space-y-10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <span className="inline-block rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium mb-4">
                {step.time}
              </span>
              
              <p className="text-accent font-mono text-xs tracking-wider mb-2">
                STEP {step.number}
              </p>
              
              <h3 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Explanation text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-background border border-border/50 rounded-2xl p-8 text-center">
            <p className="text-foreground/70 leading-relaxed">
              <span className="font-semibold text-foreground">How do we deliver professional designs this fast?</span>{' '}
              Our design team combines expert curation with cutting-edge design technology to produce in 72 hours what traditionally takes 3–6 weeks. Every design is reviewed by experienced professionals before delivery.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
