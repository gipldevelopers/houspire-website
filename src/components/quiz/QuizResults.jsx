import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowRight, Share2, Download, Palette, Heart, Home, Loader2, Shield, Clock, Gift, Sparkles, Eye, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { appDataClient } from '@/lib/static-client';
import { QuickAuthForm } from '@/components/auth/QuickAuthForm';
import jsPDF from 'jspdf';
// Style data mapping
const STYLE_DATA = {
    modern_minimalist: {
        slug: 'modern-minimalist',
        name: 'Modern Minimalist',
        description: 'Clean lines, neutral palettes, and purposeful design create spaces that breathe.',
        coverImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Clean geometric lines', 'Neutral color base', 'Hidden storage', 'Statement lighting'],
        designerCount: 8,
        projectsCompleted: 320,
        avgRating: 4.9,
    },
    contemporary: {
        slug: 'contemporary',
        name: 'Contemporary',
        description: 'Current trends meet timeless appeal for sophisticated modern living.',
        coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1617335767631-e409ad9d479b?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Sleek finishes', 'Open floor plans', 'Mix of textures', 'Bold accents'],
        designerCount: 6,
        projectsCompleted: 280,
        avgRating: 4.8,
    },
    scandinavian: {
        slug: 'scandinavian',
        name: 'Scandinavian',
        description: 'Light, airy spaces with natural materials and hygge comfort.',
        coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1617325252241-d130a8c14620?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Natural light focus', 'Light wood tones', 'Cozy textiles', 'Functional beauty'],
        designerCount: 5,
        projectsCompleted: 190,
        avgRating: 4.9,
    },
    traditional_indian: {
        slug: 'traditional-indian',
        name: 'Traditional Indian',
        description: 'Rich heritage, ornate details, and cultural warmth in every corner.',
        coverImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Handcrafted textiles', 'Brass & copper accents', 'Carved woodwork', 'Vibrant colors'],
        designerCount: 7,
        projectsCompleted: 350,
        avgRating: 4.8,
    },
    bohemian: {
        slug: 'bohemian',
        name: 'Bohemian',
        description: 'Eclectic, colorful, and full of artistic self-expression.',
        coverImage: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Layered patterns', 'Global influences', 'Plants everywhere', 'Collected treasures'],
        designerCount: 4,
        projectsCompleted: 150,
        avgRating: 4.7,
    },
    industrial: {
        slug: 'industrial',
        name: 'Industrial',
        description: 'Raw materials, urban edge, and artisanal character.',
        coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1515542706656-8e6ef17a1521?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Exposed brick', 'Metal accents', 'Edison lighting', 'Open ductwork'],
        designerCount: 3,
        projectsCompleted: 120,
        avgRating: 4.8,
    },
    coastal: {
        slug: 'coastal',
        name: 'Coastal',
        description: 'Relaxed beach vibes with ocean-inspired serenity.',
        coverImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Blue & white palette', 'Natural fibers', 'Light woods', 'Indoor-outdoor flow'],
        designerCount: 4,
        projectsCompleted: 140,
        avgRating: 4.9,
    },
    art_deco: {
        slug: 'art-deco',
        name: 'Art Deco',
        description: 'Glamorous geometry, luxe materials, and bold sophistication.',
        coverImage: 'https://images.unsplash.com/photo-1600494603989-9650cf6dbc4b?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Geometric patterns', 'Gold & brass', 'Velvet textures', 'Statement mirrors'],
        designerCount: 3,
        projectsCompleted: 95,
        avgRating: 4.9,
    },
    japanese_zen: {
        slug: 'japanese-zen',
        name: 'Japanese Zen',
        description: 'Peaceful simplicity, natural balance, and mindful spaces.',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Wabi-sabi aesthetic', 'Natural materials', 'Minimal furniture', 'Indoor gardens'],
        designerCount: 2,
        projectsCompleted: 75,
        avgRating: 4.9,
    },
    maximalist: {
        slug: 'maximalist',
        name: 'Maximalist',
        description: 'Bold expression, curated abundance, and fearless color.',
        coverImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Pattern mixing', 'Rich colors', 'Gallery walls', 'Eclectic collections'],
        designerCount: 3,
        projectsCompleted: 85,
        avgRating: 4.7,
    },
    rustic: {
        slug: 'rustic-farmhouse',
        name: 'Rustic Farmhouse',
        description: 'Natural warmth, vintage character, and countryside charm.',
        coverImage: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1617335767631-e409ad9d479b?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Reclaimed wood', 'Farmhouse sinks', 'Vintage finds', 'Natural stone'],
        designerCount: 4,
        projectsCompleted: 160,
        avgRating: 4.8,
    },
    mid_century: {
        slug: 'mid-century-modern',
        name: 'Mid-Century Modern',
        description: 'Retro 50s-60s charm with iconic furniture and organic forms.',
        coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop',
        roomImages: {
            living: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
            bedroom: 'https://images.unsplash.com/photo-1617335767631-e409ad9d479b?w=800&h=600&fit=crop',
            kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        },
        keyFeatures: ['Iconic furniture', 'Organic curves', 'Bold colors', 'Teak & walnut'],
        designerCount: 4,
        projectsCompleted: 130,
        avgRating: 4.8,
    },
};
// Weighted style matching algorithm
// Weights: Style prefs 30%, Colors 15%, Vibe 15%, Personality 20%, Lifestyle 10%, Budget 10%
function calculateStyleMatches(answers) {
    const styleScores = {};
    Object.keys(STYLE_DATA).forEach(s => { styleScores[s] = 0; });
    // --- Step 1: Style Preferences (30 pts max) ---
    const relatedStyles = {
        modern_minimalist: ['contemporary', 'scandinavian', 'japanese_zen'],
        contemporary: ['modern_minimalist', 'mid_century'],
        scandinavian: ['modern_minimalist', 'japanese_zen', 'coastal'],
        traditional_indian: ['maximalist', 'art_deco'],
        bohemian: ['maximalist', 'rustic', 'mid_century'],
        industrial: ['modern_minimalist', 'contemporary', 'mid_century'],
        coastal: ['scandinavian', 'rustic'],
        art_deco: ['maximalist', 'traditional_indian', 'contemporary'],
        japanese_zen: ['modern_minimalist', 'scandinavian'],
        maximalist: ['bohemian', 'art_deco', 'traditional_indian'],
        rustic: ['bohemian', 'coastal', 'traditional_indian'],
        mid_century: ['contemporary', 'industrial', 'scandinavian'],
    };
    const oppositeStyles = {
        modern_minimalist: ['traditional_indian', 'maximalist', 'bohemian'],
        scandinavian: ['maximalist', 'art_deco'],
        traditional_indian: ['modern_minimalist', 'industrial', 'japanese_zen'],
        maximalist: ['modern_minimalist', 'scandinavian', 'japanese_zen'],
        industrial: ['traditional_indian', 'coastal'],
        japanese_zen: ['maximalist', 'bohemian', 'art_deco'],
    };
    if (answers.styles?.length) {
        answers.styles.forEach((style, idx) => {
            if (styleScores[style] !== undefined) {
                // MASSIVE WEIGHT for explicit choices (100 for primary, 50 for secondary)
                styleScores[style] += idx === 0 ? 100 : 50; 
            }
            // Related styles bonus
            relatedStyles[style]?.forEach(r => {
                if (styleScores[r] !== undefined)
                    styleScores[r] += idx === 0 ? 25 : 12;
            });
            // Opposite styles penalty
            oppositeStyles[style]?.forEach(o => {
                if (styleScores[o] !== undefined)
                    styleScores[o] -= 8;
            });
        });
    }
    // --- Step 2: Color Palette (15 pts max) ---
    const colorStyleMap = {
        neutrals: { scandinavian: 15, modern_minimalist: 15, japanese_zen: 10 },
        warm_earth: { traditional_indian: 15, bohemian: 15, rustic: 10 },
        cool_blues: { coastal: 15, contemporary: 15, scandinavian: 8 },
        bold_jewel: { maximalist: 15, art_deco: 15, traditional_indian: 8 },
        pastels: { scandinavian: 12, coastal: 12, contemporary: 8 },
        monochrome: { industrial: 15, modern_minimalist: 15, contemporary: 8 },
    };
    answers.colors?.forEach(color => {
        const boosts = colorStyleMap[color];
        if (boosts) {
            Object.entries(boosts).forEach(([s, pts]) => {
                if (styleScores[s] !== undefined)
                    styleScores[s] += pts;
            });
        }
    });
    // --- Step 3: Room Vibe (15 pts max) ---
    const vibeMap = {
        calm: { scandinavian: 15, japanese_zen: 15, modern_minimalist: 12 },
        energetic: { maximalist: 15, bohemian: 12, art_deco: 12 },
        cozy: { traditional_indian: 15, rustic: 15, scandinavian: 10 },
        sophisticated: { art_deco: 15, contemporary: 15, modern_minimalist: 10 },
        playful: { bohemian: 15, maximalist: 12, mid_century: 12 },
        serene: { japanese_zen: 15, modern_minimalist: 15, scandinavian: 10 },
    };
    if (answers.vibe && vibeMap[answers.vibe]) {
        Object.entries(vibeMap[answers.vibe]).forEach(([s, pts]) => {
            if (styleScores[s] !== undefined)
                styleScores[s] += pts;
        });
    }
    // --- Step 4: Personality (20 pts max) ---
    if (answers.personality) {
        const org = answers.personality.organization;
        if (org === 'minimalist') {
            styleScores.modern_minimalist += 12;
            styleScores.scandinavian += 10;
            styleScores.japanese_zen += 10;
        }
        else if (org === 'collected' || org === 'maximalist') {
            styleScores.maximalist += 12;
            styleScores.bohemian += 10;
            styleScores.art_deco += 8;
        }
        else if (org === 'balanced') {
            styleScores.contemporary += 8;
            styleScores.mid_century += 8;
            styleScores.coastal += 6;
        }
        const patterns = answers.personality.patterns;
        if (patterns === 'bold') {
            styleScores.maximalist += 10;
            styleScores.art_deco += 10;
            styleScores.bohemian += 8;
        }
        else if (patterns === 'minimal' || patterns === 'subtle') {
            styleScores.modern_minimalist += 10;
            styleScores.scandinavian += 8;
            styleScores.japanese_zen += 8;
        }
        else if (patterns === 'geometric') {
            styleScores.art_deco += 10;
            styleScores.mid_century += 8;
            styleScores.contemporary += 6;
        }
        const texture = answers.personality.texture;
        if (texture === 'smooth') {
            styleScores.modern_minimalist += 6;
            styleScores.contemporary += 6;
        }
        else if (texture === 'natural' || texture === 'organic') {
            styleScores.rustic += 8;
            styleScores.bohemian += 6;
            styleScores.scandinavian += 6;
        }
        else if (texture === 'luxurious') {
            styleScores.art_deco += 8;
            styleScores.traditional_indian += 6;
        }
    }
    // --- Step 5: Lifestyle (10 pts max) ---
    if (answers.lifestyle) {
        const priorities = answers.lifestyle.priorities;
        if (Array.isArray(priorities)) {
            if (priorities.includes('kids') || priorities.includes('children')) {
                styleScores.contemporary += 6;
                styleScores.scandinavian += 5;
                styleScores.rustic += 4;
            }
            if (priorities.includes('pets')) {
                styleScores.modern_minimalist += 5;
                styleScores.contemporary += 5;
                styleScores.industrial += 4;
            }
            if (priorities.includes('wfh') || priorities.includes('work_from_home')) {
                styleScores.scandinavian += 6;
                styleScores.industrial += 5;
                styleScores.modern_minimalist += 5;
            }
            if (priorities.includes('entertaining') || priorities.includes('hosting')) {
                styleScores.art_deco += 6;
                styleScores.maximalist += 5;
                styleScores.contemporary += 5;
            }
        }
    }
    // --- Step 6: Budget (10 pts max) ---
    const budgetMap = {
        budget_conscious: { scandinavian: 10, modern_minimalist: 8, industrial: 8 },
        mid_range: { contemporary: 10, mid_century: 8, coastal: 8, bohemian: 6 },
        premium: { art_deco: 10, traditional_indian: 8, maximalist: 6 },
        luxury: { art_deco: 10, traditional_indian: 10, contemporary: 6 },
    };
    if (answers.budget && budgetMap[answers.budget]) {
        Object.entries(budgetMap[answers.budget]).forEach(([s, pts]) => {
            if (styleScores[s] !== undefined)
                styleScores[s] += pts;
        });
    }
    // --- Normalize & convert ---
    // Clamp negatives to 0
    Object.keys(styleScores).forEach(k => { styleScores[k] = Math.max(0, styleScores[k]); });
    const maxRaw = Math.max(...Object.values(styleScores), 1);
    // Sort by score descending
    const sorted = Object.entries(styleScores)
        .sort(([, a], [, b]) => b - a);
    // Assign percentages: top match 78-95%, others scaled proportionally, minimum 18%
    // Add small seeded variation to break ties
    const results = sorted.slice(0, 4).map(([styleId, score], index) => {
        const styleData = STYLE_DATA[styleId];
        if (!styleData)
            return null;
        let pct;
        if (index === 0) {
            // Primary: scale to 78-95 range
            pct = 78 + Math.round((score / maxRaw) * 17);
        }
        else {
            // Others: scale proportionally relative to primary
            const ratio = score / maxRaw;
            pct = Math.round(ratio * 80); // max ~80% for secondary
            pct = Math.max(pct, 18); // floor at 18%
        }
        // Small deterministic variation to avoid ties (±2)
        const variation = ((styleId.charCodeAt(0) + styleId.charCodeAt(styleId.length - 1)) % 5) - 2;
        pct = Math.min(Math.max(pct + variation, 15), 98);
        return { ...styleData, matchPercentage: pct };
    }).filter(Boolean);
    // Ensure no duplicates and descending order
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    // Ensure unique percentages
    for (let i = 1; i < results.length; i++) {
        if (results[i].matchPercentage >= results[i - 1].matchPercentage) {
            results[i].matchPercentage = results[i - 1].matchPercentage - (2 + (i % 3));
        }
    }
    return results;
}
export function QuizResults({ answers }) {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedStyleSlug, setSelectedStyleSlug] = useState('');
    const [savingQuiz, setSavingQuiz] = useState(false);
    const [styleMatches, setStyleMatches] = useState([]);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [shareState, setShareState] = useState('idle');
    const handleSaveAsPdf = useCallback(async () => {
        if (!styleMatches.length)
            return;
        setGeneratingPdf(true);
        try {
            const doc = new jsPDF();
            const primary = styleMatches[0];
            const alts = styleMatches.slice(1, 4);
            // Header
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text('houspire.ai', 160, 15);
            doc.setFontSize(24);
            doc.setTextColor(30);
            doc.text('Your Style Quiz Results', 20, 30);
            doc.setDrawColor(200);
            doc.line(20, 34, 190, 34);
            // Primary match
            doc.setFontSize(14);
            doc.setTextColor(80);
            doc.text('Your Best Match', 20, 48);
            doc.setFontSize(20);
            doc.setTextColor(30);
            doc.text(`${primary.name} — ${primary.matchPercentage}%`, 20, 58);
            doc.setFontSize(11);
            doc.setTextColor(100);
            const descLines = doc.splitTextToSize(primary.description, 170);
            doc.text(descLines, 20, 68);
            doc.setFontSize(11);
            doc.setTextColor(80);
            doc.text('Key Characteristics:', 20, 82);
            primary.keyFeatures.forEach((f, i) => {
                doc.text(`• ${f}`, 25, 90 + i * 7);
            });
            // Alternative matches
            let y = 90 + primary.keyFeatures.length * 7 + 10;
            doc.setFontSize(14);
            doc.setTextColor(80);
            doc.text('Alternative Matches', 20, y);
            y += 10;
            alts.forEach(style => {
                doc.setFontSize(12);
                doc.setTextColor(30);
                doc.text(`${style.name} — ${style.matchPercentage}%`, 20, y);
                y += 7;
                doc.setFontSize(10);
                doc.setTextColor(100);
                const lines = doc.splitTextToSize(style.description, 170);
                doc.text(lines, 20, y);
                y += lines.length * 6 + 6;
            });
            // Style DNA
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(14);
            doc.setTextColor(80);
            doc.text('Your Style DNA', 20, y);
            y += 10;
            doc.setFontSize(11);
            doc.setTextColor(60);
            if (answers.vibe)
                doc.text(`Vibe: ${answers.vibe}`, 20, y);
            y += 7;
            if (answers.colors?.length)
                doc.text(`Colors: ${answers.colors.join(', ')}`, 20, y);
            y += 7;
            if (answers.budget)
                doc.text(`Budget: ${answers.budget.replace(/_/g, ' ')}`, 20, y);
            y += 14;
            // Footer
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text('Generated by Houspire — houspire.ai', 20, 285);
            doc.save('Houspire_Style_Results.pdf');
            toast({ title: 'PDF downloaded! 📄', description: 'Your style results have been saved.' });
        }
        catch (err) {
            console.error('PDF generation error:', err);
            toast({ title: 'Failed to generate PDF', variant: 'destructive' });
        }
        finally {
            setGeneratingPdf(false);
        }
    }, [styleMatches, answers, toast]);
    const handleShareResults = useCallback(async () => {
        const primary = styleMatches[0];
        if (!primary)
            return;
        const shareText = `I just discovered my interior design style on Houspire! My top match is ${primary.name} at ${primary.matchPercentage}%. Take the free quiz to find yours!`;
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'My Houspire Style Quiz Results', text: shareText, url: shareUrl });
                return;
            }
            catch { }
        }
        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            setShareState('copied');
            toast({ title: 'Copied to clipboard! 📋' });
            setTimeout(() => setShareState('idle'), 2000);
        }
        catch {
            toast({ title: 'Could not copy', variant: 'destructive' });
        }
    }, [styleMatches, toast]);
    // Calculate style matches on mount
    useEffect(() => {
        const matches = calculateStyleMatches(answers);
        setStyleMatches(matches);
        // Save to localStorage
        const quizDataForStorage = {
            styles: answers.styles || [],
            colors: answers.colors || [],
            vibe: answers.vibe || '',
            personality: answers.personality || {},
            lifestyle: answers.lifestyle || {},
            budget: answers.budget || 'mid_range',
            room_type: answers.room_type || '',
            matched_styles: matches.map(m => m.slug),
            primary_style: matches[0]?.slug || '',
            completed_at: new Date().toISOString(),
        };
        localStorage.setItem('pendingQuizResults', JSON.stringify(quizDataForStorage));
    }, [answers]);
    const primaryStyle = styleMatches[0];
    const alternativeStyles = styleMatches.slice(1, 4);
    const handleExploreStyle = async (styleSlug) => {
        setSelectedStyleSlug(styleSlug);
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        await saveQuizAndProceed(styleSlug);
    };
    const saveQuizAndProceed = async (styleSlug) => {
        setSavingQuiz(true);
        try {
            const storedQuiz = localStorage.getItem('pendingQuizResults');
            if (!storedQuiz) {
                throw new Error('Quiz data not found');
            }
            const quizData = JSON.parse(storedQuiz);
            if (user) {
                const { error } = await appDataClient
                    .from('quiz_results')
                    .upsert({
                    user_id: user.id,
                    styles: quizData.styles,
                    colors: quizData.colors,
                    vibe: quizData.vibe,
                    personality: quizData.personality,
                    lifestyle: quizData.lifestyle,
                    budget: quizData.budget,
                    primary_designer: styleSlug, // Store style slug instead
                    all_matches: quizData.matched_styles,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
                if (error) {
                    console.error('Database save error:', error);
                }
                localStorage.removeItem('pendingQuizResults');
                toast({
                    title: 'Style Profile Saved! ✅',
                    description: 'Your preferences are saved to your account',
                });
            }
            router.push(`/styles/${styleSlug}`);
        }
        catch (error) {
            console.error('Error saving quiz:', error);
            router.push(`/styles/${styleSlug}`);
        }
        finally {
            setSavingQuiz(false);
        }
    };
    const handleLoginSuccess = async () => {
        setShowLoginModal(false);
        await new Promise(resolve => setTimeout(resolve, 500));
        await saveQuizAndProceed(selectedStyleSlug);
    };
    const styleNames = answers.styles?.map((id) => id.replace(/_/g, ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) || [];
    if (styleMatches.length === 0) {
        return (<div className="text-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/>
        <p className="mt-4 text-muted-foreground">Analyzing your style preferences...</p>
      </div>);
    }
    return (<div className="space-y-10 max-w-5xl mx-auto px-4 pt-20 md:pt-28 pb-16">
      {/* Hero Preview Image with Style Overlay */}
      {primaryStyle && (<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
          <img src={primaryStyle.coverImage} alt={primaryStyle.name} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"/>
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10">
            <Badge className="bg-primary text-primary-foreground mb-3">
              <Sparkles className="h-3 w-3 mr-1"/>
              Your Style Match
            </Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
              {primaryStyle.name}
            </h1>
            <p className="text-4xl md:text-6xl font-bold text-white/90 mt-1">
              {primaryStyle.matchPercentage}% Match
            </p>
          </div>
        </motion.div>)}

      {/* Primary Style Match - Hero Card */}
      {primaryStyle && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
            <div className="grid md:grid-cols-2">
              {/* Image Side */}
              <div className="relative aspect-[4/3] md:aspect-auto">
                <img src={primaryStyle.coverImage} alt={primaryStyle.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1.5 text-sm shadow-lg">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5"/>
                    Best Match
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white">
                    <div className="text-4xl font-bold">{primaryStyle.matchPercentage}%</div>
                    <div className="text-sm opacity-80">style match</div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {primaryStyle.name}
                    </h2>
                    <p className="text-muted-foreground">
                      {primaryStyle.description}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Key Characteristics</h4>
                    <div className="flex flex-wrap gap-2">
                      {primaryStyle.keyFeatures.map((feature, i) => (<Badge key={i} variant="secondary" className="rounded-full">
                          {feature}
                        </Badge>))}
                    </div>
                  </div>

                  {/* Style info */}
                  <div className="grid grid-cols-2 gap-4 py-4 bg-muted/30 rounded-xl px-4">
                    <div className="text-center">
                      <p className="font-bold text-foreground">{primaryStyle.keyFeatures.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Key Features</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground">{alternativeStyles.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Alternative Styles</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-3 pt-4">
                  <Button size="lg" className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20" onClick={() => handleExploreStyle(primaryStyle.slug)} disabled={savingQuiz && selectedStyleSlug === primaryStyle.slug}>
                    {savingQuiz && selectedStyleSlug === primaryStyle.slug ? (<>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin"/>
                        Saving...
                      </>) : (<>
                        Explore {primaryStyle.name}
                        <ArrowRight className="ml-2 h-5 w-5"/>
                      </>)}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Meet the team, see portfolio & book consultation
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>)}

      {/* Imagine Your Room */}
      {primaryStyle && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="space-y-4">
          <h3 className="text-xl font-semibold text-center text-foreground">
            Here's what your home could look like
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'living', name: 'Living Room' },
              { id: 'bedroom', name: 'Bedroom' },
              { id: 'kitchen', name: 'Kitchen' }
            ].map((room) => {
              // Get the specific room image from STYLE_DATA or fallback to cover
              const roomUrl = primaryStyle.roomImages?.[room.id] || primaryStyle.coverImage;
              
              return (
                <div key={room.id} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <img 
                    src={roomUrl} 
                    alt={`${room.name} in ${primaryStyle.name} style`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <div className="absolute bottom-2 left-3">
                    <span className="text-[10px] md:text-xs font-medium text-white/90 uppercase tracking-wider">{room.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-center text-muted-foreground">
            These are real designs from our portfolio. Your personalized report includes concepts designed specifically for YOUR space.
          </p>
        </motion.div>)}

      {/* Strong CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-background to-accent/5 border-primary/20 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Get Your Personalized Home Design Report
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Starting at ₹499 • Delivered in 72 hours
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={() => router.push('/select-package')} className="w-full sm:w-auto min-w-[260px] h-14 text-lg rounded-xl">
              Get Your Home Design Report
              <ArrowRight className="ml-2 h-5 w-5"/>
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/report-preview')}>
              See Sample Report
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Alternative Style Matches */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-muted-foreground">
          Also Great For You
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {alternativeStyles.map((style, index) => (<motion.div key={style.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => handleExploreStyle(style.slug)}>
                <div className="relative aspect-[16/10]">
                  <img src={style.coverImage} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">{style.name}</h4>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {style.matchPercentage}%
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {style.description}
                  </p>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
                    <Eye className="h-4 w-4 mr-2"/>
                    View Style
                  </Button>
                </div>
              </Card>
            </motion.div>))}
        </div>
      </motion.div>

      {/* Style Profile Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Your Style DNA</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-5 w-5 text-primary"/>
                <span className="font-medium text-foreground">Preferred Styles</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {styleNames.map((style, index) => (<Badge key={index} variant="secondary">{style}</Badge>))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-primary"/>
                <span className="font-medium text-foreground">Your Vibe</span>
              </div>
              <Badge variant="outline" className="text-base">
                {answers.vibe === 'calm' && '🧘 Calm & Peaceful'}
                {answers.vibe === 'energetic' && '⚡ Energetic & Vibrant'}
                {answers.vibe === 'cozy' && '☕ Cozy & Warm'}
                {answers.vibe === 'sophisticated' && '✨ Sophisticated'}
                {answers.vibe === 'playful' && '🎨 Playful & Fun'}
                {answers.vibe === 'serene' && '🌿 Serene & Minimal'}
              </Badge>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Home className="h-5 w-5 text-primary"/>
                <span className="font-medium text-foreground">Color Palette</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {answers.colors?.map((color, index) => (<Badge key={index} variant="outline">
                    {color.replace(/_/g, ' ')}
                  </Badge>))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Share/Save */}
      <div className="flex flex-col items-center gap-4 pb-8">
        <div className="flex justify-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleShareResults} disabled={shareState === 'copied'}>
            {shareState === 'copied' ? (<>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500"/>
                Copied!
              </>) : (<>
                <Share2 className="h-4 w-4 mr-2"/>
                Share Results
              </>)}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSaveAsPdf} disabled={generatingPdf}>
            {generatingPdf ? (<>
                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                Generating...
              </>) : (<>
                <Download className="h-4 w-4 mr-2"/>
                Save as PDF
              </>)}
          </Button>
        </div>
        {/* WhatsApp + Copy Link */}
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => {
            const text = `I just discovered my interior design style on Houspire! My top match is ${primaryStyle?.name} at ${primaryStyle?.matchPercentage}%. Take the free quiz to find yours!`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + window.location.href)}`, '_blank');
        }}>
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: 'Link copied! 🔗' });
        }}>
            <Copy className="h-4 w-4 mr-2"/>
            Copy Link
          </Button>
        </div>
      </div>

      {/* Login/Signup Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Save Your Style Profile 🎨</DialogTitle>
            <DialogDescription className="text-center">
              Create your free account to save your results and explore your matched style
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-primary flex-shrink-0"/>
              <span>Your style profile will be saved permanently</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-5 w-5 text-primary flex-shrink-0"/>
              <span>Access your results anytime</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Gift className="h-5 w-5 text-primary flex-shrink-0"/>
              <span>Get personalized design recommendations</span>
            </div>
          </div>

          <QuickAuthForm onSuccess={handleLoginSuccess}/>

          <Button variant="ghost" className="w-full mt-2" onClick={() => {
            setShowLoginModal(false);
            router.push(`/styles/${selectedStyleSlug}`);
        }}>
            Continue without saving
          </Button>
        </DialogContent>
      </Dialog>
    </div>);
}

