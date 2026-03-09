/**
 * Centralized mock data for the Houspire frontend.
 * Provides realistic data for user profiles, projects, orders, and more.
 */

export const MOCK_USER = {
  id: 'user-mock-123',
  email: 'demo@houspire.ai',
  role: 'user',
  profile: {
    first_name: 'Demo',
    last_name: 'User',
    phone: '+91 9876543210',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  }
};

export const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    roomType: 'living_room',
    designStyle: 'japanese-zen',
    status: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    concepts: [
      { id: 'cnc-1', name: 'Zen Harmony', imageUrl: '/styles/japanese-zen/portfolio-4-dining-room.png' }
    ],
    projectInputs: {
      roomDimensions: '15x20 ft',
      budget: 'Medium',
      preferences: 'Needs more natural light.'
    }
  },
  {
    id: 'proj-2',
    roomType: 'master_bedroom',
    designStyle: 'scandinavian',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    concepts: [],
    projectInputs: {
      roomDimensions: '12x14 ft',
      budget: 'Premium',
      preferences: 'Oak wood finishes preferred.'
    }
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ord-1',
    projectId: 'proj-1',
    packageId: 'fb-single',
    totalAmount: 4999,
    currency: 'INR',
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    project: MOCK_PROJECTS[0]
  },
  {
    id: 'ord-2',
    projectId: 'proj-2',
    packageId: 'fb-trial',
    totalAmount: 999,
    currency: 'INR',
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    project: MOCK_PROJECTS[1]
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'not-1', title: 'Design Ready!', message: 'Your Zen Harmony concept is now available for review.', read: false, createdAt: new Date().toISOString() },
  { id: 'not-2', title: 'Payment Success', message: 'Thank you for choosing Houspire. Your project is now active.', read: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
];

export const MOCK_REFERRAL = {
  code: 'HOUSPIRE500',
  shareUrl: 'http://localhost:3001/signup?ref=HOUSPIRE500',
  successfulReferrals: 2,
  pendingReferrals: 1,
  totalEarnings: 1000,
  referrals: [
    {
      id: 'ref-1',
      status: 'completed',
      rewardAmount: 500,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'ref-user-1',
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
      },
    },
    {
      id: 'ref-2',
      status: 'completed',
      rewardAmount: 500,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'ref-user-2',
        name: 'Nisha Mehta',
        email: 'nisha@example.com',
      },
    },
    {
      id: 'ref-3',
      status: 'pending',
      rewardAmount: 500,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'ref-user-3',
        name: 'Kabir Rao',
        email: 'kabir@example.com',
      },
    },
  ],
  stats: {
    totalReferrals: 3,
    earnedRewards: 1500,
    pendingRewards: 500
  }
};

export const MOCK_REFERRAL_CREDITS = [
  {
    id: 'credit-1',
    amount: 500,
    source: 'referral',
    description: 'Referral bonus for Aarav Sharma',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'credit-2',
    amount: 500,
    source: 'referral',
    description: 'Referral bonus for Nisha Mehta',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
