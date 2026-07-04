import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// المفضلة: قائمة معرّفات منتجات محفوظة محلياً
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      toggle: (id) =>
        set({
          ids: get().ids.includes(id)
            ? get().ids.filter((x) => x !== id)
            : [...get().ids, id],
        }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'narges-favorites', storage: createJSONStorage(() => localStorage) }
  )
);
