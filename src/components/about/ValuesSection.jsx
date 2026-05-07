'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { ShieldCheck } from 'lucide-react';

export function ValuesSection() {
  return (
    <section className="py-20 md:py-28 bg-[#FDFBF7]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* Diamond icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#EC7446]/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#EC7446]" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-5">
              100% money-back guarantee
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              If you're not completely satisfied with your plan, we return every rupee. No questions, no conditions. That's how confident we are in the work.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
