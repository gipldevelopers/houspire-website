'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ProgressiveRevealWrapper({
  children,
  isLocked,
  lockedMessage = 'This section unlocks as your project progresses.',
  unlockLabel,
}) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="pointer-events-none select-none blur-[3px] opacity-40">
        {children}
      </div>

      {/* Lock overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <Card className="p-6 text-center max-w-xs shadow-lg border bg-card/95 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          {unlockLabel && (
            <p className="text-xs text-primary font-medium mb-1">{unlockLabel}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lockedMessage}
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
