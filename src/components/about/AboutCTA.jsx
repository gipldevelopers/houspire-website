'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

export function AboutCTA() {
  const router = useRouter();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-orange-500 to-purple-600" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Join 200+ happy homeowners</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 leading-tight">
            Ready to Transform
            <span className="block">Your Space?</span>
          </h2>
          
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Take our 2-minute style quiz and get matched with your perfect designer. 
            Your dream home is just ₹999 away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/style-quiz')}
              size="lg"
              className="h-14 px-8 bg-white text-foreground hover:bg-white/90 rounded-full text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => router.push('/discover')}
              size="lg"
              variant="outline"
              className="h-14 px-8 border-2 border-white/30 bg-transparent text-white hover:bg-white/10 rounded-full text-base font-semibold"
            >
              Browse Designs
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
