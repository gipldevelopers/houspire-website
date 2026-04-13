'use client';

import { motion } from 'framer-motion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { redirectToHouspireHome } from '@/lib/external-links';

const ease = [0.25, 0.46, 0.45, 0.94];

export function DarkFinalCTA() {
  return (
    <section className="bg-[#1D1D1F] py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[780px] mx-auto px-6 text-center"
      >
        <h2 className="text-[clamp(36px,5vw,60px)] font-black tracking-[-0.03em] leading-[1.05] text-white">
          <TextGenerateEffect words="Don’t spend lakhs on your home without a clear plan." />
        </h2>
        <p className="text-xl md:text-2xl text-white/60 mt-8 font-medium leading-relaxed">
          Know exactly what your home will look like and cost—before you start.
        </p>
        <button
          onClick={redirectToHouspireHome}
          className="mt-12 px-10 py-5 text-lg font-black bg-[#E8662E] hover:bg-[#D45A1F] text-white rounded-full transition-all duration-300 shadow-2xl shadow-orange-500/20"
        >
          Design my home now →
        </button>
      </motion.div>
    </section>
  );
}
