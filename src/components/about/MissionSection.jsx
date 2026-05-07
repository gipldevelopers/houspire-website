'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Check } from 'lucide-react';

const features = [
  'Photorealistic 3D renders',
  'Your actual layout',
  '20 design styles',
  '72-hour delivery',
  'Zero execution bias',
  'No referral commissions',
];

export function MissionSection() {
  return (
    <section className="py-20 md:py-28 bg-[#1E2A38] relative overflow-hidden">
      {/* Warm glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EC7446]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2C5A52]/30 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-[#EC7446] text-sm font-semibold tracking-widest uppercase mb-4">
              How we work
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
              Planning-first. <br />
              <span className="text-white/50">Not execution-first.</span>
            </h2>
            <div className="space-y-4 text-white/70 text-base leading-relaxed">
              <p>
                Houspire is a planning-first platform. We don't execute your renovation. We don't sign contractors. We don't earn a rupee in referral commissions.
              </p>
              <p>
                What we do is give your entire family a photorealistic 3D render of your actual home — your exact layout, your chosen style — so everyone is looking at the same picture before a single decision is made.
              </p>
              <p>
                No arguments about "what it'll look like." No last-minute regrets. No middleman with a margin to protect.
              </p>
            </div>

            <div className="mt-8 space-y-2 text-white/60 text-sm">
              <p>Choose from <strong className="text-white">20 curated Indian and global design styles.</strong></p>
              <p>Receive your complete plan within <strong className="text-white">72 hours.</strong></p>
              <p>Walk into every vendor conversation with <strong className="text-white">full clarity</strong> — and never get taken advantage of again.</p>
            </div>
          </motion.div>

          {/* Right — feature chips */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feat, idx) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-7 h-7 rounded-full bg-[#EC7446]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#EC7446]" />
                </div>
                <span className="text-white/90 text-sm font-medium">{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
