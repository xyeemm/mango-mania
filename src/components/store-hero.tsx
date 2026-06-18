'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight, Award, Leaf, Sparkles, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const features = [
	{ icon: Leaf, label: 'Tree-ripened', sub: 'Harvested at peak maturity' },
	{ icon: Truck, label: 'Local delivery', sub: 'Scheduled weekly routes' },
	{
		icon: Award,
		label: 'Curated selection',
		sub: 'Sourced from trusted growers',
	},
]

const stats = [
	{ value: '12+', label: 'Partner orchards' },
	{ value: '6', label: 'Premium varieties' },
	{ value: '6h', label: 'Farm to doorstep' },
]

const heroImages = [
	{
		id: 'hero-1',
		src: 'https://res.cloudinary.com/dsxmnkxxl/image/upload/v1781376896/mango-mania/products/qdpcmhx2ctgtt6bv6p2i.jpg',
		alt: 'Ratol mangos',
		name: 'An. Ratol',
		price: 850,
	},
	{
		id: 'hero-2',
		src: 'https://res.cloudinary.com/dsxmnkxxl/image/upload/v1780691950/mango-mania/products/zibdd1yy2upkyste3ry5.jpg',
		alt: 'Kesar mangos',
		name: 'Kesar',
		price: 750,
	},
	{
		id: 'hero-3',
		src: 'https://res.cloudinary.com/dsxmnkxxl/image/upload/v1781771974/heroImage_heohnf.jpg',
		alt: 'Chaunsa mangos',
		name: 'Chaunsa',
		price: 600,
	},
]

const fadeUp = {
	hidden: { opacity: 0, y: 28 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.55,
			delay: i * 0.1,
			ease: [0.22, 1, 0.36, 1] as const,
		},
	}),
}

const imageFloat = (delay: number) => ({
	y: [0, -14, 0],
	rotate: [0, delay % 2 === 0 ? 2 : -2, 0],
	transition: {
		duration: 5 + delay,
		repeat: Infinity,
		ease: 'easeInOut' as const,
		delay: delay * 0.4,
	},
})

