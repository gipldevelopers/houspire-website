'use client';

import { motion } from 'framer-motion';

export function HeroScrollIndicator({ opacity }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
      >
        <motion.div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
      </motion.div>
    </motion.div>
  );
}
