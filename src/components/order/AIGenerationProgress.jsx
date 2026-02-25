import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Palette, Calculator, MapPin, Clock, CheckCircle2, Loader2, Image as ImageIcon, Lightbulb, } from 'lucide-react';
const GENERATION_STEPS = [
    {
        id: 'analyzing',
        label: 'Analyzing Your Space',
        icon: Sparkles,
        description: 'Understanding room dimensions and layout',
    },
    {
        id: 'concept',
        label: 'Creating Design Concept',
        icon: Lightbulb,
        description: 'Developing personalized style direction',
    },
    {
        id: 'colors',
        label: 'Generating Color Palette',
        icon: Palette,
        description: 'Selecting harmonious color combinations',
    },
    {
        id: 'budget',
        label: 'Building Budget Breakdown',
        icon: Calculator,
        description: 'Calculating costs by category',
    },
    {
        id: 'vendors',
        label: 'Finding Local Vendors',
        icon: MapPin,
        description: 'Locating stores in your city',
    },
    {
        id: 'renders',
        label: 'Rendering Room Visuals',
        icon: ImageIcon,
        description: 'Creating photorealistic renders',
    },
];
export function AIGenerationProgress({ orderId, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [startTime] = useState(Date.now());
    const [elapsedMinutes, setElapsedMinutes] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    // Subscribe to order status changes
    useEffect(() => {
        const channel = supabase
            .channel(`order-${orderId}`)
            .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`,
        }, (payload) => {
            const newStatus = payload.new.ai_generation_status;
            if (newStatus === 'ready' || newStatus === 'completed') {
                setIsComplete(true);
                setCurrentStep(GENERATION_STEPS.length);
                setProgress(100);
                setShowConfetti(true);
                setTimeout(() => {
                    onComplete?.();
                }, 2000);
            }
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId, onComplete]);
    // Simulate progress for UX
    useEffect(() => {
        if (isComplete)
            return;
        const stepDuration = 25000; // 25 seconds per step on average
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const targetProgress = Math.min(((currentStep + 1) / GENERATION_STEPS.length) * 100, 95);
                const increment = 0.5;
                return Math.min(prev + increment, targetProgress);
            });
        }, 500);
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < GENERATION_STEPS.length - 1 && !isComplete) {
                    return prev + 1;
                }
                return prev;
            });
        }, stepDuration);
        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, [currentStep, isComplete]);
    // Track elapsed time
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedMinutes(Math.floor((Date.now() - startTime) / 60000));
        }, 10000);
        return () => clearInterval(timer);
    }, [startTime]);
    return (<Card className="p-6 md:p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl">
              🎉
            </motion.div>
          </motion.div>)}
      </AnimatePresence>

      <div className="text-center mb-8">
        <motion.div animate={{ rotate: isComplete ? 0 : 360 }} transition={{ duration: 2, repeat: isComplete ? 0 : Infinity, ease: 'linear' }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          {isComplete ? (<CheckCircle2 className="h-8 w-8 text-success"/>) : (<Sparkles className="h-8 w-8 text-primary"/>)}
        </motion.div>

        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          {isComplete ? 'Your Design is Ready! 🎨' : 'Creating Your Design...'}
        </h2>
        <p className="text-muted-foreground">
          {isComplete
            ? 'Click below to explore your personalized design'
            : 'Our AI is crafting a personalized interior design just for you'}
        </p>

        {/* Timer */}
        {!isComplete && (<div className="flex items-center justify-center gap-2 mt-4">
            <Clock className="h-4 w-4 text-muted-foreground"/>
            <span className="text-sm text-muted-foreground">
              {elapsedMinutes < 1
                ? 'Just started'
                : `${elapsedMinutes} min elapsed`}
              {' • '}
              Typically takes 2-5 minutes
            </span>
          </div>)}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3"/>
      </div>

      {/* Steps Checklist */}
      <div className="space-y-3">
        {GENERATION_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep && !isComplete;
            const isDone = index < currentStep || isComplete;
            return (<motion.div key={step.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${isActive
                    ? 'bg-primary/10 border border-primary/30'
                    : isDone
                        ? 'bg-success/5'
                        : 'bg-muted/30'}`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isDone
                    ? 'bg-success/20'
                    : isActive
                        ? 'bg-primary/20'
                        : 'bg-muted'}`}>
                {isDone ? (<CheckCircle2 className="h-5 w-5 text-success"/>) : isActive ? (<Loader2 className="h-5 w-5 text-primary animate-spin"/>) : (<Icon className="h-5 w-5 text-muted-foreground"/>)}
              </div>

              <div className="flex-1">
                <p className={`font-medium ${isDone
                    ? 'text-success'
                    : isActive
                        ? 'text-primary'
                        : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {isActive && (<Badge variant="secondary" className="bg-primary/20 text-primary">
                  In Progress
                </Badge>)}
            </motion.div>);
        })}
      </div>

      {/* Timeout warning */}
      {elapsedMinutes >= 10 && !isComplete && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <p className="text-sm text-warning font-medium">
            Taking longer than usual... 
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Don't worry, your design is still being created. You'll receive an email notification when it's ready.
          </p>
        </motion.div>)}
    </Card>);
}
