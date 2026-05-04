import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Size } from '../data/products';

export interface CartItem {
  product: Product;
  size: Size;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: Size, quantity?: number) => void;
  removeItem: (productId: string, size: Size) => void;
  updateQuantity: (productId: string, size: Size, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.size === size
          );

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }
          
          return { items: [...state.items, { product, size, quantity }] };
        });
      },
      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.size === size)
          )
        }));
      },
      updateQuantity: (productId, size, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.size === size
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      }
    }),
    {
      name: 'tyd-cart-storage',
    }
  )
);
