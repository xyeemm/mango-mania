"use client";

import { useSyncExternalStore } from "react";
import {
  ORDERS_EVENT,
  ORDERS_STORAGE_KEY,
  type StoreOrder,
  readOrders,
} from "@/lib/orders";

const EMPTY_ORDERS: StoreOrder[] = [];

function subscribeToOrders(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === ORDERS_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(ORDERS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ORDERS_EVENT, onStoreChange);
  };
}

export function useOrders() {
  return useSyncExternalStore(subscribeToOrders, readOrders, () => EMPTY_ORDERS);
}
