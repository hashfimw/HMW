// src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCatalogProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getAllCatalogProducts();
        const shuffled = products.sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Extended to behind navbar on mobile + desktop */}
      <section className="relative overflow-hidden -mt-16 pt-16 md:-mt-16 md:pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background opacity-50" />
        <Image
          src="/Hero2.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-center opacity-30"
          sizes="100vw"
          priority
        />

        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="px-4 py-2 text-sm" variant="secondary">
              <Sparkles className="h-3 w-3 mr-2" />
              HMW Exclusive Collection
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Style & <span className="gradient-text">Quality.</span>{" "}
              <br className="hidden md:block" />
              Confidence by HMW
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto hover:text-white transition-colors">
              Discover premium menswear, timeless footwear, and classic accessories —
              built for men who move with purpose and style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">100+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">Fast</div>
                <div className="text-sm text-muted-foreground">Checkout</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Handpicked premium items from our catalog
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Button asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">About This Project</h2>
            <p className="text-lg text-muted-foreground">
              This project was developed by{" "}
              <span className="font-regular">Hashfi Mawarid</span> for testing and
              demonstration purposes. You can explore more of my work and projects on my
              portfolio website.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link
                  href="https://hashfimw.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit My Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
