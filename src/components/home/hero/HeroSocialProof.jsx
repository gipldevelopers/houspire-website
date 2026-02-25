'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, CreditCard } from 'lucide-react';

export function HeroSocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 pt-8 border-t border-border/50"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="h-4 w-4 text-success" />
        <span>72-hour delivery</span>
      </div>

      <div className="hidden sm:block w-px h-4 bg-border" />

      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Shield className="h-4 w-4 text-success" />
        <span>100% money-back guarantee</span>
      </div>

      <div className="hidden sm:block w-px h-4 bg-border" />

      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <CreditCard className="h-4 w-4 text-success" />
        <span>Secured by Razorpay</span>
      </div>
    </motion.div>
  );
}
