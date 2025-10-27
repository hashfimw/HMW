import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem, Cart } from "@/types";
import { STORAGE_KEYS } from "@/constants/index.";

interface CartStore extends Cart {
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
}

const calculateTotals = (items: CartItem[]): { totalItems: number; subtotal: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // UBAH DI SINI: Hitung dengan harga diskon
  const subtotal = items.reduce((sum, item) => {
    const discountedPrice =
      item.product.price - (item.product.price * item.product.discountPercentage) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);

  return { totalItems, subtotal };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          let newItems: CartItem[];

          if (existingItem) {
            newItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
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
          const newItems = state.items.filter((item) => item.product.id !== productId);
          const { totalItems, subtotal } = calculateTotals(newItems);
          return {
            items: newItems,
            totalItems,
            subtotal,
          };
        });
      },

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

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          subtotal: 0,
        });
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.product.id === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: STORAGE_KEYS.CART,
    }
  )
);
