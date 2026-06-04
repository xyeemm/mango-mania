import { MongoClient, type Collection } from "mongodb";
import { MANGO_PRODUCTS, type MangoProduct } from "@/lib/mangos";

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

export async function ensureProductsSeeded() {
  const collection = await getProductsCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    await collection.insertMany(MANGO_PRODUCTS);
  }

  await collection.createIndex({ id: 1 }, { unique: true });

  return collection;
}

export function serializeProduct(product: MangoProduct & { _id?: unknown }) {
  const { _id, ...serializedProduct } = product;
  void _id;
  return serializedProduct;
}

export function validateProduct(product: MangoProduct) {
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
