export function formatPrice(amount: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'PKR',
	}).format(amount)
}