export function StoreHero() {
	return (
		<section id='delivery' className='relative overflow-hidden border-b'>
			{/* Animated background */}
			<div className='pointer-events-none absolute inset-0'>
				<div className='absolute inset-0 bg-[linear-gradient(160deg,var(--brand-muted)_0%,var(--background)_42%,var(--background)_100%)]' />
				<motion.div
					animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
					transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
					className='absolute -top-24 right-0 size-[32rem] rounded-full bg-brand/30 blur-3xl'
				/>
				<motion.div
					animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.28, 0.15] }}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 1,
					}}
					className='absolute bottom-0 left-[-10%] size-[28rem] rounded-full bg-primary/20 blur-3xl'
				/>
				<div
					className='absolute inset-0 opacity-[0.04]'
					style={{
						backgroundImage:
							'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
						backgroundSize: '32px 32px',
					}}
					aria-hidden
				/>
			</div>

			<div className='relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:pb-24 lg:pt-20'>
				{/* Copy */}
				<div className='lg:pr-4'>
					<motion.div
						custom={0}
						initial='hidden'
						animate='visible'
						variants={fadeUp}
						className='inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm'
					>
						<motion.span
							animate={{ rotate: [0, 15, -15, 0] }}
							transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
						>
							<Sparkles className='size-3.5 text-brand' />
						</motion.span>
						Peak season · Limited weekly harvest
					</motion.div>

					<motion.h1
						custom={1}
						initial='hidden'
						animate='visible'
						variants={fadeUp}
						className='mt-6 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]'
					>
						<span className='block overflow-hidden'>
							<motion.span
								className='block'
								initial={{ y: '100%' }}
								animate={{ y: 0 }}
								transition={{
									duration: 0.7,
									delay: 0.15,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								The finest mangos,
							</motion.span>
						</span>
						<span className='block overflow-hidden'>
							<motion.span
								className='block text-primary'
								initial={{ y: '100%' }}
								animate={{ y: 0 }}
								transition={{
									duration: 0.7,
									delay: 0.28,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								from orchard to you.
							</motion.span>
						</span>
					</motion.h1>

					<motion.p
						custom={2}
						initial='hidden'
						animate='visible'
						variants={fadeUp}
						className='mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg'
					>
						The authentic Multan mango season is short, and our premium batch
						slots fill up fast. Secure your box today before the harvest wraps
						up!
						{/* Alphonso, Kesar, and rare seasonal picks — hand-selected, perfectly
						ripened, and delivered with the care of a specialty grocer. */}
					</motion.p>

					<motion.div
						custom={3}
						initial='hidden'
						animate='visible'
						variants={fadeUp}
						className='mt-8 flex flex-wrap gap-3'
					>
						<Link
							href='/#shop'
							className={cn(buttonVariants({ size: 'lg' }), 'inline-flex')}
						>
							Shop collection
							<ArrowRight className='size-4' />
						</Link>
						<Link
							href='/products/alphonso'
							className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
						>
							Meet Alphonso
						</Link>
					</motion.div>

					<motion.ul
						custom={4}
						initial='hidden'
						animate='visible'
						variants={fadeUp}
						className='mt-10 flex flex-wrap gap-8 border-t pt-8'
					>
						{stats.map((stat, i) => (
							<motion.li
								key={stat.label}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
							>
								<p className='font-heading text-2xl font-semibold tabular-nums text-foreground'>
									{stat.value}
								</p>
								<p className='text-xs text-muted-foreground'>{stat.label}</p>
							</motion.li>
						))}
					</motion.ul>
				</div>

				{/* Image collage */}
				<div className='relative mx-auto mt-12 hidden aspect-[4/5] w-full max-w-md lg:mt-0 lg:block'>
					<motion.div
						initial={{ opacity: 0, scale: 0.92 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
						className='relative size-full'
					>
						{heroImages.map((image, i) => {
							const positions = [
								'left-0 top-0 z-10 w-[58%]',
								'right-0 top-[12%] z-20 w-[52%]',
								'bottom-0 left-[18%] z-30 w-[55%]',
							]
							return (
								<motion.div
									key={image.id}
									initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -4 : 4 }}
									animate={{
										opacity: 1,
										y: 0,
										rotate: 0,
										transition: {
											duration: 0.7,
											delay: 0.35 + i * 0.12,
											ease: [0.22, 1, 0.36, 1],
										},
									}}
									// Added aspect-[4/5] explicitly to the animated wrapper container
									className={cn(
										'absolute aspect-[4/5] overflow-hidden rounded-2xl border-4 border-background shadow-xl bg-muted',
										positions[i],
									)}
								>
									<motion.div
										animate={imageFloat(i)}
										className='relative h-full w-full'
									>
										<Image
											src={image.src}
											alt={image.alt}
											fill
											sizes='(max-width: 1024px) 100vw, 300px'
											className='object-cover'
										/>
									</motion.div>
								</motion.div>
							)
						})}

						<motion.div
							animate={{ scale: [1, 1.05, 1] }}
							transition={{ duration: 3, repeat: Infinity }}
							className='absolute -right-2 top-1/2 z-40 flex size-20 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-background bg-primary text-center text-primary-foreground shadow-lg'
						>
							<span className='text-[10px] font-medium uppercase tracking-wide opacity-90'>
								From
							</span>
							<span className='font-heading text-lg font-semibold leading-none'>
								Rs{heroImages[0].price}
							</span>
						</motion.div>
					</motion.div>
				</div>

				{/* Mobile image strip */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className='relative -mx-4 mt-10 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none lg:hidden'
				>
					{heroImages.map((image, i) => (
						<motion.div
							key={image.id}
							animate={imageFloat(i)}
							className='relative h-44 w-36 shrink-0 overflow-hidden rounded-xl border bg-card shadow-md'
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								sizes='144px'
								className='object-cover'
								priority={i === 0}
							/>
						</motion.div>
					))}
				</motion.div>
			</div>

			{/* Feature row */}
			<motion.ul
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true, margin: '-60px' }}
				variants={{
					hidden: {},
					visible: { transition: { staggerChildren: 0.12 } },
				}}
				className='relative mx-auto grid max-w-6xl gap-4 border-t bg-card/50 px-4 py-8 backdrop-blur-sm sm:grid-cols-3 sm:px-6'
			>
				{features.map(({ icon: Icon, label, sub }) => (
					<li
						key={label}
						className='flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md'
					>
						<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
							<Icon className='size-5' />
						</div>
						<div>
							<p className='text-sm font-medium'>{label}</p>
							<p className='mt-0.5 text-xs text-muted-foreground'>{sub}</p>
						</div>
					</li>
				))}
			</motion.ul>
		</section>
	)
}
