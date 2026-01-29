import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { basketService } from '../api/basketService';
import type { ShoppingCart, ShoppingCartItem } from '../types/cart';

interface CartStore {
  cart: ShoppingCart | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadCart: () => Promise<void>;
  addItem: (item: ShoppingCartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      loadCart: async () => {
        set({ loading: true, error: null });
        try {
          const cart = await basketService.loadUserBasket();
          set({ cart, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      addItem: async (item: ShoppingCartItem) => {
        const { cart } = get();
        if (!cart) return;

        const existingItem = cart.items.find((i) => i.productId === item.productId);
        let updatedItems: ShoppingCartItem[];

        if (existingItem) {
          updatedItems = cart.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updatedItems = [...cart.items, item];
        }

        const updatedCart: ShoppingCart = {
          ...cart,
          items: updatedItems,
          totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };

        set({ cart: updatedCart });
        await get().syncCart();
      },

      removeItem: async (productId: string) => {
        const { cart } = get();
        if (!cart) return;

        const updatedItems = cart.items.filter((i) => i.productId !== productId);
        const updatedCart: ShoppingCart = {
          ...cart,
          items: updatedItems,
          totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };

        set({ cart: updatedCart });
        await get().syncCart();
      },

      updateQuantity: async (productId: string, quantity: number) => {
        const { cart } = get();
        if (!cart) return;

        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        const updatedItems = cart.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        const updatedCart: ShoppingCart = {
          ...cart,
          items: updatedItems,
          totalPrice: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };

        set({ cart: updatedCart });
        await get().syncCart();
      },

      clearCart: async () => {
        const { cart } = get();
        if (!cart) return;

        try {
          await basketService.deleteBasket(cart.userName);
          set({ cart: { userName: cart.userName, items: [], totalPrice: 0 } });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      syncCart: async () => {
        const { cart } = get();
        if (!cart) return;

        try {
          await basketService.storeBasket({ cart });
        } catch (error: any) {
          set({ error: error.message });
        }
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);