'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { PlanningWizardModal } from '@/components/wizard/PlanningWizardModal';

const ease = [0.25, 0.46, 0.45, 0.94];

export function DarkFinalCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-[#0c0c0e] py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[780px] mx-auto px-6 text-center"
      >
        <h2 className="text-[28px] md:text-[clamp(36px,5vw,60px)] font-black tracking-[-0.03em] leading-[1.05] text-white">
          <TextGenerateEffect words="Don’t spend lakhs on your home without a clear plan." />
        </h2>
        <p className="text-[16px] md:text-2xl mt-6 md:mt-8 font-medium leading-relaxed text-white/70">
          Know exactly what your home will look like and cost—before you start.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 md:mt-12 px-8 py-4 text-base md:text-lg font-black text-white rounded-full transition-all duration-300 shadow-2xl btn-primary"
          style={{ boxShadow: '0 25px 50px -12px color-mix(in srgb, var(--color-primary) 20%, transparent)' }}
        >
          Design my home now →
        </button>
      </motion.div>
      </section>
      <PlanningWizardModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
