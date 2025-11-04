import { useState } from "react";
import { z } from "zod";
import { useCart } from "./useCart";
import { getProductVariants, formatVariantLabel } from "@/constants/variants";
import { formatCurrency } from "@/lib/utils";
import { toast } from "./useToast";
import type { Product } from "@/types";

const createQuantitySchema = (maxStock: number) =>
  z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(maxStock, `Maximum quantity is ${maxStock} (available stock)`);

export function useProductDialog(product: Product) {
  const variants = getProductVariants(product.category);
  const { addToCart, getItemQuantity } = useCart();

  // State
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(variants.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(variants.colors[0]);

  // Computed values
  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;
  const total = discountedPrice * quantity;
  const inCartQty = getItemQuantity(product.id);
  const variantLabel = formatVariantLabel(selectedSize, selectedColor.name);

  // Zod schema untuk current product
  const quantitySchema = createQuantitySchema(product.stock);

  const validateQuantity = (value: number): { success: boolean; error?: string } => {
    const result = quantitySchema.safeParse(value);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid quantity";
      return { success: false, error: errorMessage };
    }

    return { success: true };
  };

  const handleQuantityChange = (value: string) => {
    // Allow empty string saat user mengetik
    if (value === "") {
      setQuantity("" as any);
      return;
    }

    const numValue = parseInt(value, 10);

    // Skip jika bukan number valid
    if (isNaN(numValue)) return;

    // Set tanpa validation dulu (validation saat blur)
    if (numValue >= 0 && numValue <= product.stock) {
      setQuantity(numValue);
    } else if (numValue > product.stock) {
      setQuantity(product.stock);
      toast({
        title: "Stock limit reached",
        description: `Maximum available stock is ${product.stock} units`,
        variant: "destructive",
      });
    }
  };

  const handleQuantityBlur = () => {
    const currentValue = Number(quantity);

    if (!quantity || isNaN(currentValue)) {
      setQuantity(1);
      return;
    }

    const validation = validateQuantity(currentValue);

    if (!validation.success) {
      // Auto-correct ke valid value
      if (currentValue < 1) {
        setQuantity(1);
      } else if (currentValue > product.stock) {
        setQuantity(product.stock);
      }

      toast({
        title: "Quantity adjusted",
        description: validation.error,
        variant: "destructive",
      });
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast({
        title: "Stock limit reached",
        description: `Only ${product.stock} units available`,
        variant: "destructive",
      });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = (onSuccess?: () => void) => {
    const validation = validateQuantity(Number(quantity));

    if (!validation.success) {
      toast({
        title: "Invalid quantity",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    addToCart(product, Number(quantity), variantLabel);
    onSuccess?.();
  };

  const handleBuyNow = (onSuccess?: () => void) => {
    const validation = validateQuantity(Number(quantity));

    if (!validation.success) {
      toast({
        title: "Invalid quantity",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    addToCart(product, Number(quantity), variantLabel);

    const message = `*🛍️ NEW ORDER*\n\n1. ${product.title}\n   SKU: ${
      product.sku
    }\n   Variant: ${variantLabel}\n   Qty: ${quantity}x @ ${formatCurrency(
      discountedPrice
    )}\n   Subtotal: ${formatCurrency(
      total
    )}\n\n---\n*Total Items:* ${quantity}\n*Grand Total:* ${formatCurrency(
      total
    )}\n\nMohon proses pesanan ini. Terima kasih! 🙏`;

    const whatsappLink = `https://wa.me/${
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    }?text=${encodeURIComponent(message)}`;

    window.open(whatsappLink, "_blank");
    onSuccess?.();
  };

  return {
    quantity,
    selectedImage,
    selectedSize,
    selectedColor,
    variants,
    discountedPrice,
    total,
    inCartQty,
    variantLabel,
    setSelectedImage,
    setSelectedSize,
    setSelectedColor,
    handleQuantityChange,
    handleQuantityBlur,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart,
    handleBuyNow,
  };
}
