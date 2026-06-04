import { MongoClient, type Collection } from "mongodb";

// Define your product structure directly so you don't need the local file import
export interface MangoProduct {
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
  details: Record<string, string | number | boolean>;
  relatedIds: string[];
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "mango-mania";

type GlobalWithMongo = typeof globalThis & {
  _mangoMongoClient?: Promise<MongoClient>;
};

function getMongoClient() {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const globalWithMongo = globalThis as GlobalWithMongo;

  if (!globalWithMongo._mangoMongoClient) {
    globalWithMongo._mangoMongoClient = new MongoClient(uri).connect();
  }

  return globalWithMongo._mangoMongoClient;
}

export async function getProductsCollection(): Promise<Collection<MangoProduct>> {
  const client = await getMongoClient();
  return client.db(dbName).collection<MangoProduct>("products");
}

/**
 * Initializes the collection and ensures index performance
 */
export async function initProductsCollection() {
  const collection = await getProductsCollection();
  
  // Ensures that no two products can have the same custom id string
  await collection.createIndex({ id: 1 }, { unique: true });

  return collection;
}

/**
 * Strips out MongoDB's internal BSON _id so it doesn't crash Next.js Client Components
 */
export function serializeProduct(product: MangoProduct & { _id?: unknown }): MangoProduct {
  const { _id, ...serializedProduct } = product;
  void _id; 
  return serializedProduct as MangoProduct;
}

/**
 * Acts as your database schema validation guard before saving payloads
 */
export function validateProduct(product: MangoProduct): boolean {
  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.variety === "string" &&
    typeof product.description === "string" &&
    typeof product.longDescription === "string" &&
    typeof product.price === "number" &&
    typeof product.unit === "string" &&
    typeof product.emoji === "string" &&
    Array.isArray(product.images) &&
    typeof product.imageAlt === "string" &&
    !!product.details &&
    Array.isArray(product.relatedIds)
  );
}