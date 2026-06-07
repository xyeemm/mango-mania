"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MangoProduct } from "@/types/mango";

export type CartItem = {
  product: MangoProduct;
  quantity: number;
};

const CART_STORAGE_KEY = "mango-mania-cart";

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    !!item.product &&
    typeof item.product === "object" &&
    typeof item.product.id === "string" &&
    typeof item.product.name === "string"
  );
}

function readSavedCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(savedCart) as unknown;

    return Array.isArray(parsedCart) ? parsedCart.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readSavedCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: MangoProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [items]
  );

  const itemCount = items.length;

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };
}

export type CartApi = ReturnType<typeof useCart>;
