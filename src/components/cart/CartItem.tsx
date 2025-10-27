"use client";

import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  variant?: "default" | "compact";
}

export function CartItem({ item, variant = "default" }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;
  const itemTotal = discountedPrice * quantity;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  if (variant === "compact") {
    return (
      <div className="flex gap-3 py-3">
        <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-1">{product.title}</h4>
          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-semibold text-sm">
              {formatCurrency(discountedPrice)}
            </span>
            <span className="text-xs text-muted-foreground">x {quantity}</span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemove}>
            <Trash2 className="h-3 w-3" />
          </Button>
          <span className="font-semibold text-sm">{formatCurrency(itemTotal)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-border/50 rounded-lg bg-card">
      {/* Image and Basic Info */}
      <div className="flex gap-3 sm:gap-4 flex-1">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
            {product.title}
          </h4>
          <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm sm:text-base">
              {formatCurrency(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
                <Badge variant="destructive" className="text-xs h-5">
                  {product.discountPercentage.toFixed(0)}% OFF
                </Badge>
              </>
            )}
          </div>

          {/* Mobile: Stock Info */}
          <p className="text-xs text-muted-foreground mt-1 sm:hidden">
            Stock: {product.stock} units
          </p>
        </div>
      </div>

      {/* Quantity Controls and Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-2">
        {/* Quantity Selector */}
        <div className="flex items-center border border-border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 sm:w-10 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleIncrement}
            disabled={quantity >= product.stock}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Total and Remove */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground sm:hidden">Total</p>
            <span className="font-bold text-sm sm:text-base">
              {formatCurrency(itemTotal)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
