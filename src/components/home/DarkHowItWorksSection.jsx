'use client';

import { motion } from 'framer-motion';

const ease = [0.25, 0.46, 0.45, 0.94];

const steps = [
  { num: '01', title: 'Upload your room', desc: 'share a photo of your room or upload your layout' },
  { num: '02', title: 'Choose your style', desc: 'Pick a style you actually love' },
  { num: '03', title: 'See your home', desc: 'Designs, budgets that are commission free' },
  { num: '04', title: 'Start building', desc: 'Clear lists. Everything you need. No guesswork.' },
];

export function DarkHowItWorksSection() {
  return (
    <section className="bg-background py-10 md:py-12 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-6 md:mb-16"
        >
          <p className="text-[10px] sm:text-sm font-semibold tracking-[0.14em] uppercase opacity-40 mb-1" style={{ color: 'var(--color-description)' }}>How it works</p>
          <h2 className="text-2xl sm:text-[clamp(36px,5vw,56px)] font-bold tracking-tight leading-tight" style={{ color: 'var(--color-heading-main)' }}>
            Plan your home in 4 steps
          </h2>
          <p className="text-xs sm:text-[21px] leading-relaxed mt-1 opacity-60" style={{ color: 'var(--color-description)' }}>Upload your space today. Get a plan in 72 hours.</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[28px] left-[12.5%] right-[12.5%] h-[2px] bg-border" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: i * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
                className="text-center relative"
              >
                <span className="inline-block text-5xl md:text-[56px] font-bold leading-none" style={{ color: 'var(--color-primary)' }}>
                  {s.num}
                </span>
                <h3 className="text-base md:text-[20px] font-bold mt-1 md:mt-4" style={{ color: 'var(--color-heading-secondary)' }}>{s.title}</h3>
                <p className="text-[10px] md:text-[14px] leading-tight mt-1 max-w-[140px] mx-auto opacity-60 font-medium" style={{ color: 'var(--color-description)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
