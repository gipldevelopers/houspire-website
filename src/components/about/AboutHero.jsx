'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/badge';

export function AboutHero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-accent/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <Badge className="mb-6 bg-accent/10 text-accent border-0 px-4 py-1.5 text-sm">
            Est. 2024 • Based in India
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-semibold text-foreground tracking-tight mb-8 leading-[1.1]">
            Design Intelligence
            <span className="block bg-gradient-to-r from-accent via-orange-500 to-purple-500 bg-clip-text text-transparent">
              for Everyone
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We're a design intelligence service on a mission to make professional interior design accessible to every Indian homeowner — delivering photorealistic designs, detailed budgets, and verified contractor connections in 72 hours.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
