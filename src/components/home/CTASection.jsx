'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, forwardRef } from 'react';

export const CTASection = forwardRef(function CTASection(_, forwardedRef) {
  const router = useRouter();
  const internalRef = useRef(null);
  const ref = forwardedRef || internalRef;
  const isInView = useInView(internalRef, { once: true, margin: "-100px" });

  return (
    <section ref={internalRef} className="section-apple bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-6 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.1]">
            Get clarity before you
            <br />
            commit lakhs to execution
          </h2>
          
          <p className="mt-8 text-xl md:text-2xl text-background/60 max-w-2xl mx-auto">
            See your complete home — designed, budgeted, and execution-ready — before spending a rupee on interiors.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-12"
          >
            <Button
              size="lg"
              onClick={() => router.push('/style-quiz')}
              className="h-14 px-10 text-lg font-medium bg-background text-foreground hover:bg-background/90 rounded-full transition-all duration-300 group shadow-xl shadow-background/20 hover:shadow-2xl hover:shadow-background/30 active:scale-[0.98]"
            >
              Take the Free Style Quiz
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';
