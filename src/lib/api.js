/**
 * API utility functions for making authenticated requests.
 * When backend returns 5xx/4xx, returns safe empty data so frontend works without a backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Get auth token from localStorage
 */
function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

import { MOCK_USER, MOCK_PROJECTS, MOCK_ORDERS, MOCK_NOTIFICATIONS, MOCK_REFERRAL } from './mock-data';
import { FALLBACK_GALLERY_DESIGNS } from './fallback-gallery';
import { FALLBACK_DESIGN_STYLES } from './fallback-design-styles';

/**
 * Safe empty responses/mock data so the frontend never crashes and works without a backend.
 */
function getMockResponseForEndpoint(endpoint) {
  const path = endpoint.split('?')[0];
  
  // Gallery and Styles
  if (path.includes('/api/gallery')) {
    return { designs: FALLBACK_GALLERY_DESIGNS, pagination: { page: 1, limit: 20, total: FALLBACK_GALLERY_DESIGNS.length, totalPages: 1 } };
  }
  if (path.includes('/api/design-styles')) {
    return { styles: FALLBACK_DESIGN_STYLES };
  }
  
  // Auth
  if (path.includes('/api/auth/me')) return { user: MOCK_USER };
  if (path.includes('/api/auth/login')) return { user: MOCK_USER, token: 'mock-jwt-token' };
  if (path.includes('/api/auth/signup')) return { user: MOCK_USER, token: 'mock-jwt-token' };
  
  // Dashboard Core
  if (path.includes('/api/orders')) return { orders: MOCK_ORDERS, order: MOCK_ORDERS[0] };
  if (path.includes('/api/projects')) return { projects: MOCK_PROJECTS, project: MOCK_PROJECTS[0] };
  if (path.includes('/api/notifications')) return { notifications: MOCK_NOTIFICATIONS };
  if (path.includes('/api/profile')) return { user: MOCK_USER };
  if (path.includes('/api/referrals')) return MOCK_REFERRAL;
  
  // Misc
  if (path.includes('/api/packages')) return { packages: [
    { id: 'fb-trial', slug: 'trial', name: 'Trial', price: 999, isPopular: true },
    { id: 'fb-single', slug: 'single-room', name: 'Single Room', price: 4999, isPopular: false }
  ]};
  if (path.includes('/api/concepts')) return { concepts: [] };
  if (path.includes('/api/quiz-results')) return { results: [] };
  
  return {};
}

/**
 * Make an API request. Fully mocked to return local data instantly.
 */
export async function apiRequest(endpoint, options = {}) {
  // Simulate network delay for better UX feel during transition
  await new Promise(resolve => setTimeout(resolve, 300));

  console.log(`[Mock API] Request to: ${endpoint}`, options);
  
  // Return mock data for all handled endpoints
  const mockData = getMockResponseForEndpoint(endpoint);
  
  // Handle POST/PUT "success" simulate
  if (options.method && options.method !== 'GET') {
    return { success: true, message: 'Mock action successful', ...mockData };
  }

  return mockData;
}

/**
 * GET request
 */
export async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH request
 */
export async function apiPatch(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * Upload file - Mocked to return a local URL
 */
export async function apiUpload(endpoint, file, additionalData = {}) {
  console.log(`[Mock Upload] to: ${endpoint}`, file.name);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    file_url: URL.createObjectURL(file),
    public_id: 'mock-public-id'
  };
}
