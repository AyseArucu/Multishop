import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteStore {
  items: string[]; // array of product IDs
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  syncWithServer: (email: string) => Promise<void>;
  setItems: (items: string[]) => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      toggleFavorite: async (id) => {
        const state = get();
        const isFav = state.items.includes(id);
        const newItems = isFav ? state.items.filter((i) => i !== id) : [...state.items, id];
        
        set({ items: newItems });

        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        if (email) {
          try {
            await fetch('/api/user/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                action: isFav ? 'remove' : 'add',
                productId: id
              })
            });
          } catch (e) {
            console.error('Failed to sync favorite with server', e);
          }
        }
      },
      isFavorite: (id) => {
        return get().items.includes(id);
      },
      syncWithServer: async (email: string) => {
        try {
          const currentItems = get().items;
          const res = await fetch('/api/user/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              action: 'sync',
              items: currentItems
            })
          });
          const data = await res.json();
          if (data.success && data.items) {
            set({ items: data.items });
          }
        } catch (e) {
          console.error('Failed to sync favorites on login', e);
        }
      }
    }),
    {
      name: 'favorite-storage',
    }
  )
);
