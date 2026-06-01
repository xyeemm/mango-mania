"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCart, type CartApi } from "@/hooks/use-cart";

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartApi {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return cart;
}
