import Link from 'next/link'

const footerLinks = [
    { label: 'Shop', href: '/#shop' },
    { label: 'Delivery', href: '/#delivery' },
    { label: 'Contact', href: '/#contact' },
]

export function StoreFooter() {
    return (
        <footer className='mt-auto border-t bg-card'>
            <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6'>
                <div className='flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between'>
                    {/* Brand & Contact Info */}
                    <div className='max-w-sm'>
                        <p className='font-heading text-lg font-semibold tracking-tight'>
                            Multan Mango
                        </p>
                        <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                            From the rich, aromatic Chaunsa to the vibrant Sindhri, we only
                            catalog the absolute top-tier grade of the harvest. If it isn't
                            perfect, it doesn’t leave our farm.
                        </p>
                        
                        {/* Contact Details Section */}
                        <div id="contact" className='mt-6 space-y-2 text-sm text-muted-foreground'>
                            <p className='flex items-start gap-2'>
                                <span className='select-none'>📍</span>
                                <span>Main Orchard Road, Multan, Punjab, Pakistan</span>
                            </p>
                            <p className='flex items-center gap-2'>
                                <span className='select-none'>📞</span>
                                <a href='tel:+923001234567' className='transition-colors hover:text-foreground'>
                                    +92 300 1234567
                                </a>
                            </p>
                            <p className='flex items-center gap-2'>
                                <span className='select-none'>✉️</span>
                                <a href='mailto:hello@mangomania.com' className='transition-colors hover:text-foreground'>
                                    hello@mangomania.com
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className='flex flex-wrap gap-x-8 gap-y-2'>
                        {footerLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Bar */}
                <div className='mt-10 flex flex-col gap-2 border-t pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
                    <p suppressHydrationWarning>
                        © {new Date().getFullYear()} Multan Mango. All rights reserved.
                    </p>
                    <p>Fast Local delivery · Store to Your Door</p>
                </div>
            </div>
        </footer>
    )
}