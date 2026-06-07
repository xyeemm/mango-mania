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
