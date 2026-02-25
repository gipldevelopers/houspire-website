'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, IndianRupee, ShoppingBag, Users } from 'lucide-react';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { HeroHighlight } from '@/components/ui/hero-highlight';

const ease = [0.25, 0.46, 0.45, 0.94];

const featurePills = [
  { icon: ImageIcon, label: '4K Room Designs', subtitle: 'Your rooms, your style' },
  { icon: IndianRupee, label: 'Budget Breakdown', subtitle: 'Good / Better / Best' },
  { icon: ShoppingBag, label: 'Shopping Lists', subtitle: 'Direct purchase links' },
  { icon: Users, label: 'Verified Contractors', subtitle: 'Trusted local pros' },
];

export function HeroSection() {
  const router = useRouter();

  return (
    <HeroHighlight>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12">
        {/* Background image with subtle zoom */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/hero-bg.jpg)',
          }}
        />

        {/* Warm light gradient overlay - fades image to white at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0.85) 70%, rgba(255,255,255,1) 100%)',
          }}
        />

        {/* Content — positioned in lower portion */}
        <div className="relative z-10 text-center px-6 max-w-[820px]">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            <TextGenerateEffect
              words="See your dream home."
              className="block text-[clamp(36px,5vw,64px)] font-bold tracking-[-0.03em] leading-[1.05] text-[#1D1D1F]"
              delay={0.5}
            />
            <TextGenerateEffect
              words="Before spending a rupee."
              className="block text-[clamp(36px,5vw,64px)] font-bold tracking-[-0.03em] leading-[1.05] text-[#6E6E73]"
              delay={1.0}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
            className="mt-4 text-[17px] text-[#6E6E73] leading-[1.47] max-w-[600px] mx-auto"
          >
            Photorealistic designs. Itemized budgets. Verified contractors. Delivered in 72 hours.
          </motion.p>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-[720px] mx-auto">
            {featurePills.map((pill, i) => (
              <motion.div
                key={pill.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.6 + i * 0.08 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-4 text-center border border-black/[0.06]"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <pill.icon className="w-6 h-6 text-[#E8662E] mx-auto" />
                <span className="block text-[15px] font-semibold text-[#1D1D1F] mt-2 leading-tight">{pill.label}</span>
                <span className="block text-[13px] text-[#86868B] mt-0.5">{pill.subtitle}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.0 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
          >
            <ShimmerButton
              onClick={() => router.push('/style-quiz')}
              className="px-6 py-3 text-[17px] text-white bg-[#E8662E] hover:bg-[#D45A1F] rounded-full transition-all duration-300 w-full sm:w-auto"
            >
              Take the Free Style Quiz
            </ShimmerButton>
            <button
              onClick={() => router.push('/report-preview')}
              className="px-6 py-3 text-[17px] text-[#E8662E] border-[1.5px] border-[#E8662E] hover:bg-[#E8662E]/5 rounded-full transition-all duration-300 w-full sm:w-auto"
            >
              See a Sample Report ›
            </button>
          </motion.div>
        </div>
      </section>
    </HeroHighlight>
  );
}
