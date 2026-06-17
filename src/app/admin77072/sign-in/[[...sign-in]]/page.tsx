import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
	return (
		<main className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/50 p-4 sm:p-6 lg:p-8'>
			{/* Decorative background shapes */}
			<div className='absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl' />
			<div className='absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl' />

			<div className='relative z-10 w-full max-w-md'>
				{/* Brand Header */}
				<div className='mb-8 text-center'>
					<Link href='/' className='inline-flex items-center gap-2 transition-transform hover:scale-105'>
						<span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 shadow-lg shadow-amber-500/20 text-2xl'>
							🥭
						</span>
					</Link>
					<h2 className='mt-4 font-heading text-2xl font-bold tracking-tight text-neutral-800'>
						Mango Mania Admin Portal
					</h2>
					<p className='mt-2 text-sm text-neutral-600'>
						Please sign in to manage your products and orders
					</p>
				</div>

				{/* Clerk Component wrapper with custom shadow and styling */}
				<div className='flex justify-center rounded-3xl bg-white/40 p-2 shadow-xl shadow-amber-900/5 backdrop-blur-md border border-white/60'>
					<SignIn
						appearance={{
							elements: {
								card: 'bg-transparent shadow-none border-none p-4',
								headerTitle: 'hidden',
								headerSubtitle: 'hidden',
								socialButtonsBlockButton: 'border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-colors',
								formButtonPrimary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/10 transition-colors border-none text-sm font-medium',
								footerActionLink: 'text-amber-600 hover:text-amber-700',
							},
						}}
					/>
				</div>

				{/* Back link */}
				<p className='mt-8 text-center text-xs text-neutral-500'>
					<Link href='/' className='hover:underline hover:text-neutral-700 transition-colors'>
						← Back to storefront
					</Link>
				</p>
			</div>
		</main>
	)
}
