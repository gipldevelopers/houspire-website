'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94];

const faqs = [
  {
    q: 'What exactly do I receive?',
    a: 'You get photorealistic 3D renders of your rooms from multiple angles, a detailed room-by-room budget breakdown with Good/Better/Best options, and direct shopping links for every item. Everything is delivered as a comprehensive digital home plan within 72 hours.',
  },
  {
    q: 'Is this AI-generated? Will it look generic?',
    a: 'Our AI creates the initial design based on your specific room photos, style preferences, and budget. Every design is then reviewed by our team to ensure quality. Because it starts from YOUR actual room, not a template, each output is unique to your space.',
  },
  {
    q: "What if I don't like the designs?",
    a: "Every plan includes revision rounds — 1 for Starter, 2 for Home Design, and 5 for Complete Home. Plus, all plans come with a 100% money-back guarantee if we fail to deliver within 72 hours.",
  },
  {
    q: 'How is this different from hiring a traditional interior designer?',
    a: 'Traditional designers charge ₹50,000–₹2,00,000+ and take weeks to deliver. Many also earn 15-20% commissions on materials — a hidden cost you never see. Houspire gives you the same deliverables at a flat fee starting at ₹999, with full cost transparency and no hidden markups.',
  },
  {
    q: 'Do you work in my city?',
    a: 'Our design services work for any location across India. While we started in major metros, our digital reports provide everything you need—designs, budgets, and shopping links—to execute your project with any local team of your choice.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-white py-[60px] md:py-[80px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-14"
        >
          <p className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#6E6E73] mb-3">
            Common Questions
          </p>
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F]">
            Everything you'd want to know.
          </h2>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: i * 0.05 }}
              className="border-b border-[#D2D2D7]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="text-[18px] font-semibold text-[#1D1D1F] pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#86868B] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-[16px] text-[#6E6E73] leading-[1.6] pb-5">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
