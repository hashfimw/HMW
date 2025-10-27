// src/store/cartStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product, CartItem, Cart } from "@/types";
import { STORAGE_KEYS } from "@/constants/index.";

interface CartStore extends Cart {
  // Actions
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
}

/**
 * Calculate cart totals
 */
const calculateTotals = (
  items: CartItem[]
): { totalItems: number; subtotal: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return { totalItems, subtotal };
};

/**
 * Zustand Cart Store
 *
 * Flow:
 * 1. User click "Add to Cart" → addItem() dipanggil
 * 2. Check apakah product sudah ada di cart
 * 3. Jika ada, update quantity. Jika tidak, tambah item baru
 * 4. Recalculate totals (totalItems & subtotal)
 * 5. Persist ke localStorage secara otomatis
 * 6. Component yang subscribe ke store akan re-render
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      totalItems: 0,
      subtotal: 0,

      // Actions

      /**
       * Add item to cart
       * - Jika product sudah ada, quantity ditambah
       * - Jika product baru, tambahkan ke array items
       */
      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          let newItems: CartItem[];

          if (existingItem) {
            // Product sudah ada, update quantity
            newItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Product baru, tambahkan ke cart
            newItems = [
              ...state.items,
              {
                product,
                quantity,
                selectedVariant: variant,
              },
            ];
          }

          const { totalItems, subtotal } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            subtotal,
          };
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.product.id !== productId
          );
          const { totalItems, subtotal } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            subtotal,
          };
        });
      },

      /**
       * Update item quantity
       * - Jika quantity 0, item akan dihapus
       */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
          const { totalItems, subtotal } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            subtotal,
          };
        });
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          subtotal: 0,
        });
      },

      /**
       * Get quantity of specific item in cart
       */
      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.product.id === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: STORAGE_KEYS.CART, // Key untuk localStorage
      // Hanya persist items, totalItems, dan subtotal
      // Actions tidak perlu di-persist
    }
  )
);
