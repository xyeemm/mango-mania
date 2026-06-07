"use client";

import { useEffect, useState } from "react";
import { ORDERS_EVENT, type StoreOrder } from "@/lib/orders";

export function useOrders() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/orders");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to load orders.");
        }

        if (active) {
          setOrders(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load orders.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadOrders();
    window.addEventListener(ORDERS_EVENT, loadOrders);

    return () => {
      active = false;
      window.removeEventListener(ORDERS_EVENT, loadOrders);
    };
  }, []);

  return { orders, isLoading, error };
}
