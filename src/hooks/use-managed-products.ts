"use client";

import { useEffect, useState } from "react";
import { MANGO_PRODUCTS } from "@/lib/mangos";
import {
  MANAGED_PRODUCTS_EVENT,
  fetchProducts,
} from "@/lib/managed-products";

export function useManagedProducts() {
  const [products, setProducts] = useState(MANGO_PRODUCTS);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        const nextProducts = await fetchProducts();

        if (active) {
          setProducts(nextProducts);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load products."
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();
    window.addEventListener(MANAGED_PRODUCTS_EVENT, loadProducts);

    return () => {
      active = false;
      window.removeEventListener(MANAGED_PRODUCTS_EVENT, loadProducts);
    };
  }, []);

  return { products, error, isLoading };
}
