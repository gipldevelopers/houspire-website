import {
  MOCK_USER,
  MOCK_NOTIFICATIONS,
  MOCK_PROJECTS,
} from './mock-data';
import { FALLBACK_DESIGN_STYLES } from './fallback-design-styles';
import { FALLBACK_GALLERY_DESIGNS } from './fallback-gallery';

const TABLE_DATA = {
  design_styles: FALLBACK_DESIGN_STYLES,
  gallery_designs: FALLBACK_GALLERY_DESIGNS,
  in_app_notifications: MOCK_NOTIFICATIONS.map((item) => ({
    ...item,
    user_id: MOCK_USER.id,
    read: item.read ?? false,
    created_at: item.createdAt || new Date().toISOString(),
  })),
  projects: MOCK_PROJECTS,
  project_content: [],
  designers: [],
  profiles: [MOCK_USER],
  concept_products: [],
  reviews: [],
};

function result(data = null, error = null) {
  return Promise.resolve({ data, error, count: Array.isArray(data) ? data.length : data ? 1 : 0 });
}

function queryBuilder(table) {
  let rows = Array.isArray(TABLE_DATA[table]) ? [...TABLE_DATA[table]] : [];

  const builder = {
    select() {
      return builder;
    },
    insert(payload) {
      const items = Array.isArray(payload) ? payload : [payload];
      rows = items.map((item, index) => ({
        id: item.id || `${table}-${Date.now()}-${index}`,
        ...item,
      }));
      return builder;
    },
    upsert(payload) {
      return builder.insert(payload);
    },
    update(payload) {
      rows = rows.map((row) => ({ ...row, ...payload }));
      return builder;
    },
    delete() {
      rows = [];
      return builder;
    },
    eq(field, value) {
      rows = rows.filter((row) => row?.[field] === value);
      return builder;
    },
    neq(field, value) {
      rows = rows.filter((row) => row?.[field] !== value);
      return builder;
    },
    not(field, operator, value) {
      if (operator === 'is') {
        rows = rows.filter((row) => row?.[field] !== value);
      }
      return builder;
    },
    in(field, values) {
      rows = rows.filter((row) => values.includes(row?.[field]));
      return builder;
    },
    ilike(field, value) {
      const needle = String(value).replace(/%/g, '').toLowerCase();
      rows = rows.filter((row) => String(row?.[field] || '').toLowerCase().includes(needle));
      return builder;
    },
    like(field, value) {
      return builder.ilike(field, value);
    },
    gte() {
      return builder;
    },
    lte() {
      return builder;
    },
    lt() {
      return builder;
    },
    gt() {
      return builder;
    },
    contains() {
      return builder;
    },
    overlap() {
      return builder;
    },
    or() {
      return builder;
    },
    filter() {
      return builder;
    },
    match(criteria = {}) {
      rows = rows.filter((row) =>
        Object.entries(criteria).every(([key, value]) => row?.[key] === value)
      );
      return builder;
    },
    order(field, options = {}) {
      const modifier = options.ascending === false ? -1 : 1;
      rows.sort((a, b) => {
        if (a?.[field] < b?.[field]) return -1 * modifier;
        if (a?.[field] > b?.[field]) return 1 * modifier;
        return 0;
      });
      return builder;
    },
    limit(value) {
      rows = rows.slice(0, value);
      return builder;
    },
    range(from, to) {
      rows = rows.slice(from, to + 1);
      return builder;
    },
    maybeSingle() {
      return result(rows[0] || null);
    },
    single() {
      return result(rows[0] || null);
    },
    then(resolve, reject) {
      return result(rows, null).then(resolve, reject);
    },
  };

  return builder;
}

function createChannel() {
  return {
    on() {
      return this;
    },
    subscribe() {
      return this;
    },
    unsubscribe() {
      return this;
    },
  };
}

export const appDataClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: MOCK_USER }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: MOCK_USER }, error: null }),
    signUp: () => Promise.resolve({ data: { user: MOCK_USER }, error: null }),
    signOut: () => Promise.resolve({ data: null, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    updateUser: () => Promise.resolve({ data: { user: MOCK_USER }, error: null }),
    resend: () => Promise.resolve({ data: null, error: null }),
    resetPasswordForEmail: () => Promise.resolve({ data: null, error: null }),
    setSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
  from(table) {
    return queryBuilder(table);
  },
  rpc(name) {
    const rpcResponses = {
      get_grouped_notifications: { groups: MOCK_NOTIFICATIONS },
      mark_all_notifications_read: { success: true },
      mark_notification_read: { success: true },
      validate_promo_code: { valid: false, discountAmount: 0 },
      check_budget_health: { health: 'healthy' },
      get_project_share_analytics: { views: 0, clicks: 0 },
    };

    return Promise.resolve({
      data: rpcResponses[name] ?? null,
      error: null,
    });
  },
  functions: {
    invoke() {
      return Promise.resolve({ data: null, error: null });
    },
  },
  storage: {
    from() {
      return {
        upload: () => Promise.resolve({ data: { path: '' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '/placeholder.svg' } }),
        remove: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
      };
    },
  },
  channel() {
    return createChannel();
  },
  removeChannel() {
    return Promise.resolve({ error: null });
  },
};
