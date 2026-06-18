import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		minimumCacheTTL: 60 * 60 * 24 * 7,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '/**',
			},
		],
		// Cloudinary already serves optimized format — no need for Next.js to re-process
		formats: ['image/avif', 'image/webp'],
	},
}

export default nextConfig
