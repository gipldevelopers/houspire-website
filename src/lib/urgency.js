export const urgencyStories = [
  {
    slug: 'contractor-ghosted',
    title: 'My contractor vanished mid-renovation',
    summary:
      'We rebuilt the plan, re-priced materials, and helped them restart with a verified shortlist â€” in 72 hours.',
    person: {
      name: 'Aarav',
      city: 'Bangalore',
      homeType: '2BHK Apartment',
      room: 'Living + Kitchen',
    },
    delivery: '72 hours',
    image: '/styles/japanese-zen/portfolio-4-dining-room.png',
    problem: [
      'Work stopped after payments were made',
      'No clear scope, no bill of quantities, no timeline',
      'Budget kept changing every week',
    ],
    whatWeDid: [
      'Converted their WhatsApp scope into a clean, itemized plan',
      'Created a room-by-room budget with alternates (good / better / best)',
      'Shared a verified contractor shortlist to restart safely',
    ],
    results: [
      'Restarted work with a clear scope + milestones',
      'Reduced surprise spend with item-level pricing',
      'Decision-making got faster because options were pre-curated',
    ],
  },
  {
    slug: 'moving-in-soon',
    title: 'Move-in date fixed, design not ready',
    summary:
      'They had 2 weeks to move in. We delivered a ready-to-execute plan with shopping links and priorities.',
    person: {
      name: 'Nisha',
      city: 'Hyderabad',
      homeType: 'New Villa',
      room: 'Master Bedroom',
    },
    delivery: '72 hours',
    image: '/styles/japanese-zen/portfolio-6-home-office.png',
    problem: [
      'Hard move-in deadline',
      'Too many Pinterest ideas, no final direction',
      'No time for multiple vendor visits',
    ],
    whatWeDid: [
      'Locked a single cohesive look (colors, materials, lighting)',
      'Delivered 4K renders + a prioritized shopping list',
      'Mapped what to do before move-in vs after move-in',
    ],
    results: [
      'Moved in on time with the essentials done',
      'Avoided last-minute purchases that donâ€™t match',
      'Saved time with direct buying links',
    ],
  },
  {
    slug: 'budget-overrun',
    title: 'Budget overrun before work even started',
    summary:
      'We re-planned using smart alternates to keep the style, cut the cost, and keep quality where it matters.',
    person: {
      name: 'Rohit',
      city: 'Mumbai',
      homeType: '1BHK Apartment',
      room: 'Full Home',
    },
    delivery: '72 hours',
    image: '/styles/traditional-indian/portfolio-7-kids-bedroom.png',
    problem: [
      'Initial quotes were 30â€“40% above budget',
      'No clarity on where the money was going',
      'Fear of low-quality substitutions',
    ],
    whatWeDid: [
      'Created an itemized budget with transparent ranges',
      'Suggested alternates for high-cost items (finish, brand, size)',
      'Kept a â€œnon-negotiablesâ€� list to protect quality',
    ],
    results: [
      'Got quotes back within budget using the same scope',
      'Fewer negotiations because the plan was clear',
      'Better control over quality decisions',
    ],
  },
];

export function getUrgencyStory(slug) {
  return urgencyStories.find((s) => s.slug === slug) || null;
}

