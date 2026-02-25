import { create } from 'zustand';
export const useCartStore = create((set) => ({
    items: [],
    total: 0,
    addItem: (item) => set((state) => ({
        items: [...state.items, item],
        total: state.total + item.price
    })),
    removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id),
        total: state.items.reduce((sum, i) => i.id !== id ? sum + i.price : sum, 0)
    })),
    clearCart: () => set({ items: [], total: 0 }),
}));
