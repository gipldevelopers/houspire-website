'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';

const TOP_FAQS = [
  {
    id: 'faq-1',
    question: 'What exactly do I receive?',
    answer: 'You receive a Home Design Report — a professional PDF document containing photorealistic visualizations of your rooms from multiple angles, an itemized budget with three pricing tiers (Good / Better / Best), a shopping guide with direct purchase links, verified vendors contacts in your city, and a step-by-step execution roadmap.',
  },
  {
    id: 'faq-2',
    question: 'Is this AI-generated? Will it look generic?',
    answer: 'Our design team uses advanced technology to create designs faster and more affordably than traditional methods. Every design is based on YOUR specific room dimensions, style preferences, and budget — not templates. Each design is reviewed by experienced professionals before delivery.',
  },
  {
    id: 'faq-3',
    question: 'What if I don\'t like the designs?',
    answer: 'Every paid plan includes at least one revision round where you can provide feedback and we\'ll adjust the designs accordingly. Additionally, we offer a 100% money-back guarantee: if we fail to deliver within the promised timeline, you get a full refund.',
  },
  {
    id: 'faq-4',
    question: 'How is this different from hiring a traditional interior designer?',
    answer: 'Traditional designers charge ₹50,000–₹2,00,000+ for the design phase alone, take 3–6 weeks for initial concepts, and often add material markups and commissions. Houspire delivers the same design clarity — room visualizations, budgets, contractor connections — in 72 hours at a fraction of the cost. You\'re free to work with any contractor or vendor you choose.',
  },
];

export function FAQCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const router = useRouter();

  return (
    <section ref={ref} className="py-24 md:py-32 bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-6 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-10"
          >
            <p className="text-accent font-medium mb-4">Common Questions</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Got questions? We've got answers.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {TOP_FAQS.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                >
                  <AccordionItem
                    value={faq.id}
                    className="border border-background/10 rounded-2xl px-6 bg-background/5 hover:bg-background/10 transition-colors duration-300"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5 text-base md:text-lg font-medium text-background">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-background/70 pb-5 text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* View all FAQs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-6"
          >
            <Button
              variant="ghost"
              onClick={() => router.push('/faq')}
              className="text-background/60 hover:text-background group"
            >
              View all FAQs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mt-16 pt-12 border-t border-background/10"
          >
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Get clarity before you commit lakhs to execution
            </h3>
            <p className="text-lg text-background/60 max-w-xl mx-auto mb-8">
              See your complete home — designed, budgeted, and execution-ready — before spending a rupee on interiors.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/select-package')}
              className="h-14 px-10 text-lg font-medium bg-background text-foreground hover:bg-background/90 rounded-full transition-all duration-300 group shadow-xl shadow-background/20"
            >
              Choose Your Package
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
