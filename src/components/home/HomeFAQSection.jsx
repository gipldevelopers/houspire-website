'use client';

import { useRef, forwardRef } from 'react';
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

const HOMEPAGE_FAQS = [
  {
    id: 'faq-1',
    question: 'What exactly do I receive?',
    answer: 'You receive a Home Design Report — a professional PDF document containing photorealistic visualizations of your rooms from multiple angles, an itemized budget with three pricing tiers (Good / Better / Best), a shopping guide with direct purchase links, verified vendors contacts in your city, and a step-by-step execution roadmap. You can see a sample report before purchasing.',
  },
  {
    id: 'faq-2',
    question: 'Is this AI-generated? Will it look generic?',
    answer: 'Our design team uses advanced technology to create designs faster and more affordably than traditional methods. Every design is based on YOUR specific room dimensions, style preferences, and budget — not templates. Each design is reviewed by experienced professionals before delivery. The technology is the reason we can offer this at a fraction of traditional costs while maintaining professional quality.',
  },
  {
    id: 'faq-3',
    question: 'How is this different from hiring a traditional interior designer?',
    answer: 'Traditional designers charge ₹50,000–₹2,00,000+ for the design phase alone, take 3–6 weeks for initial concepts, and often add material markups and commissions. Houspire delivers the same design clarity — room visualizations, budgets, contractor connections — in 72 hours at a fraction of the cost. The key difference: we give you the design intelligence to make informed decisions. You\'re free to work with any contractor or vendor you choose.',
  },
  {
    id: 'faq-4',
    question: 'What if I don\'t like the design?',
    answer: 'Every paid plan includes at least one revision round where you can provide feedback and we\'ll adjust the designs accordingly. Additionally, we offer a 100% money-back guarantee: if we fail to deliver within the promised timeline, you get a full refund. We recommend starting with the Free Discovery quiz to see if our style and approach matches your taste before committing.',
  },
  {
    id: 'faq-6',
    question: 'Who actually designs my home?',
    answer: 'Your design is created by the Houspire design team — a combination of experienced design professionals and advanced design technology. The technology handles the heavy lifting of visualization and rendering, while our team handles creative direction, quality review, and personalization. This hybrid approach is how we deliver professional results in 72 hours instead of 3–6 weeks.',
  },
];

export const HomeFAQSection = forwardRef(function HomeFAQSection(_, forwardedRef) {
  const internalRef = useRef(null);
  const ref = forwardedRef || internalRef;
  const isInView = useInView(internalRef, { once: true, margin: "-100px" });
  const router = useRouter();

  return (
    <section ref={internalRef} className="section-apple bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-12"
          >
            <p className="text-accent font-medium mb-4">Common Questions</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              Got questions?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              We've got answers.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {HOMEPAGE_FAQS.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                >
                  <AccordionItem
                    value={faq.id}
                    className="border border-border/50 rounded-2xl px-6 bg-card hover:border-border transition-colors duration-300"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5 text-base md:text-lg font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* View all CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-10"
          >
            <Button
              variant="ghost"
              onClick={() => router.push('/faq')}
              className="group"
            >
              View all FAQs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HomeFAQSection.displayName = 'HomeFAQSection';
