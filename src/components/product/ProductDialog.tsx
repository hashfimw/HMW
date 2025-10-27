"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Minus,
  Plus,
  Star,
  Package,
  Truck,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDialog({ product, open, onOpenChange }: ProductDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, getItemQuantity } = useCart();

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;
  const total = discountedPrice * quantity;
  const inCartQty = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onOpenChange(false);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);

    const message = `*NEW ORDER*\n\n1. ${product.title}\n   SKU: ${
      product.sku
    }\n   Qty: ${quantity}x @ ${formatCurrency(
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
    onOpenChange(false);
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] md:max-h-[90vh] p-0 flex flex-col max-md:h-full max-md:max-h-full max-md:w-full max-md:max-w-full max-md:rounded-none max-md:m-0">
        {/* Mobile: Back Button (Absolute/Sticky) */}
        <button
          onClick={() => onOpenChange(false)}
          className="md:hidden absolute top-4 left-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0 overflow-y-auto flex-1">
          <div className="relative bg-secondary md:p-6 p-0">
            <div className="relative aspect-square md:mb-4 md:rounded-lg overflow-hidden bg-background/50">
              <Image
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="hidden md:grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-white"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Mobile: Image Thumbnails */}
            <div className="md:hidden px-4 py-3 flex gap-2 overflow-x-auto justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-white"
                      : "border-transparent opacity-50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-4 pb-36 md:pb-6">
            <DialogHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">
                    {product.category.replace("-", " ")}
                  </Badge>
                  <DialogTitle className="text-xl md:text-2xl font-bold leading-tight">
                    {product.title}
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>

            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({product.reviews?.length || 0})
                </span>
              </div>
              {product.brand && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-muted-foreground">Brand: {product.brand}</span>
                </>
              )}
            </div>

            <Separator />

            <div>
              <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                <span className="text-2xl md:text-3xl font-bold">
                  {formatCurrency(discountedPrice)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-base md:text-lg text-muted-foreground line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge variant="destructive">
                      Save {product.discountPercentage.toFixed(0)}%
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm md:text-base">Description</h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>
                  Stock: <span className="font-medium">{product.stock} units</span>
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-muted-foreground">SKU: {product.sku}</span>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQty}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQty}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 text-xs md:text-sm text-muted-foreground">
                  {inCartQty > 0 && (
                    <span className="text-primary">{inCartQty} in cart</span>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:block space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full h-12 text-base"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-base"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now via WhatsApp
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{product.shippingInformation}</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{product.warrantyInformation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Sticky Bottom Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 space-y-3 safe-area-inset-bottom">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-xl font-bold">{formatCurrency(total)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="h-11"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              <span className="text-sm">Add to Cart</span>
            </Button>
            <Button
              variant="outline"
              className="h-11"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <span className="text-sm">Buy Now</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
