import { create } from 'zustand';
export const useProjectStore = create((set) => ({
    currentProject: null,
    setCurrentProject: (project) => set({ currentProject: project }),
    clearProject: () => set({ currentProject: null }),
}));
