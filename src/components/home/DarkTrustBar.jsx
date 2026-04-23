'use client';

import { motion } from 'framer-motion';
import { Clock, Check, Lock, MapPin } from 'lucide-react';

export function DarkTrustBar() {
  return (
    <section className="bg-background py-10 border-t border-black/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[1200px] mx-auto px-6 text-center"
      >
        <div className="inline-flex items-center gap-4 text-xl md:text-2xl font-bold" style={{ color: 'var(--color-heading-main)' }}>
          <Clock className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
          <span>Delivered in 72 hours or your money back. No questions asked.</span>
        </div>
      </motion.div>
    </section>
  );
}
