/**
 * Houspire Filename Parser
 *
 * Parses image filenames following the Houspire naming convention:
 * HOS_[ROOM]_[STYLE]_[BUDGET]_[ID]_[NUM]_[VIEW].png
 *
 * Example: HOS_KB_SCA_PRE_0102_01_main.png
 */
// Room Type Code Mappings
export const ROOM_CODE_MAP = {
    LR: 'living_room',
    MB: 'master_bedroom',
    KD: 'kids_bedroom',
    GB: 'guest_bedroom',
    NR: 'nursery',
    DR: 'dining_room',
    KB: 'kitchen',
    PT: 'pantry',
    HO: 'home_office',
    BT: 'bathroom',
    PR: 'pooja_room',
    BL: 'balcony',
    EF: 'foyer',
    HT: 'home_theatre',
    GY: 'gym',
    WW: 'walk_in_wardrobe',
    LN: 'laundry',
    BR: 'bar',
    LB: 'library',
    TR: 'terrace',
};
// Style Code Mappings
export const STYLE_CODE_MAP = {
    MOD: 'modern_minimalist',
    CON: 'contemporary_indian',
    TRA: 'traditional_indian',
    SCA: 'scandinavian',
    BOH: 'bohemian',
    IND: 'industrial',
    MID: 'mid_century_modern',
    COA: 'coastal_beach',
    RUS: 'rustic_farmhouse',
    ART: 'art_deco',
    JAP: 'japanese_zen',
    MAX: 'maximalist',
    TRN: 'transitional',
    ECL: 'eclectic_fusion',
    LUX: 'luxury_traditional',
};
// Budget Code Mappings
export const BUDGET_CODE_MAP = {
    BUD: 'budget',
    MID: 'medium',
    PRE: 'premium',
};
// View Type Mappings
export const VIEW_TYPE_MAP = {
    main: 'Main View',
    detail: 'Detail Shot',
    corner: 'Corner View',
    feature: 'Feature Highlight',
};
// Human-readable labels for display
export const ROOM_LABELS = {
    living_room: 'Living Room',
    master_bedroom: 'Master Bedroom',
    kids_bedroom: 'Kids Bedroom',
    guest_bedroom: 'Guest Bedroom',
    nursery: 'Nursery',
    dining_room: 'Dining Room',
    kitchen: 'Kitchen',
    pantry: 'Pantry',
    home_office: 'Home Office',
    bathroom: 'Bathroom',
    pooja_room: 'Pooja Room',
    balcony: 'Balcony',
    foyer: 'Entryway/Foyer',
    home_theatre: 'Home Theatre',
    gym: 'Home Gym',
    walk_in_wardrobe: 'Walk-in Wardrobe',
    laundry: 'Laundry Room',
    bar: 'Bar/Wine Room',
    library: 'Library/Study',
    terrace: 'Terrace/Outdoor',
};
export const STYLE_LABELS = {
    modern_minimalist: 'Modern Minimalist',
    contemporary_indian: 'Contemporary Indian',
    traditional_indian: 'Traditional Indian',
    scandinavian: 'Scandinavian',
    bohemian: 'Bohemian',
    industrial: 'Industrial',
    mid_century_modern: 'Mid-Century Modern',
    coastal_beach: 'Coastal Beach',
    rustic_farmhouse: 'Rustic Farmhouse',
    art_deco: 'Art Deco',
    japanese_zen: 'Japanese Zen',
    maximalist: 'Maximalist',
    transitional: 'Transitional',
    eclectic_fusion: 'Eclectic Fusion',
    luxury_traditional: 'Luxury Traditional',
};
export const BUDGET_LABELS = {
    budget: 'Budget Friendly',
    medium: 'Mid Range',
    premium: 'Premium',
};
/**
 * Parse a Houspire-format filename and extract metadata
 *
 * @param filename - The filename to parse (e.g., "HOS_KB_SCA_PRE_0102_01_main.png")
 * @returns Parsed metadata or null if the filename doesn't match the pattern
 */
