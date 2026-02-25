export const BASE_PACKAGE = {
    id: 'base_package',
    name: 'Design Starter',
    price: 499,
    category: 'base',
    description: '1 concept + 2 renders',
};
export const ADD_ONS = [
    // Visual Upgrades
    { id: 'extra_renders_3', name: '+3 Renders', price: 499, category: 'visual', description: 'See 5 angles total' },
    { id: 'day_night', name: 'Day/Night Lighting', price: 299, category: 'visual', description: 'Both lighting scenarios' },
    { id: 'closeup_details', name: 'Close-up Details', price: 249, category: 'visual', description: '2 detail shots' },
    // Execution Tools
    { id: 'ai_budget', name: 'AI Smart Budget', price: 399, category: 'execution', description: 'Know exact costs' },
    { id: 'product_list', name: 'Product Shopping List', price: 349, category: 'execution', description: 'What to buy' },
    { id: 'vendor_directory', name: 'Vendor Directory', price: 499, category: 'execution', description: 'Where to buy' },
    { id: 'floor_plan', name: 'Floor Plan Drawing', price: 499, category: 'execution', description: 'For contractor' },
    { id: 'material_specs', name: 'Material Specs', price: 299, category: 'execution', description: 'Exact finishes' },
    // Design Options
    { id: 'second_concept', name: '2nd Style Concept', price: 599, category: 'design', description: 'Compare styles' },
    { id: 'third_concept', name: '3rd Style Concept', price: 599, category: 'design', description: 'Maximum choice' },
    // Premium Features
    { id: 'designer_review', name: 'Designer Review', price: 799, category: 'premium', description: 'Human expert QC' },
    { id: 'priority_24h', name: 'Priority 24h Delivery', price: 499, category: 'premium', description: 'Urgent deadline' },
    // Support
    { id: 'support_7day', name: '7-Day Designer Support', price: 299, category: 'support', description: 'Questions during shopping' },
    { id: 'support_30day', name: '30-Day Full Support', price: 699, category: 'support', description: 'Throughout execution' },
];
export const BUNDLES = [
    {
        id: 'just_show_me',
        name: 'Just Show Me',
        price: 499,
        originalPrice: 499,
        badge: 'Entry',
        description: 'Perfect for exploring possibilities',
        features: [
            '1 design concept',
            '2 high-quality renders',
            'Your designer: Priya/Arjun/Meera',
            '72-hour delivery',
        ],
        addons: [],
        popular: false,
    },
    {
        id: 'diy_executor',
        name: 'DIY Executor',
        price: 1499,
        originalPrice: 1947,
        savings: 448,
        description: 'For hands-on buyers who\'ll source themselves',
        features: [
            'Everything in Just Show Me',
            '+ AI Smart Budget',
            '+ Product Shopping List',
            '+ Material Specifications',
        ],
        addons: ['ai_budget', 'product_list', 'material_specs'],
        popular: false,
    },
    {
        id: 'ready_to_build',
        name: 'Ready to Build',
        price: 2499,
        originalPrice: 3395,
        savings: 896,
        badge: '⭐ MOST POPULAR',
        description: 'Complete execution toolkit',
        features: [
            'Everything in DIY Executor',
            '+ 5 render angles (not 2)',
            '+ Floor Plan with measurements',
            '+ Vendor Directory',
            '+ All execution tools',
        ],
        addons: ['ai_budget', 'product_list', 'material_specs', 'vendor_directory', 'floor_plan', 'extra_renders_3'],
        popular: true,
    },
    {
        id: 'premium_experience',
        name: 'Premium Experience',
        price: 3999,
        originalPrice: 5393,
        savings: 1394,
        badge: 'Best Value',
        description: 'The complete premium package',
        features: [
            'Everything in Ready to Build',
            '+ 3 design concepts to choose from',
            '+ Designer Review (human QC)',
            '+ 30-Day Full Support',
            '+ Priority features',
        ],
        addons: ['ai_budget', 'product_list', 'material_specs', 'vendor_directory', 'floor_plan', 'extra_renders_3', 'second_concept', 'third_concept', 'designer_review', 'support_30day'],
        popular: false,
    },
];
export const FREE_ADDON_OPTIONS = [
    { id: 'ai_budget', name: 'AI Smart Budget', value: 399 },
    { id: 'product_list', name: 'Product Shopping List', value: 349 },
    { id: 'extra_renders_2', name: '+2 Additional Renders', value: 398 },
];
