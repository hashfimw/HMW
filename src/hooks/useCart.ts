import { useCartStore } from "@/store/cartStore";
import { generateWhatsAppLink } from "@/lib/utils";
import { toast } from "@/hooks/useToast";
import type { Product } from "@/types";

export const useCart = () => {
  const cart = useCartStore();

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    cart.addItem(product, quantity, variant);
    toast({
      title: "Added to cart! 🛒",
      description: `${product.title} (${quantity}x)`,
    });
  };

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
    cart.clearCart();
    toast({
      title: "Order sent!",
      description: "Your cart has been cleared.",
    });
  };

  const isInCart = (productId: number): boolean => {
    return cart.items.some((item) => item.product.id === productId);
  };

  const originalSubtotal = cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const totalSavings = originalSubtotal - cart.subtotal;

  return {
    items: cart.items,
    totalItems: cart.totalItems,
    subtotal: cart.subtotal,
    originalSubtotal,
    totalSavings,
    addToCart,
    removeFromCart,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    getItemQuantity: cart.getItemQuantity,
    checkout,
    isInCart,
  };
};
