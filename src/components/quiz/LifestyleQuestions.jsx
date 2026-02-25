import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuizKeyboardShortcuts, KeyboardShortcutHint } from '@/hooks/useQuizKeyboardShortcuts';
const entertainingOptions = [
    { id: 'never', label: 'Rarely/Never', icon: '🏠', description: 'Private sanctuary' },
    { id: 'occasionally', label: 'Occasionally', icon: '🎉', description: '1-2 times a month' },
    { id: 'regularly', label: 'Regularly', icon: '🍽️', description: 'Weekly gatherings' },
    { id: 'frequently', label: 'Very Often', icon: '👥', description: 'Multiple times a week' },
];
const concernOptions = [
    { id: 'easy_clean', label: 'Easy to clean', icon: '🧹' },
    { id: 'pet_friendly', label: 'Pet-friendly materials', icon: '🐕' },
    { id: 'kid_safe', label: 'Child-safe design', icon: '👶' },
    { id: 'durable', label: 'High durability', icon: '💪' },
    { id: 'stain_resistant', label: 'Stain-resistant', icon: '☕' },
    { id: 'hypoallergenic', label: 'Hypoallergenic', icon: '🌿' },
    { id: 'sound_proof', label: 'Sound dampening', icon: '🔇' },
    { id: 'storage', label: 'Ample storage', icon: '📦' },
];
export function LifestyleQuestions({ answers, onNext, onBack }) {
    const existingLifestyle = answers.lifestyle;
    const [value, setValue] = useState({
        has_kids: existingLifestyle?.has_kids || false,
        has_pets: existingLifestyle?.has_pets || false,
        work_from_home: existingLifestyle?.work_from_home || false,
        entertaining_frequency: existingLifestyle?.entertaining_frequency || '',
        concerns: existingLifestyle?.concerns || [],
    });
    const toggleBoolean = useCallback((key) => {
        setValue(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    }, []);
    const selectFrequency = useCallback((frequency) => {
        setValue(prev => ({
            ...prev,
            entertaining_frequency: frequency,
        }));
    }, []);
    const toggleConcern = useCallback((concern) => {
        setValue(prev => {
            if (prev.concerns.includes(concern)) {
                return {
                    ...prev,
                    concerns: prev.concerns.filter(c => c !== concern),
                };
            }
            else {
                return {
                    ...prev,
                    concerns: [...prev.concerns, concern],
                };
            }
        });
    }, []);
    const handleContinue = useCallback(() => {
        if (!value.entertaining_frequency) {
            return;
        }
        onNext({ lifestyle: value });
    }, [value, onNext]);
    const canContinue = value.entertaining_frequency !== '';
    // Keyboard shortcuts
    useQuizKeyboardShortcuts({
        onNext: handleContinue,
        onBack: onBack || (() => { }),
        canContinue,
    });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
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
    return (<div className="max-w-3xl mx-auto space-y-4">
      {/* Compact Header */}
      <div className="text-center space-y-1">
        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
          Your lifestyle
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm text-muted-foreground">
          We'll design for how you actually live
        </motion.p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {/* Compact Yes/No Row */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="font-medium text-sm text-foreground">Your household:</h3>
          <div className="flex flex-wrap gap-2">
            {[
            { key: 'has_kids', icon: '👶', label: 'Children' },
            { key: 'has_pets', icon: '🐕', label: 'Pets' },
            { key: 'work_from_home', icon: '💼', label: 'WFH' },
        ].map((item) => (<button key={item.key} type="button" onClick={() => toggleBoolean(item.key)} className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200
                  ${value[item.key]
                ? 'border-foreground bg-foreground text-background'
                : 'border-border hover:border-foreground/40 bg-card'}
                `}>
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {value[item.key] && <Check className="h-3.5 w-3.5"/>}
              </button>))}
          </div>
        </motion.div>

        {/* Entertaining - Compact */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="font-medium text-sm text-foreground">How often do you entertain?</h3>
          <div className="grid grid-cols-4 gap-2">
            {entertainingOptions.map((option) => (<button key={option.id} type="button" onClick={() => selectFrequency(option.id)} className={`
                  p-2.5 rounded-lg border transition-all duration-200 text-center
                  ${value.entertaining_frequency === option.id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border hover:border-foreground/40 bg-card'}
                `}>
                <p className="text-lg mb-0.5">{option.icon}</p>
                <p className="font-medium text-xs">{option.label}</p>
              </button>))}
          </div>
        </motion.div>

        {/* Concerns - Compact Chips */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-foreground">Practical needs (optional)</h3>
            {value.concerns.length > 0 && (<Badge variant="secondary" className="text-xs">{value.concerns.length}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {concernOptions.map((concern) => {
            const isSelected = value.concerns.includes(concern.id);
            return (<button key={concern.id} type="button" onClick={() => toggleConcern(concern.id)} className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-200
                    ${isSelected
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground/40 bg-card'}
                  `}>
                  <span>{concern.icon}</span>
                  <span className="font-medium">{concern.label}</span>
                </button>);
        })}
          </div>
        </motion.div>
      </motion.div>

      {/* Continue Button */}
      <div className="flex justify-between items-center pt-2">
        {onBack && (<Button variant="outline" size="lg" onClick={onBack} className="rounded-full">
            Back
          </Button>)}
        <div className="ml-auto flex items-center gap-4">
          <KeyboardShortcutHint shortcut="Enter" label="to continue"/>
          <Button size="lg" className="group rounded-full bg-foreground text-background hover:bg-foreground/90" disabled={!canContinue} onClick={handleContinue}>
            Continue
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
          </Button>
        </div>
      </div>
    </div>);
}
