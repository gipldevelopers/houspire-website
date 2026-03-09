'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Sparkles } from 'lucide-react';

export function ContactHero() {
  return (
    <section className="relative py-14 md:py-18 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-background to-sky-500/10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <Badge className="mb-6 bg-accent/10 text-accent border-0 px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            We respond within 24 hours
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-semibold text-foreground tracking-tight mb-6 leading-[1.1]">
            Let's Start a
            <span className="block bg-gradient-to-r from-accent to-amber-500 bg-clip-text text-transparent">
              Conversation
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Have questions about your project? Need support? We're here to help you create the space of your dreams.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
