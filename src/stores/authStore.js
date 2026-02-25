import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    session: null,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    logout: () => set({ user: null, session: null }),
}));
