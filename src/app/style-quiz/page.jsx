'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { useQuizSession } from '@/hooks/useQuizSession';

// Import Modular Quiz Components
import { QuizIntro } from '@/components/quiz/QuizIntro';
import { StyleImageSelector } from '@/components/quiz/StyleImageSelector';
import { ColorPaletteSelector } from '@/components/quiz/ColorPaletteSelector';
import { RoomVibeSelector } from '@/components/quiz/RoomVibeSelector';
import { PersonalityQuestions } from '@/components/quiz/PersonalityQuestions';
import { LifestyleQuestions } from '@/components/quiz/LifestyleQuestions';
import { BudgetComfort } from '@/components/quiz/BudgetComfort';
import { QuizStep7_RoomType } from '@/components/quiz/QuizStep7_RoomType';
import { QuizResults } from '@/components/quiz/QuizResults';
import { QuizStepIndicator, QuizStepIndicatorMobile } from '@/components/quiz/QuizStepIndicator';

const STEPS = [
  { id: 'intro', title: 'Welcome' },
  { id: 'styles', title: 'Styles' },
  { id: 'colors', title: 'Colors' },
  { id: 'vibe', title: 'Vibe' },
  { id: 'personality', title: 'Personality' },
  { id: 'lifestyle', title: 'Lifestyle' },
  { id: 'budget', title: 'Budget' },
  { id: 'room', title: 'Room' },
  { id: 'results', title: 'Results' },
];

export default function StyleQuizPage() {
  const router = useRouter();
  const { 
    session, 
    loading, 
    saveProgress, 
    completeSession, 
    initialStep, 
    initialAnswers 
  } = useQuizSession();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from session
  useEffect(() => {
    if (!loading && !isInitialized) {
      setStep(initialStep);
      setAnswers(initialAnswers);
      setIsInitialized(true);
    }
  }, [loading, initialStep, initialAnswers, isInitialized]);

  const handleNext = useCallback(async (payload = {}) => {
    const nextAnswers = { ...answers, ...payload };
    setAnswers(nextAnswers);
    
    const nextStep = step + 1;
    if (nextStep < STEPS.length) {
      setStep(nextStep);
      await saveProgress(nextStep, nextAnswers);
    }
    
    if (STEPS[nextStep]?.id === 'results') {
      await completeSession();
    }
  }, [answers, step, saveProgress, completeSession]);

  const handleBack = useCallback(async () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      await saveProgress(prevStep, answers);
    }
  }, [step, answers, saveProgress]);

  const stepTitles = useMemo(() => STEPS.map(s => s.title), []);
  const isIntroOrResults = step === 0 || step === STEPS.length - 1;

  const renderStep = () => {
    switch (STEPS[step].id) {
      case 'intro':
        return <QuizIntro onNext={handleNext} />;
      case 'styles':
        return <StyleImageSelector answers={answers} onNext={handleNext} onBack={handleBack} />;
      case 'colors':
        return <ColorPaletteSelector answers={answers} onNext={handleNext} onBack={handleBack} />;
      case 'vibe':
        return <RoomVibeSelector answers={answers} onNext={handleNext} onBack={handleBack} />;
      case 'personality':
        return <PersonalityQuestions answers={answers} onNext={handleNext} onBack={handleBack} />;
      case 'lifestyle':
        return <LifestyleQuestions answers={answers} onNext={handleNext} onBack={handleBack} />;
      case 'budget':
        return <BudgetComfort answers={answers} onNext={handleNext} onBack={handleBack} />;
      case 'room':
        return <QuizStep7_RoomType answers={answers} onNext={handleNext} onBack={handleBack} />;
      case 'results':
        return <QuizResults answers={answers} onReset={() => setStep(0)} />;
      default:
        return <QuizIntro onNext={handleNext} />;
    }
  };

  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Setting up your design session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Sticky Header - Improved Spacing */}
      <AnimatePresence>
        {!isIntroOrResults && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40"
          >
            <Container>
              <div className="h-14 md:h-16 flex items-center justify-between gap-4">
                {/* Back Button - Sleeker */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all px-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>

                {/* Progress Indicator - Centered */}
                <div className="flex-1 flex justify-center max-w-xl">
                  <QuizStepIndicator 
                    currentStep={step} 
                    totalSteps={STEPS.length} 
                    stepTitles={stepTitles} 
                  />
                  <QuizStepIndicatorMobile 
                    currentStep={step} 
                    totalSteps={STEPS.length} 
                  />
                </div>

                {/* Close/Exit */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8 text-muted-foreground"
                  onClick={() => router.push('/')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Container>
          </motion.header>
        )}
      </AnimatePresence>

      <main className={`relative ${!isIntroOrResults ? 'py-6 md:py-10' : ''}`}>
        <Container>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </Container>

        {/* Decorative background elements - Reduced opacity to keep focus on quiz */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
        </div>
      </main>

      {/* Footer social proof - only on quiz steps */}
      {!isIntroOrResults && (
        <footer className="py-8 md:py-12 border-t border-border/50 bg-muted/20">
          <Container>
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Matching you with the perfect designer</span>
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-sm font-bold tracking-widest uppercase">Verified Designers</span>
                <span className="text-sm font-bold tracking-widest uppercase">AI-Optimized</span>
                <span className="text-sm font-bold tracking-widest uppercase">Premium Styles</span>
              </div>
            </div>
          </Container>
        </footer>
      )}
    </div>
  );
}


