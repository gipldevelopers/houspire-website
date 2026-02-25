import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
export function TourTooltip({ title, content, currentStep, totalSteps, onNext, onPrev, onSkip, onFinish, position, placement = 'bottom', }) {
    const isFirst = currentStep === 0;
    const isLast = currentStep === totalSteps - 1;
    const getPosition = () => {
        const offset = 20;
        switch (placement) {
            case 'top':
                return { top: position.top - offset - 200, left: position.left - 160 };
            case 'bottom':
                return { top: position.top + offset + 20, left: position.left - 160 };
            case 'left':
                return { top: position.top - 100, left: position.left - offset - 340 };
            case 'right':
                return { top: position.top - 100, left: position.left + offset + 20 };
            default:
                return { top: position.top + 20, left: position.left - 160 };
        }
    };
    const pos = getPosition();
    return (<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{
            position: 'fixed',
            top: Math.max(20, Math.min(pos.top, window.innerHeight - 250)),
            left: Math.max(20, Math.min(pos.left, window.innerWidth - 340)),
            zIndex: 100,
        }} className="w-80">
      <Card className="bg-card border-border shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {title}
              </h3>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: totalSteps }).map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`}/>))}
              </div>
            </div>

            <button onClick={onSkip} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <X className="h-4 w-4"/>
            </button>
          </div>

          {/* Content */}
          <p className="text-muted-foreground text-sm mb-4">{content}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} of {totalSteps}
            </span>

            <div className="flex gap-2">
              {!isFirst && (<Button onClick={onPrev} variant="ghost" size="sm" className="h-9">
                  <ArrowLeft className="h-4 w-4 mr-1"/>
                  Back
                </Button>)}

              {isLast ? (<Button onClick={onFinish} size="sm" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-1"/>
                </Button>) : (<Button onClick={onNext} size="sm" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
                  Next
                  <ArrowRight className="h-4 w-4 ml-1"/>
                </Button>)}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>);
}
