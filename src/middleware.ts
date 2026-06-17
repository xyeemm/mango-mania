import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Match all admin dashboard paths except sign-in and sign-up
const isAdminRoute = createRouteMatcher(['/admin77072(.*)'])
const isAuthRoute = createRouteMatcher([
	'/admin77072/sign-in(.*)',
	'/admin77072/sign-up(.*)',
])

// Match admin-specific API routes
const isAdminApiRoute = createRouteMatcher([
	'/api/orders',
	'/api/products(.*)',
	'/api/cloudinary/upload(.*)',
])

export default clerkMiddleware(async (auth, req) => {
	// Enforce authentication on admin panel pages
	if (isAdminRoute(req) && !isAuthRoute(req)) {
		await auth.protect()
	}

	// Enforce authentication on admin API mutations and orders fetches
	if (isAdminApiRoute(req)) {
		const { method } = req
		const path = req.nextUrl.pathname

		if (
			(path === '/api/orders' && method === 'GET') ||
			(path.startsWith('/api/products') && method !== 'GET') ||
			path.startsWith('/api/cloudinary/upload')
		) {
			await auth.protect()
		}
	}
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
