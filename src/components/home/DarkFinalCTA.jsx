'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

const ease = [0.25, 0.46, 0.45, 0.94];

export function DarkFinalCTA() {
  const router = useRouter();

  return (
    <section className="bg-[#1D1D1F] py-[40px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[780px] mx-auto px-6 text-center"
      >
        <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.025em] leading-[1.07] text-white">
          <TextGenerateEffect words="Get clarity before you commit lakhs to execution." />
        </h2>
        <p className="text-[17px] text-white/60 mt-5">
          See your complete home — designed, budgeted, and execution-ready.
        </p>
        <button
          onClick={() => router.push('/style-quiz')}
          className="mt-10 px-6 py-3 text-[17px] text-white border-[1.5px] border-white hover:bg-white/10 rounded-full transition-all duration-300"
        >
          Start Your Free Style Quiz →
        </button>
        <p className="text-xs text-white/40 mt-4">Free · 2 minutes · No signup required</p>
      </motion.div>
    </section>
  );
}
