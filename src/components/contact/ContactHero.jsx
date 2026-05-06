'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Sparkles } from 'lucide-react';

export function ContactHero() {
  return (
    <section className="relative py-6 md:py-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--color-bg)' }} />
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: 'var(--color-primary)' }} />
      
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <Badge className="mb-4 px-4 py-1.5 border-[var(--color-border)]" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)' }}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            We respond within 24 hours
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 leading-[1.1]" style={{ color: 'var(--color-heading-main)' }}>
            Let's Start a
            <span className="block" style={{ color: 'var(--color-heading-main-highlight)' }}>
              Conversation
            </span>
          </h1>
          
          <p className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto opacity-60" style={{ color: 'var(--color-description)' }}>
            Have questions about your project? Need support? We're here to help you create the space of your dreams.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