export function parseHouspireFilename(filename) {
    // Pattern: HOS_[ROOM]_[STYLE]_[BUDGET]_[ID]_[NUM]_[VIEW].extension
    const pattern = /^HOS_([A-Z]{2})_([A-Z]{3})_([A-Z]{3})_(\d+)_(\d{2})_(\w+)\.[a-zA-Z]+$/i;
    const match = filename.match(pattern);
    if (!match) {
        return null;
    }
    const [, roomCode, styleCode, budgetCode, designId, imageNum, viewType] = match;
    const roomTypeValue = ROOM_CODE_MAP[roomCode.toUpperCase()];
    const styleValue = STYLE_CODE_MAP[styleCode.toUpperCase()];
    const budgetValue = BUDGET_CODE_MAP[budgetCode.toUpperCase()];
    // Validate that all codes mapped correctly
    if (!roomTypeValue || !styleValue || !budgetValue) {
        console.warn(`Unknown code in filename: ${filename}`, {
            roomCode,
            styleCode,
            budgetCode,
            roomTypeValue,
            styleValue,
            budgetValue,
        });
        return null;
    }
    const roomLabel = ROOM_LABELS[roomTypeValue] || roomTypeValue;
    const styleLabel = STYLE_LABELS[styleValue] || styleValue;
    const budgetLabel = BUDGET_LABELS[budgetValue] || budgetValue;
    const viewLabel = VIEW_TYPE_MAP[viewType.toLowerCase()] || viewType;
    // Generate a human-readable title
    const generatedTitle = `${styleLabel} ${roomLabel} - ${viewLabel}`;
    return {
        roomType: roomTypeValue,
        roomTypeLabel: roomLabel,
        style: styleValue,
        styleLabel: styleLabel,
        budgetRange: budgetValue,
        budgetLabel: budgetLabel,
        designId,
        imageNumber: imageNum,
        viewType: viewType.toLowerCase(),
        viewTypeLabel: viewLabel,
        isFeatured: budgetCode.toUpperCase() === 'PRE',
        tags: [viewType.toLowerCase()],
        generatedTitle,
    };
}
/**
 * Check if a filename looks like a random/hash string
 */
function isRandomFilename(filename) {
    // Remove extension
    const name = filename.replace(/\.[^/.]+$/, '');
    // Check for patterns that indicate random/hash strings:
    // - Long alphanumeric strings with mixed case
    // - Timestamp prefixes (13+ digit numbers)
    // - Base64-like patterns
    // - UUID-like patterns
    const randomPatterns = [
        /^[a-zA-Z0-9]{20,}$/, // Long alphanumeric string
        /^\d{10,}_/, // Timestamp prefix
        /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}/, // UUID-like
        /L2hvbWU/, // Base64 encoded path pattern
        /^[\d]+[_-][\da-zA-Z]+[_-][\d]+/, // Timestamp-hash-timestamp pattern
    ];
    return randomPatterns.some(pattern => pattern.test(name));
}
/**
 * Generate a user-friendly title for unknown/random filenames
 */
