/**
 * Mock Prisma client for frontend-only mode.
 */
export const prisma = new Proxy({}, {
  get(target, prop) {
    return {
      findMany: async () => [],
      findUnique: async () => null,
      findFirst: async () => null,
      create: async (args) => args.data,
      update: async (args) => args.data,
      delete: async () => ({ success: true }),
      count: async () => 0,
    };
  }
});
