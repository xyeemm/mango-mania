import React from 'react'

interface WhatsAppButtonProps {
	phoneNumber: string // e.g., "923001234567"
	message?: string // e.g., "Hello! I'd like to ask about..."
	children?: React.ReactNode
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
	phoneNumber,
	message = 'Hi there!',
	children,
}) => {
	// Clean the phone number just in case symbols were passed accidentally
	const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')

	// Encode the message for the URL
	const encodedMessage = encodeURIComponent(message)

	const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`

	return (
		<a
			href={whatsappUrl}
			target='_blank'
			rel='noopener noreferrer'
			className='inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white font-medium rounded-md hover:bg-[#20ba5a] transition-colors shadow-sm'
		>
			{/* Optional: Add a WhatsApp SVG icon here */}
			{children || 'Chat on WhatsApp'}
		</a>
	)
}

export default WhatsAppButton
