"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, clearCart } = useCart();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearCart = () => {
    const itemCount = items.length;
    clearCart();
    setShowClearDialog(false);

    toast({
      title: "Cart cleared",
      description: `${itemCount} ${itemCount === 1 ? "item" : "items"} removed`,
      variant: "destructive",
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">Your cart is empty</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Continue Shopping</span>
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Shopping Cart</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowClearDialog(true)}
          className="text-destructive hover:text-destructive w-full sm:w-auto"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <div className="lg:block">
          <div className="lg:sticky lg:top-20">
            <CartSummary />
          </div>
        </div>
      </div>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Clear Shopping Cart?</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Are you sure you want to remove all {items.length}{" "}
              {items.length === 1 ? "item" : "items"} from your cart? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearCart}
              className="w-full sm:w-auto"
            >
              Clear Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
