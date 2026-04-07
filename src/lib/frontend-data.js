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
    name: 'Trial Room',
    tagline: 'Try one room before committing to more.',
    price: 999,
    isPopular: true,
    isTrial: true,
    roomCountDisplay: '1 room',
    revisionsDisplay: '1 revision',
    supportDays: 7,
    badgeText: 'BEST TO START',
  },
  {
    id: 'pkg-2bhk',
    slug: '2bhk',
    name: '2BHK Package',
    tagline: 'Great for compact family homes.',
    price: 14999,
    isPopular: false,
    roomCountDisplay: 'Up to 4 rooms',
    revisionsDisplay: '2 revisions',
    supportDays: 14,
  },
  {
    id: 'pkg-3bhk',
    slug: '3bhk',
    name: '3BHK Package',
    tagline: 'Balanced package for growing households.',
    price: 24999,
    isPopular: true,
    roomCountDisplay: 'Up to 6 rooms',
    revisionsDisplay: '3 revisions',
    supportDays: 21,
    badgeText: 'MOST POPULAR',
  },
  {
    id: 'pkg-villa',
    slug: 'villa',
    name: 'Villa Package',
    tagline: 'Complete design direction for larger homes.',
    price: 49999,
    isPopular: false,
    roomCountDisplay: 'Full home',
    revisionsDisplay: '4 revisions',
    supportDays: 30,
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
