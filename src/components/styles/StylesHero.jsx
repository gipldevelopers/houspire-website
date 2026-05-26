'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Users,
  Clock,
  TrendingUp,
  Sparkles,
  Palette,
} from 'lucide-react';

export function StylesHero({ stylesCount, totalDesigners, totalProjects }) {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 md:mb-16"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_rgba(236,116,70,0.5)]" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>
            {stylesCount} Curated Design Styles
          </span>
        </div>
      </motion.div>
      
      {/* Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
        style={{ color: "var(--color-primary-2)" }}
      >
        Discover Your
        <span className="block text-primary mt-1">Perfect Design Style</span>
      </motion.h1>
      
      {/* Description */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
      >
        Browse our expertly curated collection of interior design aesthetics, 
        each backed by a dedicated team of specialized designers.
      </motion.p>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">{totalDesigners}+</p>
            <p className="text-xs text-muted-foreground">Expert Designers</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">72-Hour</p>
            <p className="text-xs text-muted-foreground">Delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">100%</p>
            <p className="text-xs text-muted-foreground">Money-Back Guarantee</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">{stylesCount}+</p>
            <p className="text-xs text-muted-foreground">Design Styles</p>
          </div>
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <button
          onClick={() => router.push('/select-package')}
          className="btn-primary rounded-xl px-8 h-14 text-base shadow-lg hover:shadow-xl transition-shadow flex items-center"
        >
          Choose Package
          <Sparkles className="ml-2 w-5 h-5" />
        </button>
        <button
          onClick={() => document.getElementById('styles-grid')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-secondary rounded-xl px-8 h-14 text-base"
        >
          Browse All Styles
        </button>
      </motion.div>
    </motion.div>
  );
}
