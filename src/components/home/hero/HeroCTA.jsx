'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HeroCTA() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
    >
      <Button
        size="lg"
        onClick={() => router.push('/style-quiz')}
        className="min-w-[200px] group px-8 py-4 text-lg h-auto shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
      >
        Take the Free Style Quiz
        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Button>
      
      <button
        onClick={() => router.push('/styles')}
        className="group relative inline-flex items-center text-accent hover:text-accent/80 font-medium transition-colors py-2"
      >
        <span className="relative">
          Browse styles
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
        </span>
        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  );
}

// Urgency badge removed — no more fake "Launch offer: 50% off" badge
export function HeroUrgencyBadge() {
  return null;
}
