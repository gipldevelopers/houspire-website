import { motion } from 'framer-motion';
import { Sparkles, Palette, Heart, Brain, Home, Wallet, DoorOpen, Trophy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
const STEP_ICONS = [
    Sparkles, // Intro
    Palette, // Styles
    Palette, // Colors
    Heart, // Vibe
    Brain, // Personality
    Home, // Lifestyle
    Wallet, // Budget
    DoorOpen, // Room Type
    Trophy, // Results
];
export function QuizStepIndicator({ currentStep, totalSteps, stepTitles }) {
    // Show steps 1-7 (exclude intro and results)
    const visibleSteps = stepTitles.slice(1, -1);
    const visibleIcons = STEP_ICONS.slice(1, -1);
    const adjustedCurrent = currentStep - 1; // Adjust for intro
    const progress = (adjustedCurrent / (visibleSteps.length - 1)) * 100;
    return (<div className="hidden md:flex flex-col items-center gap-3">
      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.max(progress, 5)}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}/>
        </div>
      </div>

      {/* Step Pills */}
      <div className="flex items-center justify-center gap-1">
        {visibleSteps.map((title, idx) => {
            const Icon = visibleIcons[idx];
            const isCompleted = adjustedCurrent > idx;
            const isCurrent = adjustedCurrent === idx;
            const isUpcoming = adjustedCurrent < idx;
            return (<div key={title} className="flex items-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: idx * 0.03 }} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300', isCompleted && 'bg-primary/10', isCurrent && 'bg-primary text-primary-foreground shadow-lg shadow-primary/20', isUpcoming && 'bg-muted/50')}>
                {/* Icon or Check */}
                {isCompleted ? (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                    <Check className="h-3.5 w-3.5 text-primary"/>
                  </motion.div>) : (<Icon className={cn('h-3.5 w-3.5', isCurrent ? 'text-primary-foreground' : 'text-muted-foreground')}/>)}

                {/* Title - only show for current and completed */}
                {(isCurrent || isCompleted) && (<motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} className={cn('text-xs font-medium whitespace-nowrap overflow-hidden', isCurrent ? 'text-primary-foreground' : 'text-primary')}>
                    {title}
                  </motion.span>)}
              </motion.div>
            </div>);
        })}
      </div>
    </div>);
}
// Mobile version - progress bar with step count
export function QuizStepIndicatorMobile({ currentStep, totalSteps }) {
    const visibleSteps = totalSteps - 2; // Exclude intro and results
    const adjustedCurrent = currentStep - 1;
    const progress = (adjustedCurrent / (visibleSteps - 1)) * 100;
    return (<div className="flex md:hidden flex-col items-center gap-2 w-full max-w-[200px]">
      {/* Step counter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-foreground">
          Step {Math.min(adjustedCurrent + 1, visibleSteps)}
        </span>
        <span className="text-muted-foreground">of {visibleSteps}</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.max(progress, 8)}%` }} transition={{ duration: 0.4, ease: 'easeOut' }}/>
      </div>
    </div>);
}
