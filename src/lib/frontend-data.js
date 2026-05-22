import {
  MOCK_USER,
  MOCK_PROJECTS,
  MOCK_ORDERS,
  MOCK_NOTIFICATIONS,
  MOCK_REFERRAL,
  MOCK_REFERRAL_CREDITS,
} from './mock-data';
import { FALLBACK_GALLERY_DESIGNS } from './fallback-gallery';
import { FALLBACK_DESIGN_STYLES } from './fallback-design-styles';

const MOCK_PACKAGES = [
  {
    id: 'pkg-trial',
    slug: 'trial',
    name: 'Single Room Trial',
    tagline: 'Try before committing',
    price: 499,
    originalPrice: 2999,
    discount: '83% OFF',
    isTrial: true,
    features: [
      '1 room view',
      'Randomly selected style',
      'Budget breakdown',
      'Vendor recommendations'
    ],
    roomCountDisplay: '1 Room',
    revisionsDisplay: 'No revisions',
    buttonText: 'Start Trial for ₹499'
  },
  {
    id: 'pkg-smart',
    slug: 'smart',
    name: 'Smart Home',
    tagline: 'Everything you need',
    price: 4999,
    originalPrice: 19999,
    discount: '75% OFF',
    isPopular: true,
    badgeText: 'MOST POPULAR',
    features: [
      '5-7 3D design views',
      'Choose from 5 styles',
      '1 revision',
      'Complete budget breakdown',
      'Material specifications',
      'Vendor recommendations'
    ],
    roomCountDisplay: '5-7 Rooms',
    revisionsDisplay: '1 Revision',
    buttonText: 'Get Complete Home for ₹4,999'
  },
  {
    id: 'pkg-premium',
    slug: 'premium',
    name: 'Premium Home',
    tagline: 'Enhanced experience',
    price: 9999,
    originalPrice: 34999,
    discount: '71% OFF',
    features: [
      '7-10 3D design views',
      '12 premium style options',
      '1 revision',
      'Premium materials + alternatives',
      '3 consultation calls',
      'Priority support',
      'Vendor recommendations',
      'Complete budget breakdown'
    ],
    roomCountDisplay: '7-10 Rooms',
    revisionsDisplay: '1 Revision',
    buttonText: 'Choose Premium for ₹9,999'
  },
  {
    id: 'pkg-luxury',
    slug: 'luxury',
    name: 'Luxury Home',
    tagline: 'White-glove service',
    price: 14999,
    originalPrice: 49999,
    discount: '70% OFF',
    features: [
      '10-15 3D design views',
      '20+ exclusive styles',
      '3 revisions',
      'Dedicated designer',
      '24/7 priority support',
      'Complete budget breakdown',
      'Vendor recommendations'
    ],
    roomCountDisplay: '10-15 Rooms',
    revisionsDisplay: '3 Revisions',
    buttonText: 'Get Luxury for ₹14,999'
  },
];

const MOCK_MILESTONES = [
  { id: 'ms-1', title: 'Project Started', status: 'completed' },
  { id: 'ms-2', title: 'Concept Drafted', status: 'completed' },
  { id: 'ms-3', title: 'Revision Window', status: 'active' },
  { id: 'ms-4', title: 'Final Delivery', status: 'pending' },
];

