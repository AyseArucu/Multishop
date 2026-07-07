import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variant?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, variant?: string, color?: string) => void;
  clearCart: () => void;
  syncWithServer: (email: string) => Promise<void>;
  setItems: (items: CartItem[]) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getDiscount: () => number;
  getFinalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: async (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.variant === item.variant && i.color === item.color
          );
          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          }
          return { items: [...state.items, item] };
        });

        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        if (email) {
          try {
            await fetch('/api/user/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, action: 'add', item: { ...item, variant: item.variant || item.color || 'Standard' } })
            });
          } catch (e) { console.error(e); }
        }
      },
      removeItem: async (id, variant, color) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.variant === variant && i.color === color)),
        }));

        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        if (email) {
          try {
            await fetch('/api/user/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, action: 'remove', productId: id, variant: variant || color || 'Standard' })
            });
          } catch (e) { console.error(e); }
        }
      },
      updateQuantity: async (id, quantity, variant, color) => {
        set((state) => ({
          items: state.items.map((i) => 
            i.id === id && i.variant === variant && i.color === color ? { ...i, quantity } : i
          ),
        }));

        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        if (email) {
          try {
            await fetch('/api/user/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, action: 'updateQuantity', productId: id, variant: variant || color || 'Standard', quantity })
            });
          } catch (e) { console.error(e); }
        }
      },
      clearCart: async () => {
        set({ items: [] });
        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        if (email) {
          try {
            await fetch('/api/user/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, action: 'clear' })
            });
          } catch (e) { console.error(e); }
        }
      },
      syncWithServer: async (email: string) => {
        try {
          const currentItems = get().items;
          const res = await fetch('/api/user/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, action: 'sync', items: currentItems })
          });
          const data = await res.json();
          if (data.success && data.items) {
            set({ items: data.items });
          }
        } catch (e) { console.error(e); }
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getDiscount: () => {
        const total = get().getTotalPrice();
        // 2000 TL ve üzeri alışverişlerde %10 indirim uygulanır
        return total >= 2000 ? Math.round(total * 0.10) : 0;
      },
      getFinalPrice: () => {
        return get().getTotalPrice() - get().getDiscount();
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
