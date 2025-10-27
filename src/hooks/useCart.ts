// src/hooks/useCart.ts

import { useCartStore } from "@/store/cartStore";
import { generateWhatsAppLink } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types";

/**
 * Custom hook untuk Cart operations
 *
 * Kenapa pakai custom hook?
 * - Abstraction: Component tidak perlu tahu detail implementasi store
 * - Reusability: Logic bisa dipakai di banyak component
 * - Testability: Mudah di-test secara terpisah
 *
 * Usage di component:
 * const { items, addToCart, checkout } = useCart();
 */
export const useCart = () => {
  const cart = useCartStore();

  /**
   * Add to cart with toast notification
   */
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    cart.addItem(product, quantity, variant);

    toast({
      title: "Added to cart! 🛒",
      description: `${product.title} (${quantity}x)`,
    });
  };

  /**
   * Remove from cart with toast notification
   */
  const removeFromCart = (productId: number) => {
    const item = cart.items.find((item) => item.product.id === productId);
    cart.removeItem(productId);

    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.product.title}`,
        variant: "destructive",
      });
    }
  };

  /**
   * Checkout via WhatsApp
   */
  const checkout = () => {
    if (cart.items.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const whatsappLink = generateWhatsAppLink({
      items: cart.items,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
    });

    window.open(whatsappLink, "_blank");
  };

  /**
   * Check if product is in cart
   */
  const isInCart = (productId: number): boolean => {
    return cart.items.some((item) => item.product.id === productId);
  };

  return {
    // State
    items: cart.items,
    totalItems: cart.totalItems,
    subtotal: cart.subtotal,

    // Actions (with toast)
    addToCart,
    removeFromCart,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    getItemQuantity: cart.getItemQuantity,

    // Helper functions
    checkout,
    isInCart,
  };
};
