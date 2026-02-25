import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialProofBadge } from './QuizSocialProof';
import { QuizImagePreview, useLongPress } from './QuizImagePreview';
import { useQuizKeyboardShortcuts, KeyboardShortcutHint } from '@/hooks/useQuizKeyboardShortcuts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
// Mapping from quiz IDs (underscores) to database slugs (hyphens)
const STYLE_SLUG_MAP = {
    modern_minimalist: 'modern-minimalist',
    contemporary: 'contemporary-fusion',
    scandinavian: 'scandinavian-hygge',
    industrial: 'industrial-urban',
    bohemian: 'bohemian-eclectic',
    mid_century: 'mid-century-modern',
    traditional_indian: 'traditional-indian',
    rustic: 'farmhouse-modern',
    coastal: 'coastal-tropical',
    maximalist: 'maximalist-eclectic',
    art_deco: 'art-deco-glamour',
    japanese_zen: 'japanese-zen',
};
const STYLE_OPTIONS = [
    {
        id: 'modern_minimalist',
        name: 'Modern Minimalist',
        description: 'Clean lines, neutral colors, clutter-free',
    },
    {
        id: 'contemporary',
        name: 'Contemporary',
        description: 'Current trends, sleek and sophisticated',
    },
    {
        id: 'scandinavian',
        name: 'Scandinavian',
        description: 'Light, natural, cozy hygge vibes',
    },
    {
        id: 'industrial',
        name: 'Industrial',
        description: 'Exposed brick, metal, raw materials',
    },
    {
        id: 'bohemian',
        name: 'Bohemian',
        description: 'Eclectic, colorful, artistic freedom',
    },
    {
        id: 'mid_century',
        name: 'Mid-Century Modern',
        description: 'Retro 50s-60s, iconic furniture pieces',
    },
    {
        id: 'traditional_indian',
        name: 'Traditional Indian',
        description: 'Rich heritage, ornate details, timeless',
    },
    {
        id: 'rustic',
        name: 'Rustic',
        description: 'Natural wood, warm, countryside charm',
    },
    {
        id: 'coastal',
        name: 'Coastal',
        description: 'Beach vibes, blues and whites, airy',
    },
    {
        id: 'maximalist',
        name: 'Maximalist',
        description: 'Bold patterns, rich colors, more is more',
    },
    {
        id: 'art_deco',
        name: 'Art Deco',
        description: 'Glamorous, geometric, luxurious',
    },
    {
        id: 'japanese_zen',
        name: 'Japanese Zen',
        description: 'Minimal, natural, peaceful tranquility',
    },
];
export function StyleImageSelector({ answers, onNext, onBack }) {
    const [selected, setSelected] = useState(answers.styles || []);
    const [previewStyle, setPreviewStyle] = useState(null);
    const maxSelection = 3;
    // Fetch cover images from database
    const { data: styleCovers } = useQuery({
        queryKey: ['design-style-covers'],
        queryFn: async () => {
            const { data } = await supabase
                .from('design_styles')
                .select('slug, cover_image_url');
            return data || [];
        },
        staleTime: 1000 * 60 * 30 // 30 minutes cache
    });
    // Get image URL for a style ID
    const getStyleImage = (styleId) => {
        const slug = STYLE_SLUG_MAP[styleId];
        if (!slug || !styleCovers)
            return null;
        const match = styleCovers.find(s => s.slug === slug);
        return match?.cover_image_url || null;
    };
    const toggleStyle = useCallback((styleId) => {
        if (selected.includes(styleId)) {
            setSelected(selected.filter(id => id !== styleId));
        }
        else {
            if (selected.length < maxSelection) {
                setSelected([...selected, styleId]);
            }
        }
    }, [selected, maxSelection]);
    const handleContinue = useCallback(() => {
        if (selected.length === 0) {
            return;
        }
        onNext({ styles: selected });
    }, [selected, onNext]);
    const getSelectionOrder = (styleId) => {
        return selected.indexOf(styleId) + 1;
    };
    // Keyboard shortcuts
    useQuizKeyboardShortcuts({
        onNext: handleContinue,
        onBack: onBack || (() => { }),
        onSelectOption: (index) => {
            if (index < STYLE_OPTIONS.length) {
                const style = STYLE_OPTIONS[index];
                if (!selected.includes(style.id) || selected.length < maxSelection) {
                    toggleStyle(style.id);
                }
            }
        },
        canContinue: selected.length > 0,
        isEnabled: !previewStyle,
    });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03 }
        }
    };
    return (<div className="max-w-6xl mx-auto space-y-8">
      {/* Image Preview Modal */}
      <QuizImagePreview image={previewStyle ? getStyleImage(previewStyle.id) : null} title={previewStyle?.name || ''} description={previewStyle?.description || ''} onClose={() => setPreviewStyle(null)}/>

      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight">
          Which styles resonate with you?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-xl mx-auto">
          Select up to 3 styles that match your aesthetic
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-3">
          <Badge variant={selected.length > 0 ? 'default' : 'outline'} className={`text-sm px-4 py-1.5 transition-all ${selected.length > 0
            ? 'bg-foreground text-background'
            : ''}`}>
            {selected.length} / {maxSelection} selected
          </Badge>
          <span className="text-xs text-muted-foreground hidden md:inline">
            Press 1-9 to quick select
          </span>
        </motion.div>
      </div>

      {/* Style Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {STYLE_OPTIONS.map((style, index) => {
            const isSelected = selected.includes(style.id);
            const isDisabled = !isSelected && selected.length >= maxSelection;
            const selectionOrder = getSelectionOrder(style.id);
            const imageUrl = getStyleImage(style.id);
            return (<StyleCard key={style.id} style={style} imageUrl={imageUrl} index={index} isSelected={isSelected} isDisabled={isDisabled} selectionOrder={selectionOrder} onToggle={() => !isDisabled && toggleStyle(style.id)} onPreview={() => setPreviewStyle(style)}/>);
        })}
      </motion.div>

      {/* Helper Text */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
        <p className="text-muted-foreground text-sm bg-muted/30 py-3 px-6 rounded-full inline-block backdrop-blur-sm">
          💡 Don't worry if you like multiple styles - our designers can blend them beautifully!
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
// Separate component for better performance
function StyleCard({ style, imageUrl, index, isSelected, isDisabled, selectionOrder, onToggle, onPreview, }) {
    const longPressHandlers = useLongPress(onPreview, 500);
    return (<motion.button type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} onClick={onToggle} disabled={isDisabled} {...longPressHandlers} className={`
        relative w-full group cursor-pointer rounded-2xl overflow-hidden text-left
        transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground
        ${isSelected
            ? 'ring-2 ring-foreground scale-[1.02] shadow-xl'
            : isDisabled
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:scale-[1.02] hover:shadow-xl'}
      `}>
      {/* Keyboard shortcut number */}
      {index < 9 && (<div className="absolute top-3 left-3 z-10 w-6 h-6 rounded-lg bg-black/40 text-white text-xs font-mono flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
          {index + 1}
        </div>)}

      {/* Quick preview button */}
      <button onClick={(e) => {
            e.stopPropagation();
            onPreview();
        }} className="absolute bottom-14 right-3 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" title="Quick preview">
        <ZoomIn className="h-4 w-4"/>
      </button>

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (<img src={imageUrl} alt={style.name} loading="lazy" className={`w-full h-full object-cover transition-transform duration-500 ${!isDisabled ? 'group-hover:scale-110' : ''}`} onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-muted', 'to-muted-foreground/20');
            }}/>) : (<div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <Skeleton className="w-full h-full"/>
          </div>)}
        
        {/* Dark Overlay */}
        <div className={`absolute inset-0 transition-all duration-300 ${isSelected
            ? 'bg-foreground/20'
            : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'}`}/>

        {/* Selection Order Badge */}
        {isSelected && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center shadow-lg">
            {selectionOrder}
          </motion.div>)}

        {/* Checkmark */}
        {isSelected && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground flex items-center justify-center shadow-lg">
            <Check className="h-4 w-4 text-background"/>
          </motion.div>)}

        {/* Social Proof */}
        <div className="absolute top-12 left-3">
          <SocialProofBadge optionId={style.id}/>
        </div>

        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white text-base md:text-lg drop-shadow-md">
            {style.name}
          </h3>
          <p className="text-white/80 text-xs md:text-sm mt-1 drop-shadow-md line-clamp-1">
            {style.description}
          </p>
        </div>
      </div>
    </motion.button>);
}
