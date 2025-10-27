"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, ShoppingCart, User, Search, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Products",
    href: "/products",
    icon: Search,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    showBadge: true,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="h-16 md:hidden" />

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="grid h-16 grid-cols-4 gap-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-lg transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.showBadge && totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-2 -top-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>

                {isActive && (
                  <div className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-white" />
                )}
              </Link>
            );
          })}

          {/* Account - Sheet if authenticated, Link if not */}
          {isAuthenticated ? (
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 rounded-lg transition-colors",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs font-medium">Account</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>Account</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2 pb-4 border-b">
                    <p className="font-semibold">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Link
              href="/login"
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 rounded-lg transition-colors",
                pathname === "/login"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Account</span>
              {pathname === "/login" && (
                <div className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-white" />
              )}
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
