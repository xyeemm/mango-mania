export type ProductDetails = {
  origin: string;
  season: string;
  weight: string;
  ripeness: string;
  storage: string;
  delivery: string;
};

export type MangoProduct = {
  id: string;
  name: string;
  variety: string;
  description: string;
  longDescription: string;
  price: number;
  unit: string;
  emoji: string;
  images: string[];
  imageAlt: string;
  details: ProductDetails;
  relatedIds: string[];
  tag?: "bestseller" | "seasonal" | "new";
};