function generateFriendlyTitle(index) {
    const adjectives = [
        'Elegant', 'Cozy', 'Modern', 'Stylish', 'Serene',
        'Inviting', 'Bright', 'Warm', 'Contemporary', 'Classic'
    ];
    const nouns = [
        'Interior Design', 'Room Design', 'Space', 'Interior', 'Design Concept'
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    if (index !== undefined) {
        return `${adj} ${noun} #${index + 1}`;
    }
    return `${adj} ${noun}`;
}
/**
 * Fallback function to extract tags from filename keywords
 * Used when the filename doesn't match the Houspire pattern
 */
export function extractTagsFromFilename(filename) {
    const keywords = {
        // Styles
        modern: 'modern_minimalist',
        contemporary: 'contemporary_indian',
        traditional: 'traditional_indian',
        minimalist: 'modern_minimalist',
        luxury: 'luxury_traditional',
        indian: 'contemporary_indian',
        zen: 'japanese_zen',
        'art-deco': 'art_deco',
        industrial: 'industrial',
        bohemian: 'bohemian',
        scandinavian: 'scandinavian',
        // Room types
        'living-room': 'living_room',
        'living_room': 'living_room',
        living: 'living_room',
        bedroom: 'master_bedroom',
        'master-bedroom': 'master_bedroom',
        'guest-bedroom': 'guest_bedroom',
        guest: 'guest_bedroom',
        nursery: 'nursery',
        baby: 'nursery',
        kitchen: 'kitchen',
        pantry: 'pantry',
        bathroom: 'bathroom',
        dining: 'dining_room',
        office: 'home_office',
        'home-office': 'home_office',
        study: 'library',
        library: 'library',
        outdoor: 'balcony',
        balcony: 'balcony',
        terrace: 'terrace',
        foyer: 'foyer',
        entryway: 'foyer',
        entrance: 'foyer',
        kids: 'kids_bedroom',
        children: 'kids_bedroom',
        pooja: 'pooja_room',
        prayer: 'pooja_room',
        theatre: 'home_theatre',
        theater: 'home_theatre',
        'home-theatre': 'home_theatre',
        'home_theatre': 'home_theatre',
        media: 'home_theatre',
        gym: 'gym',
        fitness: 'gym',
        workout: 'gym',
        wardrobe: 'walk_in_wardrobe',
        closet: 'walk_in_wardrobe',
        'walk-in': 'walk_in_wardrobe',
        dressing: 'walk_in_wardrobe',
        laundry: 'laundry',
        utility: 'laundry',
        bar: 'bar',
        wine: 'bar',
    };
    const filenameLower = filename.toLowerCase();
    const foundTags = [];
    let style = '';
    let roomType = '';
    const styleValues = [
        'modern_minimalist',
        'contemporary_indian',
        'traditional_indian',
        'scandinavian',
        'bohemian',
        'industrial',
        'mid_century_modern',
        'coastal_beach',
        'rustic_farmhouse',
        'art_deco',
        'japanese_zen',
        'maximalist',
        'transitional',
        'eclectic_fusion',
        'luxury_traditional',
    ];
    for (const [keyword, value] of Object.entries(keywords)) {
        if (filenameLower.includes(keyword)) {
            foundTags.push(value);
            if (styleValues.includes(value)) {
                if (!style)
                    style = value;
            }
            else {
                if (!roomType)
                    roomType = value;
            }
        }
    }
    return {
        style,
        roomType,
        tags: foundTags,
        isRandomFilename: isRandomFilename(filename)
    };
}
/**
 * Smart filename parser that tries Houspire format first, then falls back to keyword extraction
 */
export function smartParseFilename(filename, index) {
    // Try Houspire format first
    const houspireResult = parseHouspireFilename(filename);
    if (houspireResult) {
        return {
            style: houspireResult.style,
            roomType: houspireResult.roomType,
            budgetRange: houspireResult.budgetRange,
            tags: houspireResult.tags,
            title: houspireResult.generatedTitle,
            isFeatured: houspireResult.isFeatured,
            isHouspireFormat: true,
            needsAIMetadata: false,
        };
    }
    // Fallback to keyword extraction
    const fallbackResult = extractTagsFromFilename(filename);
    // For random/hash filenames, generate a friendly title
    // For readable filenames, clean them up
    let title;
    if (fallbackResult.isRandomFilename) {
        title = generateFriendlyTitle(index);
    }
    else {
        // Clean the filename: remove extension, replace separators, capitalize
        title = filename
            .replace(/\.[^/.]+$/, '') // Remove extension
            .replace(/[-_]+/g, ' ') // Replace separators with spaces
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
        // If the result is still too short or looks like random chars, use friendly title
        if (title.length < 3 || /^[a-zA-Z0-9]{15,}$/.test(title.replace(/\s/g, ''))) {
            title = generateFriendlyTitle(index);
        }
    }
    return {
        style: fallbackResult.style || 'modern_minimalist',
        roomType: fallbackResult.roomType || 'living_room',
        budgetRange: 'medium',
        tags: fallbackResult.tags,
        title,
        isFeatured: false,
        isHouspireFormat: false,
        needsAIMetadata: fallbackResult.isRandomFilename, // Flag for images that need AI to detect room/style
    };
}
