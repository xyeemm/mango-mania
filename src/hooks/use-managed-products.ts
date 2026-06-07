'use client'

import { MANAGED_PRODUCTS_EVENT, fetchProducts } from '@/lib/managed-products'
import { type MangoProduct } from '@/types/mango'
import { useEffect, useState } from 'react'

export function useManagedProducts() {
	// 2. Explicitly type the state as MangoProduct[] and default to an empty array
	const [products, setProducts] = useState<MangoProduct[]>([])
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let active = true

		async function loadProducts() {
			try {
				setIsLoading(true)
				const nextProducts = await fetchProducts()

				if (active) {
					// 3. Since nextProducts is now explicitly typed, this sets flawlessly
					setProducts(nextProducts)
					setError(null)
				}
			} catch (loadError) {
				if (active) {
					setError(
						loadError instanceof Error
							? loadError.message
							: 'Unable to load products.',
					)
				}
			} finally {
				if (active) {
					setIsLoading(false)
				}
			}
		}

		void loadProducts()
		window.addEventListener(MANAGED_PRODUCTS_EVENT, loadProducts)

		return () => {
			active = false
			window.removeEventListener(MANAGED_PRODUCTS_EVENT, loadProducts)
		}
	}, [])

	return { products, error, isLoading }
}