const MOCK_ACTIVITY = [
  { id: 'act-1', title: 'Designer assigned', createdAt: new Date().toISOString() },
  { id: 'act-2', title: 'Moodboard prepared', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const MOCK_FILES = [
  { id: 'file-1', name: 'Living Room Render.png', url: '/images/living-room.png', published: true },
  { id: 'file-2', name: 'Execution Notes.pdf', url: '/downloads/planning-checklist.txt', published: true },
];

const MOCK_BUDGET = {
  total: 24999,
  spent: 12999,
  remaining: 12000,
  items: [
    { id: 'budget-1', category: 'Furniture', amount: 9000 },
    { id: 'budget-2', category: 'Lighting', amount: 2500 },
    { id: 'budget-3', category: 'Decor', amount: 1499 },
  ],
};

const MOCK_CHAT_ROOM = { id: 'room-1', projectId: 'proj-1' };
const MOCK_CHAT_MESSAGES = [
  { id: 'msg-1', sender: 'designer', content: 'Your draft is ready for review.', createdAt: new Date().toISOString() },
  { id: 'msg-2', sender: 'user', content: 'Looks good, please make the sofa lighter.', createdAt: new Date().toISOString() },
];

function wait(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEndpoint(endpoint) {
  return endpoint
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/api/, '')
    .replace(/^api/, '');
}

function getStyleBySlug(slug) {
  return FALLBACK_DESIGN_STYLES.find((style) => style.slug === slug) || null;
}

function getDesignById(id) {
  return FALLBACK_GALLERY_DESIGNS.find((design) => String(design.id) === String(id)) || null;
}

function getResponse(endpoint) {
  const path = normalizeEndpoint(endpoint);

  if (path === '/gallery') {
    return {
      designs: FALLBACK_GALLERY_DESIGNS,
      pagination: {
        page: 1,
        limit: FALLBACK_GALLERY_DESIGNS.length,
        total: FALLBACK_GALLERY_DESIGNS.length,
        totalPages: 1,
      },
    };
  }

  if (path.startsWith('/gallery/')) {
    return getDesignById(path.split('/').pop());
  }

  if (path === '/design-styles') {
    return { styles: FALLBACK_DESIGN_STYLES };
  }

  if (path.startsWith('/design-styles/')) {
    return getStyleBySlug(path.split('/').pop());
  }

  if (path === '/auth/me') return { user: MOCK_USER };
  if (path === '/auth/login') return { user: MOCK_USER, token: 'frontend-demo-token' };
  if (path === '/auth/signup') return { user: MOCK_USER, token: 'frontend-demo-token' };
  if (path === '/auth/forgot-password') return { success: true };
  if (path === '/auth/reset-password') return { success: true };
  if (path === '/auth/verify-email') return { success: true };

  if (path === '/orders' || path.startsWith('/orders?')) {
    return { orders: MOCK_ORDERS, order: MOCK_ORDERS[0] };
  }

  if (path.startsWith('/orders/') && path.endsWith('/milestones')) {
    return { milestones: MOCK_MILESTONES, total: MOCK_MILESTONES.length, completed: 2 };
  }

  if (path.startsWith('/orders/')) {
    return { order: MOCK_ORDERS.find((order) => order.id === path.split('/').pop()) || MOCK_ORDERS[0] };
  }

  if (path === '/projects' || path.startsWith('/projects?')) {
    return { projects: MOCK_PROJECTS, project: MOCK_PROJECTS[0] };
  }

  if (path.startsWith('/projects/') && path.endsWith('/files')) {
    return { files: MOCK_FILES };
  }

  if (path.startsWith('/projects/') && path.endsWith('/budget')) {
    return { ...MOCK_BUDGET };
  }

  if (path.startsWith('/projects/') && path.endsWith('/milestones')) {
    return { milestones: MOCK_MILESTONES };
  }

  if (path.startsWith('/projects/') && path.endsWith('/vendors')) {
    return { vendors: [] };
  }

  if (path.startsWith('/projects/') && path.endsWith('/materials')) {
    return { materials: [] };
  }

  if (path === '/notifications' || path.startsWith('/notifications?')) {
    return { notifications: MOCK_NOTIFICATIONS };
  }

  if (path === '/profile') {
    return { profile: MOCK_USER.profile, user: MOCK_USER };
  }

  if (path === '/referrals') return MOCK_REFERRAL;
  if (path === '/referrals/credits') return { credits: MOCK_REFERRAL_CREDITS };

  if (path === '/packages' || path.startsWith('/packages?')) {
    return { packages: MOCK_PACKAGES };
  }

  if (path === '/concepts' || path.startsWith('/concepts?')) {
    return {
      concepts: MOCK_PROJECTS[0]?.concepts || [],
    };
  }

  if (path.startsWith('/chat-rooms')) {
    return { room: MOCK_CHAT_ROOM, rooms: [MOCK_CHAT_ROOM] };
  }

  if (path.startsWith('/chat-messages')) {
    return { messages: MOCK_CHAT_MESSAGES };
  }

  if (path.startsWith('/project-activity')) {
    return { activities: MOCK_ACTIVITY };
  }

  if (path.startsWith('/revision-requests')) {
    return { requests: [] };
  }

  if (path.startsWith('/concept-products')) {
    return { products: [] };
  }

  if (path === '/contact') return { success: true };
  if (path === '/quiz-results') return { results: [] };

  return {};
}

export async function dataRequest(endpoint, options = {}) {
  await wait();
  const mockData = getResponse(endpoint);

  if (options.method && options.method !== 'GET') {
    return { success: true, ...mockData };
  }

  return mockData;
}

export async function dataGet(endpoint) {
  return dataRequest(endpoint, { method: 'GET' });
}

export async function dataPost(endpoint, data) {
  return dataRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function dataPatch(endpoint, data) {
  return dataRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function dataDelete(endpoint) {
  return dataRequest(endpoint, { method: 'DELETE' });
}

export async function dataUpload(endpoint, file) {
  await wait(250);
  return {
    success: true,
    file_url: URL.createObjectURL(file),
    public_id: `frontend-${Date.now()}`,
    endpoint,
  };
}

export function getStaticStyleBySlug(slug) {
  return getStyleBySlug(slug);
}

export function getStaticDesignById(id) {
  return getDesignById(id);
}

export function getStaticDesignStyles() {
  return FALLBACK_DESIGN_STYLES;
}

export function getStaticGalleryDesigns() {
  return FALLBACK_GALLERY_DESIGNS;
}

export function getStaticPackages() {
  return MOCK_PACKAGES;
}
