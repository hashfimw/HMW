"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductDialog } from "./ProductDialog";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [_isHovered, setIsHovered] = useState(false);
  const { addToCart, isInCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;
  const inCart = isInCart(product.id);

  return (
    <>
      <Card
        className="group relative overflow-hidden border-border/50 bg-card hover:border-border transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowDialog(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setShowDialog(true);
              }}
              className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              View Details
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.discountPercentage > 0 && (
              <Badge variant="destructive" className="shadow-lg">
                -{product.discountPercentage.toFixed(0)}%
              </Badge>
            )}
            {product.stock < 10 && (
              <Badge variant="secondary" className="shadow-lg">
                Low Stock
              </Badge>
            )}
          </div>
          {inCart && (
            <div className="absolute top-2 right-2">
              <Badge className="shadow-lg bg-white text-black">
                <ShoppingCart className="h-3 w-3 mr-1" />
                In Cart
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.category.replace("-", " ")}
          </p>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-xs text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviews?.length || 0})
            </span>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-xl font-bold">{formatCurrency(discountedPrice)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          <Button
            className="w-full"
            onClick={handleQuickAdd}
            variant={inCart ? "secondary" : "default"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {inCart ? "Add More" : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>

      <ProductDialog product={product} open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}
