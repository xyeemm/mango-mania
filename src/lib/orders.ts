import type { CartItem } from "@/hooks/use-cart";
import type { StoreOrder, StoreOrderItem } from "@/types/order";

export type { StoreOrder, StoreOrderItem };

export const ORDERS_EVENT = "mango-mania-orders-updated";

export function createStoreOrder({
  address,
  items,
  name,
  phone,
  total,
}: {
  address: string;
  items: CartItem[];
  name: string;
  phone: string;
  total: number;
}): StoreOrder {
  const orderItems = items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    variety: item.product.variety,
    unit: item.product.unit,
    price: item.product.price,
    quantity: item.quantity,
    lineTotal: item.product.price * item.quantity,
  }));

  return {
    id: `MM-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer: {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    },
    items: orderItems,
    itemCount: orderItems.reduce((sum, item) => sum + item.quantity, 0),
    total,
    paymentMethod: "Cash on delivery",
    status: "New",
  };
}

export async function addOrder(order: StoreOrder) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to place order.");
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ORDERS_EVENT));
  }

  return result;
}
