"use client";

import { useState, type ReactNode } from "react";
import { CartSheet } from "@/components/cart-sheet";
import { StoreFooter } from "@/components/store-footer";
import { StoreHeader } from "@/components/store-header";
import { useCartContext } from "@/context/cart-context";

type StoreShellProps = {
  children: ReactNode;
};

export function StoreShell({ children }: StoreShellProps) {
  const cart = useCartContext();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <StoreHeader onCartOpen={() => setCartOpen(true)} />
      <div className="flex flex-1 flex-col">{children}</div>
      <StoreFooter />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} cart={cart} />
    </div>
  );
}
