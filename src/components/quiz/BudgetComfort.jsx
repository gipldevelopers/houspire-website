import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Info, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSocialProofCount, formatCount } from './QuizSocialProof';
import { useQuizKeyboardShortcuts, KeyboardShortcutHint } from '@/hooks/useQuizKeyboardShortcuts';
const budgetOptions = [
    {
        id: 'budget_friendly',
        name: 'Budget-Friendly',
        range: '₹50,000 - ₹1,50,000',
        icon: '💰',
        description: 'Smart choices without compromising style',
        features: [
            'Value-focused selections',
            'Mix of affordable & investment pieces',
            'Creative cost-saving solutions',
            'Local vendor recommendations',
        ],
    },
    {
        id: 'mid_range',
        name: 'Mid-Range',
        range: '₹1,50,000 - ₹3,50,000',
        icon: '✨',
        description: 'Balance of quality and value',
        features: [
            'Quality branded furniture',
            'Durable materials',
            'Good mix of custom & ready-made',
            'Trusted vendor network',
        ],
        popular: true,
    },
    {
        id: 'premium',
        name: 'Premium',
        range: '₹3,50,000+',
        icon: '💎',
        description: 'Luxury finishes and custom pieces',
        features: [
            'High-end designer furniture',
            'Custom-made pieces',
            'Premium materials & finishes',
            'White-glove service',
        ],
    },
];
export function BudgetComfort({ answers, onNext, onBack }) {
    const [selected, setSelected] = useState(answers.budget || '');
    const handleContinue = useCallback(() => {
        if (!selected) {
            return;
        }
        onNext({ budget: selected });
    }, [selected, onNext]);
    // Keyboard shortcuts
    useQuizKeyboardShortcuts({
        onNext: handleContinue,
        onBack: onBack || (() => { }),
        onSelectOption: (index) => {
            if (index < budgetOptions.length) {
                setSelected(budgetOptions[index].id);
            }
        },
        canContinue: !!selected,
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
    return (<div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight">
          What's your budget range?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-xl mx-auto">
          For furniture and decor (excluding labor & renovation)
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Info className="h-4 w-4"/>
          Our ₹999 design fee is separate from your budget
        </motion.p>
      </div>

      {/* Budget Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {budgetOptions.map((option) => {
            const isSelected = selected === option.id;
            return (<motion.button key={option.id} type="button" variants={itemVariants} onClick={() => setSelected(option.id)} className={`
                relative rounded-2xl border-2 overflow-hidden text-left
                transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground
                ${isSelected
                    ? 'border-foreground shadow-xl scale-[1.02]'
                    : 'border-border hover:border-foreground/30 hover:shadow-lg bg-card'}
              `}>
              {/* Popular Badge */}
              {option.popular && (<div className="absolute top-0 right-0">
                  <div className="bg-foreground text-background text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                </div>)}

              {/* Header */}
              <div className={`p-5 md:p-6 ${isSelected ? 'bg-foreground text-background' : 'bg-muted'}`}>
                <p className="text-3xl md:text-4xl mb-3">{option.icon}</p>
                <h3 className="font-bold text-lg md:text-xl">
                  {option.name}
                </h3>
                <p className={`text-base md:text-lg font-semibold mt-1 ${isSelected ? 'text-background/90' : 'text-foreground'}`}>
                  {option.range}
                </p>
                <p className={`text-sm mt-2 ${isSelected ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {option.description}
                </p>
              </div>

              {/* Check Icon */}
              {isSelected && (<div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                  <Check className="h-4 w-4 text-foreground"/>
                </div>)}

              {/* Features */}
              <div className="p-5 md:p-6 bg-card">
                <ul className="space-y-2.5">
                  {option.features.map((feature, featureIdx) => (<li key={featureIdx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${isSelected ? 'bg-foreground' : 'bg-muted'}`}>
                        <Check className={`h-3 w-3 ${isSelected ? 'text-background' : 'text-muted-foreground'}`}/>
                      </div>
                      <span className="text-sm text-foreground">
                        {feature}
                      </span>
                    </li>))}
                </ul>

                {/* Social Proof */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                  <Users className="h-3 w-3"/>
                  <span>{formatCount(getSocialProofCount(option.id))} chose this</span>
                </div>
              </div>
            </motion.button>);
        })}
      </motion.div>

      {/* Additional Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-muted/30 rounded-2xl p-5 md:p-6 border border-border/50">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          💡 Budget Planning Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">📊</span>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Transparent Breakdown:</span> You'll get an itemized budget with no hidden markups
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🛍️</span>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Flexible Options:</span> We'll show alternatives at different price points
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💰</span>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">No Commission:</span> We don't take cuts from vendors - you save money
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🔄</span>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Adjust Anytime:</span> You can always modify your budget during the process
            </p>
          </div>
        </div>
      </motion.div>

      {/* Continue Button */}
      <div className="flex justify-between items-center pt-4">
        {onBack && (<Button variant="outline" size="lg" onClick={onBack} className="rounded-full">
            Back
          </Button>)}
        <div className="ml-auto flex items-center gap-4">
          <KeyboardShortcutHint shortcut="Enter" label="to continue"/>
          <Button size="lg" className="group rounded-full bg-foreground text-background hover:bg-foreground/90" disabled={!selected} onClick={handleContinue}>
            Continue
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
          </Button>
        </div>
      </div>
    </div>);
}
