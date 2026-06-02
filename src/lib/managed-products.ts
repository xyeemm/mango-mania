import { MANGO_PRODUCTS, type MangoProduct } from "@/lib/mangos";

export const MANAGED_PRODUCTS_STORAGE_KEY = "mango-mania-admin-products";
export const MANAGED_PRODUCTS_EVENT = "mango-mania-products-updated";

let cachedProducts: MangoProduct[] = MANGO_PRODUCTS;
let cachedRawProducts: string | null = null;

export function readManagedProducts(): MangoProduct[] {
  if (typeof window === "undefined") {
    return MANGO_PRODUCTS;
  }

  const savedProducts = window.localStorage.getItem(MANAGED_PRODUCTS_STORAGE_KEY);

  if (!savedProducts) {
    cachedRawProducts = null;
    cachedProducts = MANGO_PRODUCTS;
    return MANGO_PRODUCTS;
  }

  if (savedProducts === cachedRawProducts) {
    return cachedProducts;
  }

  try {
    const parsedProducts = JSON.parse(savedProducts) as MangoProduct[];

    cachedRawProducts = savedProducts;
    cachedProducts = Array.isArray(parsedProducts)
      ? parsedProducts
      : MANGO_PRODUCTS;

    return cachedProducts;
  } catch {
    cachedRawProducts = savedProducts;
    cachedProducts = MANGO_PRODUCTS;

    return MANGO_PRODUCTS;
  }
}

export function saveManagedProducts(products: MangoProduct[]) {
  const serializedProducts = JSON.stringify(products);

  cachedRawProducts = serializedProducts;
  cachedProducts = products;
  window.localStorage.setItem(
    MANAGED_PRODUCTS_STORAGE_KEY,
    serializedProducts
  );
  window.dispatchEvent(new Event(MANAGED_PRODUCTS_EVENT));
}
