import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuizKeyboardShortcuts, KeyboardShortcutHint } from '@/hooks/useQuizKeyboardShortcuts';
const QUESTIONS = [
    {
        key: 'organized',
        question: 'How do you prefer to organize your space?',
        left: {
            label: 'Everything has its place',
            icon: '📦',
            description: 'Neat, organized, minimalist',
        },
        right: {
            label: 'Curated collected items',
            icon: '🎨',
            description: 'Eclectic, display-focused',
        },
    },
    {
        key: 'experimental',
        question: 'How adventurous are you with design?',
        left: {
            label: 'Timeless & safe',
            icon: '🏛️',
            description: 'Classic choices, proven styles',
        },
        right: {
            label: 'Bold & trendy',
            icon: '🚀',
            description: 'Experimental, trend-forward',
        },
    },
    {
        key: 'display',
        question: 'What do you want to showcase?',
        left: {
            label: 'Clean surfaces',
            icon: '✨',
            description: 'Minimal decor, functional',
        },
        right: {
            label: 'Personal treasures',
            icon: '🖼️',
            description: 'Art, books, collections',
        },
    },
    {
        key: 'priority',
        question: 'What matters most to you?',
        left: {
            label: 'Practicality first',
            icon: '🛋️',
            description: 'Function over form',
        },
        right: {
            label: 'Beauty first',
            icon: '💫',
            description: 'Aesthetics over everything',
        },
    },
];
export function PersonalityQuestions({ answers, onNext, onBack }) {
    const [value, setValue] = useState({
        organized: 50,
        experimental: 50,
        display: 50,
        priority: 50,
        ...(answers.personality || {}),
    });
    const updateSlider = useCallback((key, newValue) => {
        setValue(prev => ({
            ...prev,
            [key]: newValue[0],
        }));
    }, []);
    const handleContinue = useCallback(() => {
        // Convert numeric values to string labels for storage
        const personalityStrings = {};
        Object.entries(value).forEach(([key, val]) => {
            if (val < 40) {
                personalityStrings[key] = 'low';
            }
            else if (val > 60) {
                personalityStrings[key] = 'high';
            }
            else {
                personalityStrings[key] = 'medium';
            }
        });
        onNext({ personality: personalityStrings });
    }, [value, onNext]);
    // Keyboard shortcuts
    useQuizKeyboardShortcuts({
        onNext: handleContinue,
        onBack: onBack || (() => { }),
        canContinue: true,
    });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
        }
    };
    return (<div className="max-w-2xl mx-auto space-y-4">
      {/* Compact Header */}
      <div className="text-center space-y-1">
        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
          Your design personality
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm text-muted-foreground">
          Slide to what feels right
        </motion.p>
      </div>

      {/* Compact Question Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2.5">
        {QUESTIONS.map((q) => {
            const currentValue = value[q.key];
            return (<motion.div key={q.key} variants={itemVariants} className="bg-card border border-border rounded-xl px-4 py-3 space-y-2">
              {/* Question with inline icons */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-base">{q.left.icon}</span>
                <h3 className="font-medium text-sm text-foreground text-center flex-1">
                  {q.question}
                </h3>
                <span className="text-base">{q.right.icon}</span>
              </div>

              {/* Slider */}
              <Slider value={[currentValue]} onValueChange={(val) => updateSlider(q.key, val)} max={100} step={1} className="w-full"/>

              {/* Inline Labels */}
              <div className="flex justify-between text-xs">
                <span className={`transition-colors ${currentValue < 40 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {q.left.label}
                </span>
                <span className={`transition-colors ${currentValue > 60 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {q.right.label}
                </span>
              </div>
            </motion.div>);
        })}
      </motion.div>

      {/* Continue Button */}
      <div className="flex justify-between items-center pt-2">
        {onBack && (<Button variant="outline" size="lg" onClick={onBack} className="rounded-full">
            Back
          </Button>)}
        <div className="ml-auto flex items-center gap-4">
          <KeyboardShortcutHint shortcut="Enter" label="to continue"/>
          <Button size="lg" className="group rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={handleContinue}>
            Continue
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
          </Button>
        </div>
      </div>
    </div>);
}
