'use client'

import React from 'react'

interface WhatsAppButtonProps {
	phoneNumber: string // e.g., "923001234567"
	message?: string // e.g., "Hi! I want to order mangos."
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
	phoneNumber,
	message = 'Hi there!',
}) => {
	// Strip any accidental formatting from the string
	const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
	const encodedMessage = encodeURIComponent(message)
	const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`

	return (
		<div className='relative group'>
			{/* Decorative breathing/pulse ring around the button */}
			<span className='absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none' />

			<a
				href={whatsappUrl}
				target='_blank'
				rel='noopener noreferrer'
				aria-label='Chat on WhatsApp'
				className='relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full hover:bg-[#20ba5a] transition-all duration-300 shadow-xl hover:scale-110 active:scale-95'
			>
				{/* Official WhatsApp SVG Vector path */}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 32 32'
					className='w-8 h-8 text-white fill-current'
					aria-label='WhatsApp'
				>
					<path d='M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.71A12.93 12.93 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.67c-1.94 0-3.83-.52-5.48-1.5l-.39-.23-3.97 1.01 1.06-3.86-.25-.4A10.63 10.63 0 015.33 16c0-5.88 4.79-10.67 10.67-10.67S26.67 10.12 26.67 16 21.88 26.67 16 26.67zm5.85-7.99c-.32-.16-1.89-.93-2.18-1.04-.29-.1-.5-.16-.71.16-.21.31-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.65s1.14 3.07 1.3 3.28c.16.21 2.25 3.43 5.45 4.81.76.33 1.36.52 1.82.67.77.24 1.46.21 2.01.12.61-.09 1.88-.76 2.14-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.61-.37z' />
				</svg>
			</a>
		</div>
	)
}

export default WhatsAppButton
