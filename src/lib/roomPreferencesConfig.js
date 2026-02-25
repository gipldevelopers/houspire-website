// Room-specific preference options for intake form
// These options change based on the room type being designed
export const roomPreferences = {
    bedroom: {
        mustHave: [
            'Large Wardrobe',
            'Dressing Table',
            'Study Area',
            'Reading Nook',
            'Bedside Tables',
            'Full-Length Mirror',
            'Walk-in Closet',
            'Seating Area',
            'Blackout Curtains',
            'Ambient Lighting',
        ],
        avoid: [
            'Harsh Lighting',
            'Wall Mirrors Near Bed',
            'Bold Patterns',
            'Glass Furniture',
            'Open Shelving',
            'Dark Walls',
            'Heavy Drapes',
        ],
    },
    living_room: {
        mustHave: [
            'Entertainment Unit',
            'TV Wall',
            'Sofa Seating',
            'Coffee Table',
            'Bookshelf Wall',
            'Accent Chairs',
            'Console Table',
            'Display Cabinet',
            'Bar Unit',
            'Fireplace Area',
        ],
        avoid: [
            'Heavy Curtains',
            'Glass Tables',
            'White Upholstery',
            'Cluttered Shelves',
            'Dark Corners',
            'Wall-to-Wall Carpet',
            'Oversized Furniture',
        ],
    },
    kitchen: {
        mustHave: [
            'Island Counter',
            'Pantry Storage',
            'Breakfast Nook',
            'Appliance Garage',
            'Wine Storage',
            'Pull-out Drawers',
            'Chimney Hood',
            'Under-cabinet Lighting',
            'Utensil Organizers',
            'Spice Rack',
        ],
        avoid: [
            'Open Shelving',
            'White Countertops',
            'Tile Flooring',
            'Dark Cabinets',
            'Limited Counter Space',
            'Poor Ventilation',
            'Sharp Corners',
        ],
    },
    bathroom: {
        mustHave: [
            'Vanity Unit',
            'Walk-in Shower',
            'Double Sink',
            'Bathtub',
            'Heated Floors',
            'Storage Cabinet',
            'Towel Warmer',
            'Rain Showerhead',
            'Lighted Mirror',
            'Exhaust Fan',
        ],
        avoid: [
            'Dark Tiles',
            'Small Vanity',
            'Wall-to-Wall Mirror',
            'Slippery Flooring',
            'Poor Drainage',
            'Limited Storage',
            'Cold Surfaces',
        ],
    },
    dining_room: {
        mustHave: [
            'Dining Table (6+ seats)',
            'Buffet/Sideboard',
            'Pendant Lighting',
            'Display Cabinet',
            'Bar Cart',
            'Statement Chandelier',
            'Serving Station',
            'Wall Art',
        ],
        avoid: [
            'Cramped Seating',
            'Glass Tabletop',
            'White Chairs',
            'Dark Walls',
            'Harsh Lighting',
            'Heavy Curtains',
        ],
    },
    home_office: {
        mustHave: [
            'L-shaped Desk',
            'Ergonomic Chair',
            'Bookshelves',
            'Filing Cabinet',
            'Cable Management',
            'Task Lighting',
            'Whiteboard/Corkboard',
            'Standing Desk Option',
            'Video Call Background',
        ],
        avoid: [
            'Poor Lighting',
            'Distracting Views',
            'Uncomfortable Seating',
            'Cluttered Surfaces',
            'Noisy Location',
            'Limited Outlets',
        ],
    },
    kids_room: {
        mustHave: [
            'Study Desk',
            'Bunk Bed',
            'Toy Storage',
            'Play Area',
            'Bookshelf',
            'Art Display Wall',
            'Growth Chart',
            'Night Light',
            'Soft Flooring',
        ],
        avoid: [
            'Sharp Corners',
            'Glass Furniture',
            'High Shelves',
            'Heavy Furniture',
            'Dark Colors',
            'Fragile Decor',
            'Hard Flooring',
        ],
    },
    pooja_room: {
        mustHave: [
            'Wooden Mandir',
            'Bell',
            'Oil Lamp Stand',
            'Storage for Puja Items',
            'Brass Accents',
            'Marble Flooring',
            'Ventilation',
            'Natural Light',
        ],
        avoid: [
            'Modern Materials',
            'Dark Colors',
            'Clutter',
            'Synthetic Materials',
            'Poor Ventilation',
        ],
    },
    balcony: {
        mustHave: [
            'Outdoor Seating',
            'Planters',
            'Vertical Garden',
            'String Lights',
            'Weather-resistant Furniture',
            'Privacy Screen',
            'Small Table',
            'Hammock/Swing',
        ],
        avoid: [
            'Non-weatherproof Items',
            'Cluttered Space',
            'Poor Drainage',
            'Heavy Pots',
            'Blocking Views',
        ],
    },
    foyer: {
        mustHave: [
            'Console Table',
            'Mirror',
            'Shoe Storage',
            'Key Holder',
            'Umbrella Stand',
            'Statement Lighting',
            'Coat Hooks',
            'Welcome Mat',
        ],
        avoid: [
            'Clutter',
            'Dark Lighting',
            'Narrow Passage',
            'Bulky Furniture',
            'No Storage',
        ],
    },
};
// Common options that apply to ALL room types
export const commonPreferences = {
    mustHave: [
        'Natural Light',
        'Storage Solutions',
        'Accent Lighting',
        'Plants/Greenery',
        'Art Display',
        'Smart Home Features',
    ],
    avoid: [
        'Dark Colors',
        'Bright Colors',
        'Bold Patterns',
        'Minimalism',
        'Heavy Furniture',
        'Cluttered Space',
    ],
};
// Get preferences for a specific room type
// Returns common preferences if room type is not found
export function getRoomPreferences(roomType) {
    if (!roomType) {
        return commonPreferences;
    }
    // Normalize room type (handle variations like "living room", "living_room", "Living Room")
    const normalizedType = roomType.toLowerCase().replace(/[\s-]/g, '_');
    // Map common variations to standard keys
    const roomTypeMap = {
        'living_room': 'living_room',
        'livingroom': 'living_room',
        'living': 'living_room',
        'master_bedroom': 'bedroom',
        'guest_bedroom': 'bedroom',
        'kids_bedroom': 'kids_room',
        'children_room': 'kids_room',
        'childrens_room': 'kids_room',
        'child_room': 'kids_room',
        'home_office': 'home_office',
        'office': 'home_office',
        'study': 'home_office',
        'study_room': 'home_office',
        'puja_room': 'pooja_room',
        'pooja': 'pooja_room',
        'prayer_room': 'pooja_room',
        'entrance': 'foyer',
        'entryway': 'foyer',
        'hallway': 'foyer',
        'terrace': 'balcony',
        'patio': 'balcony',
        'outdoor': 'balcony',
    };
    const mappedType = roomTypeMap[normalizedType] || normalizedType;
    const roomConfig = roomPreferences[mappedType];
    if (roomConfig) {
        // Merge room-specific with common preferences
        return {
            mustHave: [...roomConfig.mustHave, ...commonPreferences.mustHave],
            avoid: [...roomConfig.avoid, ...commonPreferences.avoid],
        };
    }
    // Return common preferences for unknown room types
    return commonPreferences;
}
// Get combined preferences for multiple rooms (for multi-room packages)
export function getCombinedRoomPreferences(roomTypes) {
    if (!roomTypes || roomTypes.length === 0) {
        return commonPreferences;
    }
    const allMustHaves = new Set();
    const allAvoid = new Set();
    // Add common preferences first
    commonPreferences.mustHave.forEach((item) => allMustHaves.add(item));
    commonPreferences.avoid.forEach((item) => allAvoid.add(item));
    // Add room-specific preferences
    roomTypes.forEach((roomType) => {
        const prefs = getRoomPreferences(roomType);
        prefs.mustHave.forEach((item) => allMustHaves.add(item));
        prefs.avoid.forEach((item) => allAvoid.add(item));
    });
    return {
        mustHave: Array.from(allMustHaves),
        avoid: Array.from(allAvoid),
    };
}
// Color options (same for all rooms)
export const colorOptions = [
    { name: 'Neutral', colors: ['#F5F5F5', '#E0E0E0', '#BDBDBD'] },
    { name: 'Warm', colors: ['#FFCCBC', '#FFAB91', '#FF8A65'] },
    { name: 'Cool', colors: ['#B3E5FC', '#81D4FA', '#4FC3F7'] },
    { name: 'Earth', colors: ['#D7CCC8', '#BCAAA4', '#A1887F'] },
    { name: 'Green', colors: ['#C8E6C9', '#A5D6A7', '#81C784'] },
    { name: 'Bold', colors: ['#CE93D8', '#BA68C8', '#AB47BC'] },
];
