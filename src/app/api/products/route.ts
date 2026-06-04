import { NextRequest } from "next/server";
import { getProductsCollection, serializeProduct, validateProduct, type MangoProduct } from "@/lib/mongodb";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/products/[id]
 * Fetch a single product by its custom string ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const collection = await getProductsCollection();
  
  const product = await collection.findOne({ id });
  
  if (!product) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  return Response.json(serializeProduct(product));
}

/**
 * PUT /api/products/[id]
 * Updates an existing product details completely
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json()) as MangoProduct;
  const collection = await getProductsCollection();

  // 1. Ensure the product actually exists before trying to update it
  const existingProduct = await collection.findOne({ id });
  if (!existingProduct) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  // 2. Validate the incoming data update format
  if (!validateProduct(body)) {
    return Response.json({ error: "Invalid product payload format." }, { status: 400 });
  }

  // 3. Prevent changing the core lookup ID string accidentally via payload
  const updatedData = { ...body, id };

  await collection.replaceOne({ id }, updatedData);
  return Response.json(updatedData);
}

/**
 * DELETE /api/products/[id]
 * Deletes a single specific product from the database
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const collection = await getProductsCollection();

  const result = await collection.deleteOne({ id });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  return Response.json({ message: `Product ${id} successfully removed.` });
}