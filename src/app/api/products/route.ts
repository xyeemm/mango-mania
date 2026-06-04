import { MANGO_PRODUCTS, type MangoProduct } from "@/lib/mangos";
import {
  ensureProductsSeeded,
  getProductsCollection,
  serializeProduct,
  validateProduct,
} from "@/lib/mongodb";

export async function GET() {
  const collection = await ensureProductsSeeded();
  const products = await collection.find({}).sort({ name: 1 }).toArray();

  return Response.json(products.map(serializeProduct));
}

export async function POST(request: Request) {
  const product = (await request.json()) as MangoProduct;

  if (!validateProduct(product)) {
    return Response.json({ error: "Invalid product payload." }, { status: 400 });
  }

  const collection = await ensureProductsSeeded();
  const existingProduct = await collection.findOne({ id: product.id });

  if (existingProduct) {
    return Response.json(
      { error: "That product ID is already in use." },
      { status: 409 }
    );
  }

  await collection.insertOne(product);

  return Response.json(product, { status: 201 });
}

export async function DELETE() {
  const collection = await getProductsCollection();

  await collection.deleteMany({});
  await collection.insertMany(MANGO_PRODUCTS);

  return Response.json(MANGO_PRODUCTS);
}
