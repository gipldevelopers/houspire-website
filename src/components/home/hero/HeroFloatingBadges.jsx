'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

export function HeroFloatingBadges() {
  // Floating badges removed — no more "₹499" and "72h" badges
  return null;
}

export function HeroTrustBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex justify-center mt-12 md:mt-8"
    >
      <Badge variant="secondary" className="bg-card border border-border/50 shadow-lg px-4 py-2">
        <Shield className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
        Money-back guarantee
      </Badge>
    </motion.div>
  );
}
