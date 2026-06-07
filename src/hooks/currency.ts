export function formatPrice(amount: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'PKR',
		minimumFractionDigits: 2,
	}).format(amount)
}
