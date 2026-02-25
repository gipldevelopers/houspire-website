import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TourTooltip } from './TourTooltip';
import { useTour } from '@/hooks/useTour';
export function Tour({ tourId, steps }) {
    const { isActive, currentStep, targetPosition, currentStepData, totalSteps, next, prev, skip, finish, } = useTour(tourId, steps);
    // Add CSS for tour highlight
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'tour-styles';
        style.textContent = `
      .tour-highlight {
        position: relative;
        z-index: 99 !important;
        box-shadow: 0 0 0 4px hsl(var(--primary) / 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5) !important;
        border-radius: 8px;
      }
    `;
        if (!document.getElementById('tour-styles')) {
            document.head.appendChild(style);
        }
        return () => {
            const existingStyle = document.getElementById('tour-styles');
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);
    if (!isActive || !currentStepData)
        return null;
    return (<AnimatePresence>
      <TourTooltip title={currentStepData.title} content={currentStepData.content} currentStep={currentStep} totalSteps={totalSteps} onNext={next} onPrev={prev} onSkip={skip} onFinish={finish} position={targetPosition} placement={currentStepData.placement}/>
    </AnimatePresence>);
}
