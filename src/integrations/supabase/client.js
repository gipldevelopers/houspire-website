/**
 * Supabase has been removed. This stub ensures code that still imports
 * from here does not break. Use Next.js API routes + Prisma for backend.
 */

const noop = () => Promise.resolve({ data: null, error: null });
const noopSession = () => Promise.resolve({ data: { session: null }, error: null });

const authStub = {
  getSession: noopSession,
  getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  signInWithPassword: noop,
  signOut: noop,
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  updateUser: noop,
  resend: noop,
  resetPasswordForEmail: noop,
};

const storageStub = {
  from: () => ({
    upload: () => Promise.resolve({ data: null, error: null }),
    getPublicUrl: () => ({ data: { publicUrl: '' } }),
    list: () => Promise.resolve({ data: [], error: null }),
    remove: () => Promise.resolve({ data: null, error: null }),
  }),
};

function stub(table) {
  return {
    select: () => stub(table),
    insert: () => stub(table),
    update: () => stub(table),
    delete: () => stub(table),
    eq: () => stub(table),
    neq: () => stub(table),
    not: () => stub(table),
    or: () => stub(table),
    ilike: () => stub(table),
    filter: () => stub(table),
    match: () => stub(table),
    in: () => stub(table),
    order: () => stub(table),
    limit: () => stub(table),
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve) => Promise.resolve(resolve({ data: null, error: null })),
  };
}

export const supabase = {
  auth: authStub,
  storage: storageStub,
  from: stub,
  functions: {
    invoke: () => Promise.resolve({ data: null, error: null }),
  },
  rpc: () => Promise.resolve({ data: null, error: null }),
};
