"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/cart-context";

type StoreHeaderProps = {
  onCartOpen: () => void;
};

export function StoreHeader({ onCartOpen }: StoreHeaderProps) {
  const cart = useCartContext();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            MM
          </span>
          <div>
            <p className="font-heading text-base font-semibold leading-none tracking-tight">
              Mango Mania
            </p>
            <p className="text-[11px] text-muted-foreground">Premium produce</p>
          </div>
        </Link>

        

        <Button
          variant="outline"
          size="default"
          className="relative shrink-0"
          onClick={onCartOpen}
        >
          <ShoppingCart />
          <span className="hidden sm:inline">Cart</span>
          {cart.itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {cart.itemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
