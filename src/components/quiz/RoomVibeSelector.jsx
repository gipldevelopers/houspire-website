import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSocialProofCount, formatCount } from './QuizSocialProof';
import { useQuizKeyboardShortcuts, KeyboardShortcutHint } from '@/hooks/useQuizKeyboardShortcuts';
const VIBE_OPTIONS = [
    {
        id: 'calm_peaceful',
        name: 'Calm & Peaceful',
        emoji: '🧘',
        description: 'A serene sanctuary for relaxation',
        keywords: ['Zen', 'Tranquil', 'Soothing', 'Meditative'],
        image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&q=80',
    },
    {
        id: 'energetic_vibrant',
        name: 'Energetic & Vibrant',
        emoji: '⚡',
        description: 'Bold, lively, full of personality',
        keywords: ['Dynamic', 'Colorful', 'Exciting', 'Playful'],
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop&q=80',
    },
    {
        id: 'cozy_warm',
        name: 'Cozy & Warm',
        emoji: '🔥',
        description: 'Inviting comfort and homely warmth',
        keywords: ['Comforting', 'Inviting', 'Snug', 'Homely'],
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
    },
    {
        id: 'sophisticated_elegant',
        name: 'Sophisticated & Elegant',
        emoji: '💎',
        description: 'Refined luxury with timeless appeal',
        keywords: ['Refined', 'Luxurious', 'Polished', 'Chic'],
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop&q=80',
    },
    {
        id: 'creative_artistic',
        name: 'Creative & Artistic',
        emoji: '🎨',
        description: 'Express your unique personality',
        keywords: ['Expressive', 'Eclectic', 'Unique', 'Inspired'],
        image: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?w=800&h=600&fit=crop&q=80',
    },
    {
        id: 'fresh_modern',
        name: 'Fresh & Modern',
        emoji: '✨',
        description: 'Clean, contemporary, forward-thinking',
        keywords: ['Sleek', 'Minimal', 'Current', 'Streamlined'],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80',
    },
];
export function RoomVibeSelector({ answers, onNext, onBack }) {
    const [selected, setSelected] = useState(answers.vibe || '');
    const handleContinue = useCallback(() => {
        if (!selected) {
            return;
        }
        onNext({ vibe: selected });
    }, [selected, onNext]);
    // Keyboard shortcuts
    useQuizKeyboardShortcuts({
        onNext: handleContinue,
        onBack: onBack || (() => { }),
        onSelectOption: (index) => {
            if (index < VIBE_OPTIONS.length) {
                setSelected(VIBE_OPTIONS[index].id);
            }
        },
        canContinue: !!selected,
    });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };
    return (<div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight">
          What vibe do you want your space to have?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-xl mx-auto">
          Choose the overall mood and feeling
        </motion.p>
      </div>

      {/* Vibes Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {VIBE_OPTIONS.map((vibe, idx) => {
            const isSelected = selected === vibe.id;
            return (<motion.button key={vibe.id} type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} onClick={() => setSelected(vibe.id)} className={`
                relative rounded-2xl overflow-hidden group text-left
                transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground
                ${isSelected
                    ? 'ring-2 ring-foreground scale-[1.02] shadow-xl'
                    : 'hover:scale-[1.02] hover:shadow-xl'}
              `}>
              {/* Background Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={vibe.image} alt={vibe.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 transition-all duration-300 ${isSelected
                    ? 'bg-foreground/30'
                    : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'}`}/>

                {/* Check Icon */}
                {isSelected && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground flex items-center justify-center shadow-lg">
                    <Check className="h-4 w-4 text-background"/>
                  </motion.div>)}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Emoji */}
                  <div className="text-3xl mb-2">
                    {vibe.emoji}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white text-lg md:text-xl drop-shadow-md">
                    {vibe.name}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 text-sm mt-1 drop-shadow-md">
                    {vibe.description}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {vibe.keywords.map((keyword) => (<span key={keyword} className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90 backdrop-blur-sm">
                        {keyword}
                      </span>))}
                  </div>

                  {/* Social Proof */}
                  <div className="flex items-center gap-1 text-xs text-white/70 mt-2">
                    <Users className="h-3 w-3"/>
                    <span>{formatCount(getSocialProofCount(vibe.id))} chose this</span>
                  </div>
                </div>
              </div>
            </motion.button>);
        })}
      </motion.div>

      {/* Helper Text */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
        <p className="text-muted-foreground text-sm bg-muted/30 py-3 px-6 rounded-full inline-block backdrop-blur-sm">
          💡 This helps us match you with a designer who creates spaces that feel just right
        </p>
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
