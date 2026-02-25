/** Stub types after removing @supabase/supabase-js. Use Next.js API + Prisma for backend. */

export interface RealtimeChannel {
  unsubscribe: () => void;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}
