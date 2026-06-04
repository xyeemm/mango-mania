import { type MangoProduct } from "@/lib/mangos";

export const MANAGED_PRODUCTS_EVENT = "mango-mania-products-updated";

type ApiError = {
  error?: string;
};

function isApiError(value: unknown): value is ApiError {
  return !!value && typeof value === "object" && "error" in value;
}

export function notifyProductsChanged() {
  window.dispatchEvent(new Event(MANAGED_PRODUCTS_EVENT));
}

export async function fetchProducts() {
  const response = await fetch("/api/products");
  const products = (await response.json()) as MangoProduct[] | { error?: string };

  if (!response.ok || !Array.isArray(products)) {
    throw new Error(
      Array.isArray(products)
        ? "Unable to load products."
        : products.error ?? "Unable to load products."
    );
  }

  return products;
}

export async function createProduct(product: MangoProduct) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const result = (await response.json()) as MangoProduct | { error?: string };

  if (!response.ok || isApiError(result)) {
    throw new Error(
      isApiError(result) ? result.error ?? "Unable to create product." : "Unable to create product."
    );
  }

  notifyProductsChanged();
  return result;
}

export async function updateProduct(productId: string, product: MangoProduct) {
  const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const result = (await response.json()) as MangoProduct | { error?: string };

  if (!response.ok || isApiError(result)) {
    throw new Error(
      isApiError(result) ? result.error ?? "Unable to update product." : "Unable to update product."
    );
  }

  notifyProductsChanged();
  return result;
}

export async function deleteProductById(productId: string) {
  const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
  const result = (await response.json()) as { ok?: boolean; error?: string };

  if (!response.ok) {
    throw new Error(result.error ?? "Unable to delete product.");
  }

  notifyProductsChanged();
}

export async function resetProducts() {
  const response = await fetch("/api/products", {
    method: "DELETE",
  });
  const result = (await response.json()) as MangoProduct[] | { error?: string };

  if (!response.ok || !Array.isArray(result)) {
    throw new Error(
      Array.isArray(result)
        ? "Unable to reset products."
        : result.error ?? "Unable to reset products."
    );
  }

  notifyProductsChanged();
  return result;
}
