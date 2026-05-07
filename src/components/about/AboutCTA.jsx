'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export function AboutCTA() {
  const router = useRouter();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#EC7446]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_110%,rgba(0,0,0,0.18),transparent)]" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <h2 className="text-3xl md:text-5xl font-semibold mb-5 tracking-tight leading-tight">
            See your home before you build it.
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Get a photorealistic 3D render of your actual space — your layout, your style — in 72 hours. Flat ₹4,999. No surprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/style-quiz')}
              className="btn-highlight btn-lg"
            >
              Start your plan
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => router.push('/discover')}
              className="inline-flex items-center justify-center h-14 px-8 rounded-full border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
            >
              Browse styles
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
