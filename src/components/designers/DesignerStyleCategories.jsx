import { motion } from 'framer-motion';
import { Sparkles, Home, Leaf, Palette, Mountain, Waves, Crown, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
// Map specialty names to icons
const iconMap = {
    'Modern Minimalist': Home,
    'Traditional Indian': Crown,
    'Contemporary Fusion': Palette,
    'Bohemian Eclectic': Leaf,
    'Scandinavian Coastal': Waves,
    'Luxury Art Deco': Gem,
    'Industrial': Mountain,
};
// Default categories for fallback
const defaultCategories = [
    { id: 'all', label: 'All Designers', icon: Sparkles },
    { id: 'Modern Minimalist', label: 'Minimalist', icon: Home },
    { id: 'Traditional Indian', label: 'Traditional', icon: Crown },
    { id: 'Contemporary Fusion', label: 'Contemporary', icon: Palette },
    { id: 'Bohemian Eclectic', label: 'Bohemian', icon: Leaf },
    { id: 'Scandinavian Coastal', label: 'Coastal', icon: Waves },
    { id: 'Luxury Art Deco', label: 'Art Deco', icon: Gem },
];
export function DesignerStyleCategories({ activeCategory, onCategoryChange, specialties }) {
    // Build categories from database specialties or use defaults
    const categories = useMemo(() => {
        if (!specialties || specialties.length === 0) {
            return defaultCategories;
        }
        const dynamicCategories = [
            { id: 'all', label: 'All Designers', icon: Sparkles },
            ...specialties.slice(0, 7).map(specialty => ({
                id: specialty,
                label: specialty.split(' ').pop() || specialty, // Get last word for short label
                icon: iconMap[specialty] || Palette,
            }))
        ];
        return dynamicCategories;
    }, [specialties]);
    return (<div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex items-center gap-3 px-1 min-w-max">
        {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (<motion.button key={category.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => onCategoryChange(category.id)} className={cn('flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap', isActive
                    ? 'bg-foreground text-background shadow-lg'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground')}>
              <Icon className="w-4 h-4"/>
              {category.label}
            </motion.button>);
        })}
      </div>
    </div>);
}
