import { type MangoProduct } from '@/types/mango'
export const MANAGED_PRODUCTS_EVENT = 'mango-mania-products-updated'

type ApiError = {
	error?: string
}

function isApiError(value: unknown): value is ApiError {
	return !!value && typeof value === 'object' && 'error' in value
}

/**
 * Triggers a global window event to inform UI components to re-fetch their data
 */
export function notifyProductsChanged() {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event(MANAGED_PRODUCTS_EVENT))
	}
}

/**
 * Fetches all products from the backend database
 */
export async function fetchProducts() {
	const response = await fetch('/api/products')
	const products = (await response.json()) as MangoProduct[] | ApiError

	if (!response.ok || !Array.isArray(products)) {
		throw new Error(
			Array.isArray(products)
				? 'Unable to load products.'
				: (products.error ?? 'Unable to load products.'),
		)
	}

	return products
}

/**
 * Pushes a new mango product submission to the database
 */
export async function createProduct(product: MangoProduct) {
	const response = await fetch('/api/products', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },

		body: JSON.stringify(product),
	})
	const result = (await response.json()) as MangoProduct | ApiError

	if (!response.ok || isApiError(result)) {
		throw new Error(
			isApiError(result)
				? (result.error ?? 'Unable to create product.')
				: 'Unable to create product.',
		)
	}

	notifyProductsChanged()
	return result
}

/**
 * Updates an entire existing product entry in the database by its ID
 */
export async function updateProduct(productId: string, product: MangoProduct) {
	const response = await fetch(
		`/api/products/${encodeURIComponent(productId)}`,
		{
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(product),
		},
	)
	const result = (await response.json()) as MangoProduct | ApiError

	if (!response.ok || isApiError(result)) {
		throw new Error(
			isApiError(result)
				? (result.error ?? 'Unable to update product.')
				: 'Unable to update product.',
		)
	}

	notifyProductsChanged()
	return result
}

/**
 * Removes a single mango product from the database by its ID
 */
export async function deleteProductById(productId: string) {
	const response = await fetch(
		`/api/products/${encodeURIComponent(productId)}`,
		{
			method: 'DELETE',
		},
	)
	const result = (await response.json()) as { ok?: boolean; error?: string }

	if (!response.ok) {
		throw new Error(result.error ?? 'Unable to delete product.')
	}

	notifyProductsChanged()
}

/**
 * Wipes the entire database collection clean via the Admin dashboard
 */
export async function resetProducts() {
	const response = await fetch('/api/products', {
		method: 'DELETE',
	})
	const result = (await response.json()) as { message?: string; error?: string }

	if (!response.ok) {
		throw new Error(result.error ?? 'Unable to reset products.')
	}

	notifyProductsChanged()
	return result
}
