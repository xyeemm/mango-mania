import { AppMotionConfig } from '@/components/motion-config'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/context/cart-context'
import type { Metadata } from 'next'
import { DM_Sans, Fraunces, Geist_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
	variable: '--font-sans',
	subsets: ['latin'],
})

const fraunces = Fraunces({
	variable: '--font-heading',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

// OPTIMIZED SEO METADATA BLOCK
export const metadata: Metadata = {
	title: {
		default: 'Mango Mania — Buy Fresh Multani Mangos Online',
		template: '%s | Mango Mania',
	},
	description:
		'Order 100% authentic, fresh mangos online straight from our premium orchards in Multan. Hand-picked premium Chaunsa, Sindhri, and seasonal varieties delivered fresh.',
	keywords: [
		'mango online',
		'fresh mangos',
		'multani mangos',
		'buy mangos online',
		'multan mango delivery',
		'fresh chaunsa mango',
		'premium mango box',
	],
	openGraph: {
		title: 'Mango Mania — Premium Farm-Fresh Multani Mangos',
		description:
			'Order 100% authentic, fresh mangos online straight from our premium orchards in Multan.',
		type: 'website',
		locale: 'en_PK',
		siteName: 'Mango Mania',
	},
	robots: {
		index: true,
		follow: true,
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			className={`${dmSans.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body suppressHydrationWarning className='min-h-full flex flex-col'>
				<CartProvider>
					<AppMotionConfig>
						{children}
						<Toaster theme='light' position='top-center' richColors />
					</AppMotionConfig>
				</CartProvider>
			</body>
		</html>
	)
}
