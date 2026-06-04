import type { MangoProduct } from "@/lib/mangos";
import {
  ensureProductsSeeded,
  serializeProduct,
  validateProduct,
} from "@/lib/mongodb";

type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: ProductRouteContext) {
  const { id } = await context.params;
  const collection = await ensureProductsSeeded();
  const product = await collection.findOne({ id });

  if (!product) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  return Response.json(serializeProduct(product));
}

export async function PUT(request: Request, context: ProductRouteContext) {
  const { id } = await context.params;
  const product = (await request.json()) as MangoProduct;

  if (!validateProduct(product)) {
    return Response.json({ error: "Invalid product payload." }, { status: 400 });
  }

  const collection = await ensureProductsSeeded();
  const idConflict =
    product.id === id ? null : await collection.findOne({ id: product.id });

  if (idConflict) {
    return Response.json(
      { error: "That product ID is already in use." },
      { status: 409 }
    );
  }

  const result = await collection.findOneAndReplace(
    { id },
    product,
    { returnDocument: "after" }
  );

  if (!result) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  if (id !== product.id) {
    await collection.updateMany(
      { relatedIds: id },
      { $set: { "relatedIds.$[relatedId]": product.id } },
      { arrayFilters: [{ relatedId: id }] }
    );
  }

  return Response.json(serializeProduct(result));
}

export async function DELETE(_request: Request, context: ProductRouteContext) {
  const { id } = await context.params;
  const collection = await ensureProductsSeeded();
  const result = await collection.deleteOne({ id });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  await collection.updateMany(
    { relatedIds: id },
    { $pull: { relatedIds: id } }
  );

  return Response.json({ ok: true });
}
