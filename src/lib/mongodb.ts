import { MongoClient, type Collection } from 'mongodb'
import { type MangoProduct } from '@/types/mango'
import { type StoreOrder } from '@/types/order'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB ?? 'mango-mania'

type GlobalWithMongo = typeof globalThis & {
	_mangoMongoClient?: Promise<MongoClient>
}

function getMongoClient() {
	if (!uri) {
		throw new Error('MONGODB_URI is not configured.')
	}

	const globalWithMongo = globalThis as GlobalWithMongo

	if (!globalWithMongo._mangoMongoClient) {
		globalWithMongo._mangoMongoClient = new MongoClient(uri).connect()
	}

	return globalWithMongo._mangoMongoClient
}

export async function getProductsCollection(): Promise<
	Collection<MangoProduct>
> {
	const client = await getMongoClient()
	return client.db(dbName).collection<MangoProduct>('products')
}

/**
 * Initializes the collection and ensures index performance
 */
export async function initProductsCollection() {
	const collection = await getProductsCollection()

	// Ensures that no two products can have the same custom id string
	await collection.createIndex({ id: 1 }, { unique: true })

	return collection
}

/**
 * Strips out MongoDB's internal BSON _id so it doesn't crash Next.js Client Components
 */
export function serializeProduct(
	product: MangoProduct & { _id?: unknown },
): MangoProduct {
	const { _id, ...serializedProduct } = product
	void _id
	return serializedProduct as MangoProduct
}

/**
 * Acts as your database schema validation guard before saving payloads
 */
export function validateProduct(product: MangoProduct): boolean {
	return (
		typeof product.id === 'string' &&
		typeof product.name === 'string' &&
		typeof product.variety === 'string' &&
		typeof product.description === 'string' &&
		typeof product.longDescription === 'string' &&
		typeof product.price === 'number' &&
		typeof product.unit === 'string' &&
		typeof product.emoji === 'string' &&
		Array.isArray(product.images) &&
		typeof product.imageAlt === 'string' &&
		!!product.details &&
		Array.isArray(product.relatedIds)
	)
}

export async function getOrdersCollection(): Promise<
	Collection<StoreOrder>
> {
	const client = await getMongoClient()
	return client.db(dbName).collection<StoreOrder>('orders')
}

/**
 * Initializes the collection and ensures index performance
 */
export async function initOrdersCollection() {
	const collection = await getOrdersCollection()

	// Ensures that no two orders can have the same custom id string
	await collection.createIndex({ id: 1 }, { unique: true })

	return collection
}

/**
 * Strips out MongoDB's internal BSON _id so it doesn't crash Next.js Client Components
 */
export function serializeOrder(
	order: StoreOrder & { _id?: unknown },
): StoreOrder {
	const { _id, ...serializedOrder } = order
	void _id
	return serializedOrder as StoreOrder
}

/**
 * Acts as your database schema validation guard before saving payloads
 */
export function validateOrder(order: StoreOrder): boolean {
	return (
		typeof order.id === 'string' &&
		typeof order.createdAt === 'string' &&
		typeof order.total === 'number' &&
		typeof order.itemCount === 'number' &&
		Array.isArray(order.items) &&
		order.items.every(item => 
			typeof item.productId === 'string' &&
			typeof item.name === 'string' &&
			typeof item.variety === 'string' &&
			typeof item.unit === 'string' &&
			typeof item.price === 'number' &&
			typeof item.quantity === 'number' &&
			typeof item.lineTotal === 'number'
		) &&
		!!order.customer &&
		typeof order.customer.name === 'string' &&
		typeof order.customer.phone === 'string' &&
		typeof order.customer.address === 'string' &&
		order.paymentMethod === 'Cash on delivery' &&
		order.status === 'New'
	)
}

