import {
	initProductsCollection,
	serializeProduct,
	validateProduct,
} from '@/lib/mongodb'
import { type MangoProduct } from '@/types/mango'
type ProductRouteContext = {
	params: Promise<{ id: string }>
}

/**
 * GET /api/products/[id]
 * Fetch a single product from the database using its unique custom ID
 */
export async function GET(_request: Request, context: ProductRouteContext) {
	const { id } = await context.params
	const collection = await initProductsCollection()
	const product = await collection.findOne({ id })

	if (!product) {
		return Response.json({ error: 'Product not found.' }, { status: 404 })
	}

	return Response.json(serializeProduct(product))
}

/**
 * PUT /api/products/[id]
 * Updates an entire product's fields in MongoDB and syncs related product IDs
 */
export async function PUT(request: Request, context: ProductRouteContext) {
	const { id } = await context.params
	const product = (await request.json()) as MangoProduct

	// Validate the incoming dataset format using your custom schema guard
	if (!validateProduct(product)) {
		return Response.json({ error: 'Invalid product payload.' }, { status: 400 })
	}

	const collection = await initProductsCollection()

	// If the admin changed the text ID, make sure the new ID isn't taken by another mango
	const idConflict =
		product.id === id ? null : await collection.findOne({ id: product.id })

	if (idConflict) {
		return Response.json(
			{ error: 'That product ID is already in use.' },
			{ status: 409 },
		)
	}

	// Atomically replaces the old item document with the new fields
	const result = await collection.findOneAndReplace({ id }, product, {
		returnDocument: 'after',
	})

	if (!result) {
		return Response.json({ error: 'Product not found.' }, { status: 404 })
	}

	// Cascade Update: If the core lookup ID string was changed, update it inside
	// any other mango's relatedIds arrays so relationships don't break
	if (id !== product.id) {
		await collection.updateMany(
			{ relatedIds: id },
			{ $set: { 'relatedIds.$[relatedId]': product.id } },
			{ arrayFilters: [{ relatedId: id }] },
		)
	}

	return Response.json(serializeProduct(result))
}

/**
 * DELETE /api/products/[id]
 * Deletes a single specific product and pulls its ID from all other items' related lists
 */
export async function DELETE(_request: Request, context: ProductRouteContext) {
	const { id } = await context.params
	const collection = await initProductsCollection()
	const result = await collection.deleteOne({ id })

	if (result.deletedCount === 0) {
		return Response.json({ error: 'Product not found.' }, { status: 404 })
	}

	// Cascade Delete: Removes this product ID from the relatedIds arrays of all remaining items
	await collection.updateMany({ relatedIds: id }, { $pull: { relatedIds: id } })

	return Response.json({ ok: true })
}
