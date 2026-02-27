'use client';

import { motion } from 'framer-motion';

const ease = [0.25, 0.46, 0.45, 0.94];

const steps = [
  { num: '01', title: 'Upload your room', desc: 'Take a photo of your space. Any room, any condition.' },
  { num: '02', title: 'Choose your style', desc: 'Modern, Scandinavian, Indian Contemporary — you decide.' },
  { num: '03', title: 'Get your designs', desc: 'Photorealistic renders, itemized budgets, and contractor connections.' },
  { num: '04', title: 'Start building', desc: 'Shop directly from your list. Connect with verified local pros.' },
];

export function DarkHowItWorksSection() {
  return (
    <section className="bg-white py-6 md:py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-[0.04em] uppercase text-[#6E6E73] mb-3">How it works</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F]">
            Four steps. That's it.
          </h2>
          <p className="text-[21px] text-[#6E6E73] leading-[1.38] mt-2">From photo to finished plan in 72 hours.</p>
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
                <span className="inline-block text-[56px] font-bold text-[#E8662E] leading-none relative z-10 bg-white px-2">
                  {s.num}
                </span>
                <h3 className="text-[20px] font-semibold text-[#1D1D1F] mt-4">{s.title}</h3>
                <p className="text-[15px] text-[#6E6E73] leading-[1.47] mt-2 max-w-[220px] mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
