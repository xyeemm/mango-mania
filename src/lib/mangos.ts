function productImages(seed: string, count = 3) {
  return Array.from(
    { length: count },
    (_, i) => `https://picsum.photos/seed/mango-${seed}-${i}/800/600`
  );
}

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

export const MANGO_PRODUCTS: MangoProduct[] = [
  {
    id: "alphonso",
    name: "Alphonso",
    variety: "Ratnagiri",
    description:
      "The king of mangoes — buttery, saffron-sweet flesh with zero fiber. Hand-picked at peak ripeness.",
    longDescription:
      "Our Ratnagiri Alphonso mangoes are grown on coastal orchards where the sea breeze and red laterite soil create unmatched sweetness. Each fruit is hand-selected when the shoulder softens and the skin blushes golden-yellow. Expect a rich, almost custard-like texture with notes of honey and saffron — ideal for eating fresh, or blended into the silkiest aamras.",
    price: 24,
    unit: "per dozen",
    emoji: "🥭",
    tag: "bestseller",
    imageAlt: "Fresh Alphonso mangoes",
    images: productImages("alphonso", 4),
    details: {
      origin: "Ratnagiri, Maharashtra, India",
      season: "April – June",
      weight: "~250g per fruit (12 count)",
      ripeness: "Tree-ripened, ready in 1–2 days",
      storage: "Room temp until soft, then refrigerate",
      delivery: "Same-week local delivery",
    },
    relatedIds: ["kesar", "mixed-box", "lassi-kit"],
  },
  {
    id: "kesar",
    name: "Kesar",
    variety: "Gujarat",
    description:
      "Intense aroma and deep orange pulp. Perfect for shakes, kulfi, and eating straight from the peel.",
    longDescription:
      "Kesar — the “queen” mango — is prized for its unmistakable fragrance that fills the room the moment you slice it. Sourced from Gujarat’s Gir region, these mangoes have fiber-free, deep saffron pulp that’s naturally high in sweetness. They’re the variety of choice for mango kulfi, shrikhand, and classic Indian sweets.",
    price: 18,
    unit: "per dozen",
    emoji: "🥭",
    tag: "seasonal",
    imageAlt: "Kesar mangoes with orange flesh",
    images: productImages("kesar"),
    details: {
      origin: "Gir, Gujarat, India",
      season: "May – July",
      weight: "~220g per fruit (12 count)",
      ripeness: "Firm-ripe, eats in 2–3 days",
      storage: "Keep in a paper bag to ripen faster",
      delivery: "Same-week local delivery",
    },
    relatedIds: ["alphonso", "ataulfo", "lassi-kit"],
  },
  {
    id: "ataulfo",
    name: "Ataulfo",
    variety: "Honey Mango",
    description:
      "Creamy, honey-sweet, and virtually seedless. A crowd favorite for kids and smoothie lovers.",
    longDescription:
      "Ataulfo (Honey) mangoes are small, golden, and buttery-smooth with a thin pit and almost no stringy fiber. Imported from Mexico’s Chiapas highlands during peak season, they’re perfect for lunchboxes, baby food, and tropical smoothies. Their honeyed flavor profile makes them forgiving for first-time mango buyers.",
    price: 14,
    unit: "per dozen",
    emoji: "🥭",
    imageAlt: "Golden Ataulfo honey mangoes",
    images: productImages("ataulfo"),
    details: {
      origin: "Chiapas, Mexico",
      season: "March – August",
      weight: "~150g per fruit (12 count)",
      ripeness: "Ready to eat when skin wrinkles slightly",
      storage: "Refrigerate once ripe",
      delivery: "Same-week local delivery",
    },
    relatedIds: ["kesar", "mixed-box", "dried"],
  },
  {
    id: "dried",
    name: "Sun-Dried Slices",
    variety: "Snack Pack",
    description:
      "Slow-dried Alphonso strips — no added sugar. Great for lunchboxes and trail mix.",
    longDescription:
      "We slow-dry surplus Alphonso at low heat to concentrate natural sugars — no sulfur, no added sugar, no preservatives. Each 200g bag is packed with chewy, intensely mango-flavored strips that keep for months. Toss them in granola, pack them for hikes, or chop into cookie dough for a tropical twist.",
    price: 8,
    unit: "per 200g bag",
    emoji: "🍋",
    tag: "new",
    imageAlt: "Dried mango slices",
    images: productImages("dried"),
    details: {
      origin: "Made from Ratnagiri Alphonso",
      season: "Year-round",
      weight: "200g net per bag",
      ripeness: "Shelf-stable, ready to eat",
      storage: "Cool, dry pantry · 6-month shelf life",
      delivery: "Ships with fresh orders",
    },
    relatedIds: ["alphonso", "lassi-kit", "mixed-box"],
  },
  {
    id: "lassi-kit",
    name: "Mango Lassi Kit",
    variety: "DIY",
    description:
      "Puree pouch, cardamom, and rose water. Just add yogurt and ice — café quality at home.",
    longDescription:
      "Everything you need for two generous glasses of restaurant-style mango lassi: single-origin Alphonso puree, freshly ground green cardamom, and a splash of rose water. Add plain yogurt, ice, and a pinch of salt — blend for 60 seconds. No artificial flavors, no mango syrup shortcuts.",
    price: 12,
    unit: "per kit",
    emoji: "🥤",
    imageAlt: "Mango lassi drink",
    images: productImages("lassi-kit"),
    details: {
      origin: "Assembled in-house",
      season: "Year-round",
      weight: "Makes 2 × 12oz servings",
      ripeness: "N/A — ready to blend",
      storage: "Refrigerate puree pouch until use",
      delivery: "Pairs well with fresh mango orders",
    },
    relatedIds: ["alphonso", "kesar", "dried"],
  },
  {
    id: "mixed-box",
    name: "Variety Box",
    variety: "Curator's Pick",
    description:
      "A mixed dozen of whatever's ripest this week — surprise your taste buds with three varieties.",
    longDescription:
      "Can't choose? Our orchard team packs a dozen of the three ripest varieties available that week — often Alphonso, Kesar, and Ataulfo in one box. It's the best way to host a mango tasting party or discover your new favorite. Contents vary with harvest; we'll always include a tasting card.",
    price: 20,
    unit: "per dozen",
    emoji: "📦",
    tag: "bestseller",
    imageAlt: "Assorted fresh mangoes in a box",
    images: productImages("mixed-box", 4),
    details: {
      origin: "Mixed sourcing",
      season: "Peak season only",
      weight: "12 mixed fruits (~2.5kg)",
      ripeness: "Staggered ripeness for week-long eating",
      storage: "See included card per variety",
      delivery: "Limited weekly batches",
    },
    relatedIds: ["alphonso", "kesar", "ataulfo"],
  },
];

export function getProductById(id: string): MangoProduct | undefined {
  return MANGO_PRODUCTS.find((p) => p.id === id);
}

export function getRelatedProducts(product: MangoProduct): MangoProduct[] {
  return product.relatedIds
    .map((id) => getProductById(id))
    .filter((p): p is MangoProduct => p !== undefined);
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
