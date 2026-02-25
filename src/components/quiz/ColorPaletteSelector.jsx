import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSocialProofCount, formatCount } from './QuizSocialProof';
import { useQuizKeyboardShortcuts, KeyboardShortcutHint } from '@/hooks/useQuizKeyboardShortcuts';
const COLOR_PALETTES = [
    {
        id: 'neutral_whites',
        name: 'Neutral Whites',
        colors: ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#D4D4D4', '#A3A3A3'],
        mood: 'Clean, timeless, versatile',
    },
    {
        id: 'warm_earth',
        name: 'Warm Earth Tones',
        colors: ['#8B7355', '#A0826D', '#C19A6B', '#D4A76A', '#E8C5A0'],
        mood: 'Cozy, natural, grounded',
    },
    {
        id: 'cool_grays',
        name: 'Cool Grays',
        colors: ['#4A5568', '#718096', '#A0AEC0', '#CBD5E0', '#E2E8F0'],
        mood: 'Modern, sophisticated, calm',
    },
    {
        id: 'navy_blues',
        name: 'Navy & Blues',
        colors: ['#1A365D', '#2C5282', '#2B6CB0', '#3182CE', '#4299E1'],
        mood: 'Deep, elegant, trustworthy',
    },
    {
        id: 'sage_green',
        name: 'Sage & Greens',
        colors: ['#3D5A3C', '#5C7C5B', '#7A9B79', '#9BB899', '#BDD4BC'],
        mood: 'Fresh, calming, natural',
    },
    {
        id: 'blush_pink',
        name: 'Blush & Pinks',
        colors: ['#8B6B7A', '#A57E92', '#C197A8', '#D8ADB9', '#EFC3CA'],
        mood: 'Soft, romantic, feminine',
    },
    {
        id: 'mustard_gold',
        name: 'Mustard & Golds',
        colors: ['#7C6A2C', '#9B8A3D', '#C2A854', '#D9BC6C', '#EDD089'],
        mood: 'Bold, warm, energetic',
    },
    {
        id: 'terracotta',
        name: 'Terracotta & Rust',
        colors: ['#7D4E3B', '#A0623F', '#C17A4B', '#D99768', '#EDB488'],
        mood: 'Earthy, rich, bohemian',
    },
    {
        id: 'charcoal_black',
        name: 'Charcoal & Black',
        colors: ['#1A1A1A', '#2D2D2D', '#404040', '#525252', '#737373'],
        mood: 'Dramatic, bold, modern',
    },
    {
        id: 'coastal_blues',
        name: 'Coastal Blues',
        colors: ['#4A7C9E', '#5E9FBF', '#7CBDD6', '#A5D4E5', '#C9E7F2'],
        mood: 'Breezy, fresh, relaxed',
    },
    {
        id: 'jewel_tones',
        name: 'Jewel Tones',
        colors: ['#4A1C40', '#6B3A5C', '#8B5A7D', '#AB7A9E', '#CB9ABF'],
        mood: 'Rich, luxurious, vibrant',
    },
    {
        id: 'monochrome',
        name: 'Pure Monochrome',
        colors: ['#000000', '#333333', '#666666', '#999999', '#FFFFFF'],
        mood: 'Classic, striking, minimal',
    },
];
export function ColorPaletteSelector({ answers, onNext, onBack }) {
    const [selected, setSelected] = useState(answers.colors || []);
    const maxSelection = 2;
    const togglePalette = useCallback((paletteId) => {
        if (selected.includes(paletteId)) {
            setSelected(selected.filter(id => id !== paletteId));
        }
        else {
            if (selected.length < maxSelection) {
                setSelected([...selected, paletteId]);
            }
        }
    }, [selected, maxSelection]);
    const handleContinue = useCallback(() => {
        if (selected.length === 0) {
            return;
        }
        onNext({ colors: selected });
    }, [selected, onNext]);
    const isDisabled = (paletteId) => {
        return !selected.includes(paletteId) && selected.length >= maxSelection;
    };
    // Keyboard shortcuts
    useQuizKeyboardShortcuts({
        onNext: handleContinue,
        onBack: onBack || (() => { }),
        onSelectOption: (index) => {
            if (index < COLOR_PALETTES.length) {
                const palette = COLOR_PALETTES[index];
                if (!isDisabled(palette.id)) {
                    togglePalette(palette.id);
                }
            }
        },
        canContinue: selected.length > 0,
    });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03 }
        }
    };
    return (<div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight">
          What color palette speaks to you?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-xl mx-auto">
          Choose up to 2 color palettes you love
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Badge variant={selected.length > 0 ? 'default' : 'outline'} className={`text-sm px-4 py-1.5 transition-all ${selected.length > 0
            ? 'bg-foreground text-background'
            : ''}`}>
            {selected.length} / {maxSelection} selected
          </Badge>
        </motion.div>
      </div>

      {/* Palette Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {COLOR_PALETTES.map((palette, index) => {
            const isSelected = selected.includes(palette.id);
            const disabled = isDisabled(palette.id);
            return (<motion.button key={palette.id} type="button" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.03, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} onClick={() => !disabled && togglePalette(palette.id)} disabled={disabled} className={`
                relative p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left
                focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground
                ${isSelected
                    ? 'border-foreground bg-muted/50 shadow-lg scale-[1.02]'
                    : disabled
                        ? 'border-border opacity-40 cursor-not-allowed'
                        : 'border-border hover:border-foreground/30 hover:shadow-lg bg-card'}
              `}>
              {/* Selection Indicator */}
              {isSelected && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                  <Check className="h-4 w-4 text-background"/>
                </motion.div>)}

              {/* Color Swatches */}
              <div className="flex rounded-xl overflow-hidden h-14 md:h-16 mb-4 shadow-inner">
                {palette.colors.map((color, colorIdx) => (<div key={colorIdx} className="flex-1 transition-transform duration-300" style={{ backgroundColor: color }}/>))}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-semibold text-foreground text-sm md:text-base">
                  {palette.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">
                  {palette.mood}
                </p>
                {/* Social Proof */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Users className="h-3 w-3"/>
                  <span>{formatCount(getSocialProofCount(palette.id))} chose this</span>
                </div>
              </div>
            </motion.button>);
        })}
      </motion.div>

      {/* Helper Text */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
        <p className="text-muted-foreground text-sm bg-muted/30 py-3 px-6 rounded-full inline-block backdrop-blur-sm">
          💡 These palettes will guide your designer, but they'll add their expertise too!
        </p>
      </motion.div>

      {/* Continue Button */}
      <div className="flex justify-between items-center pt-4">
        {onBack && (<Button variant="outline" size="lg" onClick={onBack} className="rounded-full">
            Back
          </Button>)}
        <div className="ml-auto flex items-center gap-4">
          <KeyboardShortcutHint shortcut="Enter" label="to continue"/>
          <Button size="lg" className="group rounded-full bg-foreground text-background hover:bg-foreground/90" disabled={selected.length === 0} onClick={handleContinue}>
            Continue
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
          </Button>
        </div>
      </div>
    </div>);
}
