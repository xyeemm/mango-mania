import type { CartItem } from "@/hooks/use-cart";

export type StoreOrderItem = {
  productId: string;
  name: string;
  variety: string;
  unit: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type StoreOrder = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: StoreOrderItem[];
  itemCount: number;
  total: number;
  paymentMethod: "Cash on delivery";
  status: "New";
};

export const ORDERS_STORAGE_KEY = "mango-mania-orders";
export const ORDERS_EVENT = "mango-mania-orders-updated";

let cachedOrders: StoreOrder[] = [];
let cachedRawOrders: string | null = null;

function isStoreOrder(value: unknown): value is StoreOrder {
  if (!value || typeof value !== "object") {
    return false;
  }

  const order = value as Partial<StoreOrder>;

  return (
    typeof order.id === "string" &&
    typeof order.createdAt === "string" &&
    typeof order.total === "number" &&
    Array.isArray(order.items) &&
    !!order.customer &&
    typeof order.customer.name === "string" &&
    typeof order.customer.phone === "string" &&
    typeof order.customer.address === "string"
  );
}

export function readOrders(): StoreOrder[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);

  if (!savedOrders) {
    cachedRawOrders = null;
    cachedOrders = [];
    return [];
  }

  if (savedOrders === cachedRawOrders) {
    return cachedOrders;
  }

  try {
    const parsedOrders = JSON.parse(savedOrders) as unknown;

    cachedRawOrders = savedOrders;
    cachedOrders = Array.isArray(parsedOrders)
      ? parsedOrders.filter(isStoreOrder)
      : [];

    return cachedOrders;
  } catch {
    cachedRawOrders = savedOrders;
    cachedOrders = [];

    return [];
  }
}

export function saveOrders(orders: StoreOrder[]) {
  const serializedOrders = JSON.stringify(orders);

  cachedRawOrders = serializedOrders;
  cachedOrders = orders;
  window.localStorage.setItem(ORDERS_STORAGE_KEY, serializedOrders);
  window.dispatchEvent(new Event(ORDERS_EVENT));
}

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

export function addOrder(order: StoreOrder) {
  saveOrders([order, ...readOrders()]);
}
