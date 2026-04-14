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
    <section className="bg-background py-6 md:py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-[0.04em] uppercase text-muted-foreground mb-3">How it works</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F]">
            Plan your home in 4 steps
          </h2>
          <p className="text-[21px] text-muted-foreground leading-[1.38] mt-2">Upload your space today. Get a complete home plan in 72 hours.</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[28px] left-[12.5%] right-[12.5%] h-[2px] bg-[#D2D2D7]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                className="text-center relative"
              >
                {/* Vertical connector — mobile/tablet only (not on last item) */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-[56px] h-[calc(100%+40px-56px)] w-[2px] bg-[#D2D2D7] -z-0" />
                )}
                <span className="inline-block text-[56px] font-bold text-primary leading-none relative z-10 bg-white px-2">
                  {s.num}
                </span>
                <h3 className="text-[20px] font-semibold text-[#1D1D1F] mt-4">{s.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-[1.47] mt-2 max-w-[220px] mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
