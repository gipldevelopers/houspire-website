export const urgencyStories = [
  {
    slug: 'contractor-ghosted',
    title: 'Contractor disappeared mid-project?',
    problem_tag: 'Contractor vanished',
    summary:
      'We rebuilt the plan, re-priced materials, and got execution back on track.',
    cta_text: 'Fix my plan →',
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
    title: 'Moving in soon but design not ready?',
    problem_tag: 'Design delays',
    summary:
      'We delivered a complete, ready-to-execute plan in 3 days.',
    cta_text: 'Plan my home fast →',
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
    title: 'Budget going out of control?',
    problem_tag: 'Budget overruns',
    summary:
      'We optimized costs without compromising your design vision.',
    cta_text: 'Get cost clarity →',
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
      'Kept a â€œnon-negotiablesâ€ list to protect quality',
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
