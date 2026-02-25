'use client';

import { motion } from 'framer-motion';
import { Clock, Check, Lock, MapPin } from 'lucide-react';

const trustItems = [
  { icon: Clock, text: '72-hour delivery' },
  { icon: Check, text: '100% money-back guarantee if not delivered in 72 hours' },
  { icon: Lock, text: 'Secured by Razorpay' },
  { icon: MapPin, text: 'Available all over India' },
];

export function DarkTrustBar() {
  return (
    <section className="bg-white py-8 border-t border-black/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[980px] mx-auto px-6 flex flex-wrap justify-center items-center gap-4"
      >
        {trustItems.map((item, i) => (
          <div key={item.text} className="flex items-center">
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-[#6E6E73]" />
              <span className="text-sm text-[#86868B]">{item.text}</span>
            </div>
            {i < trustItems.length - 1 && (
              <div className="hidden sm:block w-px h-4 bg-[#D2D2D7] ml-4" />
            )}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
