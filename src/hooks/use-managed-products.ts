"use client";

import { useSyncExternalStore } from "react";
import { MANGO_PRODUCTS } from "@/lib/mangos";
import {
  MANAGED_PRODUCTS_EVENT,
  MANAGED_PRODUCTS_STORAGE_KEY,
  readManagedProducts,
} from "@/lib/managed-products";

function subscribeToManagedProducts(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === MANAGED_PRODUCTS_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(MANAGED_PRODUCTS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(MANAGED_PRODUCTS_EVENT, onStoreChange);
  };
}

export function useManagedProducts() {
  return useSyncExternalStore(
    subscribeToManagedProducts,
    readManagedProducts,
    () => MANGO_PRODUCTS
  );
}
