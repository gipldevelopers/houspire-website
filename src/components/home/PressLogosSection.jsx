'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function PressLogosSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Placeholder logos - in production these would be real publication logos
  const logos = [
    { name: 'Architectural Digest', abbr: 'AD' },
    { name: 'Forbes India', abbr: 'Forbes' },
    { name: 'The Economic Times', abbr: 'ET' },
    { name: 'YourStory', abbr: 'YS' },
    { name: 'Better Homes', abbr: 'BH&G' },
    { name: 'Houzz India', abbr: 'Houzz' },
  ];

  return (
    <section ref={ref} className="py-12 md:py-16 bg-secondary/20 border-y border-border/30">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          Featured in leading publications
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {logos.map((logo, idx) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group cursor-default"
            >
              {/* Text-based logo placeholder */}
              <div className="flex items-center justify-center h-10 px-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-300">
                <span className="text-lg md:text-xl font-semibold tracking-tight whitespace-nowrap">
                  {logo.abbr}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs text-muted-foreground/60 mt-8"
        >
          Trusted by 1,000+ homeowners across India
        </motion.p>
      </div>
    </section>
  );
}
