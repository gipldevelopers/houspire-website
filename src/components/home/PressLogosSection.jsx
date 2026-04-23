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
    <section ref={ref} className="py-12 md:py-16 border-y" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm mb-8 opacity-60"
          style={{ color: 'var(--color-description)' }}
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
              <div className="flex items-center justify-center h-10 px-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--color-description)' }}>
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
          className="text-center text-xs mt-8 opacity-40"
          style={{ color: 'var(--color-description)' }}
        >
          Trusted by 1,000+ homeowners across India
        </motion.p>
      </div>
    </section>
  );
}
