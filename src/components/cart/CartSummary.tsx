// src/components/cart/CartSummary.tsx

"use client";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  onCheckout?: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const { items, totalItems, subtotal, checkout } = useCart();

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      checkout();
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop: Sticky Card */}
      <div className="hidden lg:block border border-border/50 rounded-lg p-6 bg-card sticky top-20">
        <h3 className="font-bold text-lg mb-4">Order Summary</h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Items</span>
            <span className="font-medium">{totalItems}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold">{formatCurrency(subtotal)}</span>
        </div>

        <Button
          className="w-full h-12 text-base"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          <SiWhatsapp className="h-5 w-5 mr-2" />
          Checkout via WhatsApp
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          You will be redirected to WhatsApp with order details pre-filled
        </p>
      </div>

      {/* Mobile: Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 space-y-3 z-40">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Total ({totalItems} items)</p>
            <p className="text-xl font-bold">{formatCurrency(subtotal)}</p>
          </div>
          <Button
            className="h-11 px-6"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            <SiWhatsapp className="h-4 w-4 mr-2" />
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
