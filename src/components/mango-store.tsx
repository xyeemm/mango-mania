'use client'

import { MangoCard } from '@/components/mango-card'
import { StoreHero } from '@/components/store-hero'
import { useManagedProducts } from '@/hooks/use-managed-products'
import { type MangoProduct } from '@/types/mango'
import { motion } from 'framer-motion'

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.1 },
	},
}

const headerVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
	},
}

export function MangoStore() {
	// 1. Destructure 'products' directly from your custom data management hook
	const { products, error, isLoading } = useManagedProducts()

	return (
		<>
			<StoreHero heroImages={products} />

			<section
				id='shop'
				className='mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:px-6 sm:py-20'
			>
				<motion.div
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-80px' }}
					variants={headerVariants}
					className='mb-12'
				>
					<motion.div
						initial={{ scaleX: 0 }}
						whileInView={{ scaleX: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						className='mb-4 h-1 w-12 origin-left rounded-full bg-primary'
					/>
					<h2 className='font-heading text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl'>
						Our collection
					</h2>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className='mt-3 max-w-xl text-muted-foreground'
					>
						Premium varieties and pantry favorites — select a product for full
						details and photos.
					</motion.p>
				</motion.div>

				{/* 2. Map over the state-managed array safely instead of the raw function */}
				{/* FIXED: We only mount the animating container once the products are actually here */}
				{!isLoading && !error && products?.length > 0 && (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true, margin: '-40px' }}
						className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
					>
						{isLoading && (
							<p className='col-span-full text-sm text-muted-foreground'>
								Loading products...
							</p>
						)}
						{products.map((product: MangoProduct, index: any) => (
							<MangoCard key={product.id} product={product} index={index} />
						))}
					</motion.div>
				)}

				{/* Fallback view if the cloud database collection is currently empty */}
				{!isLoading && !error && products?.length === 0 && (
					<p className='col-span-full text-sm text-muted-foreground italic text-center py-8'>
						No delicious mangos found in stock right now. Use the admin panel to
						add some!
					</p>
				)}
			</section>
		</>
	)
}
