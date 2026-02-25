'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Check, Loader2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function WaitingScreen({ designerName, roomType, onUpgrade, onDismissUpsell }) {
  return (
    <div className="space-y-6">
      <Card className="p-8 text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block mb-4"
        >
          <Wand2 className="h-12 w-12 text-secondary" />
        </motion.div>
        
        <h2 className="text-2xl font-heading font-bold mb-2">
          {designerName} is Designing Your {roomType}
        </h2>
        <p className="text-muted-foreground">Your concept is being created right now</p>
      </Card>

      {/* Progress Checklist */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Design Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1 rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span>Analyzed your space layout</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1 rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span>Processed your style preferences</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1.5 rounded-full bg-secondary/20">
              <Loader2 className="h-3 w-3 text-secondary animate-spin" />
            </div>
            <span className="text-secondary font-medium">Generating your concept...</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="p-1 rounded-full bg-muted">
              <Clock className="h-4 w-4" />
            </div>
            <span>Creating 2 high-quality renders...</span>
          </div>
        </div>

        <div className="mt-6 p-3 bg-accent rounded-lg text-sm text-center">
          <span className="text-muted-foreground">Expected ready: </span>
          <span className="font-medium">Tomorrow, 4:00 PM</span>
        </div>
      </Card>

      {/* Upsell Card */}
      {onUpgrade && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-secondary/50 bg-gradient-to-br from-secondary/5 to-primary/5">
            <div className="flex items-start gap-3 mb-4">
              <Wand2 className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <h4 className="font-semibold">One-Time Upgrade Opportunity</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Want to compare 3 different styles before deciding?
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-secondary" />
                <span>See Modern, Traditional & Fusion side-by-side</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-secondary" />
                <span>Each concept includes 2 renders (6 total)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-secondary" />
                <span>Only available before you see your first design</span>
              </div>
            </div>

            <p className="text-2xl font-bold text-secondary mb-4">₹1,099</p>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={onDismissUpsell}>
                No thanks
              </Button>
              <Button size="sm" onClick={onUpgrade} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Add 3-Concept Comparison
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        ⚠️ This upgrade is only available NOW. Once you see your design, this option disappears.
      </p>
    </div>
  );
}
