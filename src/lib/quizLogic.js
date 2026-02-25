import { DESIGNER_PERSONAS, DESIGNER_SPECIALTIES } from './constants';
export function calculateDesignerMatch(answers) {
    const scores = [];
    DESIGNER_PERSONAS.forEach(designer => {
        let score = 0;
        const matchReasons = [];
        // 1. STYLE MATCH (40 points)
        if (answers.styles && answers.styles.length > 0) {
            const styleOverlap = answers.styles.filter(style => designer.signature_style.includes(style)).length;
            const styleScore = (styleOverlap / answers.styles.length) * 40;
            score += styleScore;
            if (styleScore > 20) {
                const matchedStyle = answers.styles.find(s => designer.signature_style.includes(s));
                if (matchedStyle) {
                    matchReasons.push(`Expert in ${matchedStyle.replace(/_/g, ' ')} style`);
                }
            }
        }
        // 2. COLOR PREFERENCE MATCH (20 points)
        if (answers.colors && answers.colors.length > 0) {
            const colorOverlap = answers.colors.filter(color => designer.color_preferences.includes(color)).length;
            const colorScore = (colorOverlap / answers.colors.length) * 20;
            score += colorScore;
            if (colorScore > 10) {
                matchReasons.push('Matches your color palette preferences');
            }
        }
        // 3. PERSONALITY MATCH (25 points)
        let personalityScore = 0;
        if (answers.personality) {
            const orgLevel = answers.personality.organization;
            if (designer.personality_match.organized === 'high' && orgLevel === 'minimalist') {
                personalityScore += 12;
                matchReasons.push('Shares your love for organized spaces');
            }
            else if (designer.personality_match.organized === 'low' && orgLevel === 'collected') {
                personalityScore += 12;
            }
            else {
                personalityScore += 6;
            }
            const expLevel = answers.personality.patterns;
            if (designer.personality_match.experimental === 'high' && expLevel === 'bold') {
                personalityScore += 13;
                matchReasons.push('Loves bold, experimental designs like you');
            }
            else if (designer.personality_match.experimental === 'low' && expLevel === 'minimal') {
                personalityScore += 13;
                matchReasons.push('Prefers timeless, classic designs');
            }
            else {
                personalityScore += 6;
            }
        }
        score += personalityScore;
        // 4. VIBE MATCH (10 points)
        const vibeMap = {
            calm: ['scandinavian', 'japanese_zen', 'coastal', 'modern_minimalist'],
            energetic: ['maximalist', 'bohemian', 'art_deco'],
            cozy: ['scandinavian', 'rustic', 'traditional_indian'],
            sophisticated: ['art_deco', 'contemporary', 'modern_minimalist'],
            playful: ['bohemian', 'maximalist', 'mid_century'],
            serene: ['modern_minimalist', 'scandinavian', 'japanese_zen'],
            natural: ['coastal', 'scandinavian', 'rustic', 'natural_organic'],
            romantic: ['bohemian', 'coastal', 'art_deco'],
        };
        if (answers.vibe) {
            const vibeStyles = vibeMap[answers.vibe] || [];
            const vibeMatch = designer.signature_style.some(style => vibeStyles.includes(style));
            if (vibeMatch) {
                score += 10;
                matchReasons.push(`Creates ${answers.vibe} spaces you\'ll love`);
            }
        }
        // 5. LIFESTYLE CONSIDERATIONS (5 points)
        if (answers.lifestyle) {
            const household = answers.lifestyle.household || [];
            if (household.includes('kids') || household.includes('pets')) {
                if (designer.signature_style.includes('modern_minimalist') ||
                    designer.signature_style.includes('contemporary') ||
                    designer.signature_style.includes('scandinavian')) {
                    score += 3;
                    matchReasons.push('Designs kid/pet-friendly spaces');
                }
            }
            if (answers.lifestyle.workFromHome === 'always' || answers.lifestyle.workFromHome === 'sometimes') {
                if (designer.signature_style.includes('contemporary') ||
                    designer.signature_style.includes('industrial') ||
                    designer.signature_style.includes('modern_minimalist')) {
                    score += 2;
                    matchReasons.push('Expert in home office design');
                }
            }
        }
        scores.push({ designer, score, matchReasons: matchReasons.slice(0, 4) });
    });
    // Sort by score
    scores.sort((a, b) => b.score - a.score);
    // Get top 3 designers
    const topDesigners = scores.slice(0, 3).map(item => ({
        ...item.designer,
        matchPercentage: Math.min(Math.round((item.score / 100) * 100), 98),
        matchReasons: item.matchReasons,
    }));
    const primaryDesigner = topDesigners[0];
    const styleProfile = generateStyleProfile(answers, primaryDesigner.id);
    const recommendations = generateRecommendations(answers, primaryDesigner.id);
    return {
        designer: primaryDesigner,
        matchPercentage: primaryDesigner.matchPercentage,
        styleProfile,
        recommendations,
        designers: topDesigners,
    };
}
function generateStyleProfile(answers, designerId) {
    const profiles = {
        priya_sharma: 'You appreciate clean aesthetics, functional design, and a clutter-free environment. Your style is sophisticated yet approachable.',
        karthik_reddy: 'You value technology-integrated spaces with smart solutions. Modern living with a tech-forward approach.',
        sneha_menon: 'You love warm minimalism - simple but not cold. Natural textures and inviting spaces define your taste.',
        arjun_patel: 'You value tradition and timeless elegance. Rich textures and meaningful pieces that tell stories.',
        lakshmi_iyer: 'You appreciate cultural heritage and handcrafted elements. Vastu-compliant designs with soul.',
        vikram_singh: 'You appreciate grandeur and opulence. Rich textures, intricate details, and meaningful heritage pieces define your taste.',
        meera_kapoor: 'You love vibrant spaces that tell a story. Eclectic taste blending different global influences.',
        rohan_desai: 'You appreciate industrial aesthetics with artisanal touches. Raw materials meet refined craftsmanship.',
        ananya_krishnan: 'You value sustainability and ethical sourcing. Natural materials and artisanal craftsmanship appeal to you.',
        neha_chatterjee: 'You embrace glamour and sophistication. Art Deco geometry, luxe materials, and bold statements define your style.',
        zara_khan: 'You embrace maximalism and self-expression. Bold patterns and collected treasures define your style.',
        kabir_malhotra: 'You see your home as a gallery. Curated art, collected treasures, and conversation pieces define your style.',
        maya_nair: 'You love light, airy spaces with Nordic influences. Coastal vibes and hygge comfort appeal to you.',
        aditya_verma: 'You love coastal living and natural serenity. Bleached woods, linen textures, and ocean-inspired palettes define your aesthetic.',
    };
    return profiles[designerId] || 'Your unique style combines multiple influences to create spaces that truly feel like home.';
}
function generateRecommendations(answers, designerId) {
    const recommendations = {
        priya_sharma: [
            'Focus on statement furniture pieces with clean lines',
            'Use a neutral base with 1-2 accent colors',
            'Invest in quality lighting fixtures',
            'Consider hidden storage solutions',
        ],
        karthik_reddy: [
            'Integrate smart home technology seamlessly',
            'Choose furniture with built-in charging',
            'Focus on cable management solutions',
            'Consider automated lighting systems',
        ],
        sneha_menon: [
            'Add natural textures like linen and wood',
            'Include indoor plants for warmth',
            'Layer different neutral tones',
            'Focus on cozy seating arrangements',
        ],
        arjun_patel: [
            'Incorporate handcrafted Indian textiles',
            'Use warm wood tones throughout',
            'Add brass or copper accents',
            'Include heritage furniture pieces',
        ],
        lakshmi_iyer: [
            'Follow Vastu principles for layout',
            'Include traditional art and crafts',
            'Use natural materials like teak and brass',
            'Create spaces for rituals and gathering',
        ],
        vikram_singh: [
            'Incorporate Mughal-inspired arches and jali work',
            'Use rich fabrics like velvet and silk',
            'Add statement chandeliers and ornate mirrors',
            'Mix traditional craftsmanship with modern comfort',
        ],
        meera_kapoor: [
            'Mix vintage finds with modern pieces',
            'Create gallery walls with personal art',
            'Layer different textures and patterns',
            'Add plants and natural elements',
        ],
        rohan_desai: [
            'Expose architectural elements like brick',
            'Mix metal and wood finishes',
            'Include statement industrial lighting',
            'Add artisanal handmade pieces',
        ],
        ananya_krishnan: [
            'Source furniture from sustainable brands',
            'Choose natural, organic materials',
            'Support local artisans and craftspeople',
            'Focus on timeless, long-lasting pieces',
        ],
        neha_chatterjee: [
            'Incorporate geometric patterns and shapes',
            'Use luxe materials like marble and brass',
            'Add mirrored surfaces and metallic accents',
            'Choose bold jewel-toned color accents',
        ],
        zara_khan: [
            'Layer bold patterns and colors',
            'Collect pieces from travels',
            'Mix high and low-end pieces',
            'Create cozy reading nooks',
        ],
        kabir_malhotra: [
            'Create gallery walls with curated art',
            'Mix vintage finds with contemporary pieces',
            'Add conversation-starter statement furniture',
            'Layer textures and patterns boldly',
        ],
        maya_nair: [
            'Maximize natural light',
            'Use white and soft blue palette',
            'Add organic shapes and textures',
            'Include cozy textiles like wool throws',
        ],
        aditya_verma: [
            'Use bleached woods and natural fibers',
            'Incorporate ocean-inspired color palettes',
            'Add linen and cotton textiles',
            'Focus on indoor-outdoor living flow',
        ],
    };
    return recommendations[designerId] || [
        'Create a cohesive color palette',
        'Invest in quality over quantity',
        'Add personal touches throughout',
        'Consider functionality first',
    ];
}
export function getDesignersByStyle(style) {
    const designerIds = DESIGNER_SPECIALTIES[style] || [];
    return DESIGNER_PERSONAS.filter(d => designerIds.includes(d.id));
}
export function getDesignerPortfolio(designerId) {
    const designer = DESIGNER_PERSONAS.find(d => d.id === designerId);
    if (!designer)
        return [];
    // Style-based portfolio images
    const styleImages = {
        modern_minimalist: [
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop',
        ],
        traditional_indian: [
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600&h=400&fit=crop',
        ],
        contemporary: [
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
        ],
        bohemian: [
            'https://images.unsplash.com/photo-1617104678098-de229db51175?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&h=400&fit=crop',
        ],
        scandinavian: [
            'https://images.unsplash.com/photo-1598928506311-c55ez99ae2c4?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&h=400&fit=crop',
        ],
        coastal: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop',
        ],
        industrial: [
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=400&fit=crop',
        ],
        art_deco: [
            'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop',
        ],
        maximalist: [
            'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=600&h=400&fit=crop',
        ],
        japanese_zen: [
            'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1598928506311-c55eca9a5eb8?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&h=400&fit=crop',
        ],
        rustic: [
            'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600&h=400&fit=crop',
        ],
        mid_century: [
            'https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
        ],
        natural_organic: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop',
        ],
    };
    const defaultImages = [
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
    ];
    const primaryStyle = designer.signature_style[0];
    const images = styleImages[primaryStyle] || defaultImages;
    return designer.signature_style.map((style, index) => ({
        id: `${designerId}-${index}`,
        style: style,
        image: images[index % images.length],
        title: `${style.replace(/_/g, ' ')} Design`,
        location: ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Pune'][index % 6],
    }));
}
export function getStyleDescription(styleId) {
    const descriptions = {
        modern_minimalist: 'Clean lines and uncluttered spaces',
        scandinavian: 'Cozy functionality with natural elements',
        bohemian: 'Eclectic mix of patterns and textures',
        industrial: 'Raw materials and urban edge',
        traditional_indian: 'Rich heritage and cultural elements',
        contemporary: 'Current trends with timeless appeal',
        mid_century: 'Retro charm with modern comfort',
        coastal: 'Relaxed beach-inspired living',
        maximalist: 'Bold expression and curated abundance',
        rustic: 'Natural warmth and vintage character',
        art_deco: 'Glamorous geometry and luxe details',
        japanese_zen: 'Peaceful simplicity and balance',
        natural_organic: 'Sustainable materials and earth-inspired design',
        eclectic: 'Creative mix of styles and eras',
    };
    return descriptions[styleId] || '';
}
