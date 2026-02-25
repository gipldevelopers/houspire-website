import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
// Fake social proof data - in production, this would come from analytics
const SOCIAL_PROOF_DATA = {
    // Styles
    modern_minimalist: 4234,
    contemporary: 3156,
    scandinavian: 5421,
    industrial: 2890,
    bohemian: 3678,
    mid_century: 2134,
    traditional_indian: 4567,
    rustic: 1890,
    coastal: 2345,
    maximalist: 1567,
    art_deco: 1234,
    japanese_zen: 2890,
    // Colors
    neutral_whites: 5678,
    warm_earth: 4321,
    cool_grays: 3456,
    navy_blues: 2890,
    sage_green: 4123,
    blush_pink: 2567,
    mustard_gold: 1890,
    terracotta: 2345,
    charcoal_black: 1678,
    coastal_blues: 3012,
    jewel_tones: 2134,
    monochrome: 1456,
    // Vibes
    calm_peaceful: 6234,
    energetic_vibrant: 3456,
    cozy_warm: 5678,
    sophisticated_elegant: 4123,
    creative_artistic: 2890,
    fresh_modern: 4567,
    // Budgets
    budget_friendly: 4567,
    mid_range: 6789,
    premium: 2345,
    // Room types
    living_room: 7890,
    bedroom: 6543,
    dining_room: 3456,
    home_office: 4567,
    kids_room: 2345,
    full_home: 5678,
};
export function getSocialProofCount(optionId) {
    return SOCIAL_PROOF_DATA[optionId] || Math.floor(Math.random() * 3000) + 1000;
}
export function formatCount(count) {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
}
export function QuizSocialProof({ count, label, className = '' }) {
    return (<motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
      <Users className="h-3 w-3"/>
      <span>{formatCount(count)} {label}</span>
    </motion.div>);
}
// Inline badge for cards
export function SocialProofBadge({ optionId }) {
    const count = getSocialProofCount(optionId);
    return (<div className="flex items-center gap-1 text-[10px] text-white/70 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
      <Users className="h-2.5 w-2.5"/>
      <span>{formatCount(count)} chose this</span>
    </div>);
}
