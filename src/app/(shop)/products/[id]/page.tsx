import { ProductDetailPage } from '@/components/product-detail-page'
import { type MangoProduct } from '@/types/mango'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
	params: Promise<{ id: string }>
}

// HELPER: Base URL utility to handle both local development and live hosting
const getBaseUrl = () => {
	if (typeof window !== 'undefined') return ''
	if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
	return 'http://localhost:3000'
}
// HELPER: Dynamic data fetcher that speaks directly to your MongoDB API routes
async function fetchProductData(id: string): Promise<MangoProduct | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products/${id}`, {
      // FIXED: Forces Next.js to bypass all cache mechanics and fetch live from MongoDB every single time
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error loading product data from MongoDB:', error)
    return null
  }
}

/**
 * 1. OPTIONAL: Dynamic Params Pre-generation
 * Instead of mapping a hardcoded array, we call the global API route
 * to tell Next.js exactly which dynamic mango pages to build ahead of time.
 */
export async function generateStaticParams() {
	try {
		const res = await fetch(`${getBaseUrl()}/api/products`)
		if (!res.ok) return []

		const products: MangoProduct[] = await res.json()
		return products.map((product) => ({ id: product.id }))
	} catch (error) {
		return [] // Fallback cleanly if database is unreachable during build
	}
}

/**
 * 2. Dynamic Meta Engine
 * Dynamically looks up your MongoDB documents to accurately inject
 * title tags and WhatsApp/Social media OpenGraph preview card images.
 */
export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params
	const product = await fetchProductData(id)

	if (!product) {
		return { title: 'Product Not Found' }
	}

	return {
		title: `${product.name} | Premium Mangos`,
		description: product.description,
		openGraph: {
			title: product.name,
			description: product.description,
			// FIXED: Cleared the trailing dot typo and targeted the first image array item safely
			images:
				product.images && product.images.length > 0
					? [{ url: product.images[0], alt: product.imageAlt }]
					: [],
		},
	}
}

/**
 * 3. Core Page Shell Component
 */
export default async function ProductPage({ params }: PageProps) {
	const { id } = await params
	const product = await fetchProductData(id)

	// If a user types a random URL string that doesn't match an active MongoDB item, show a 404
	if (!product) {
		notFound()
	}

	return <ProductDetailPage initialProduct={product} productId={id} />
}
