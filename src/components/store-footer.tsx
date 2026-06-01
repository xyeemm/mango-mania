import Link from "next/link";

const footerLinks = [
  { label: "Shop", href: "/#shop" },
  { label: "Delivery", href: "/#delivery" },
  { label: "Contact", href: "mailto:hello@mangomania.com" },
];

export function StoreFooter() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-heading text-lg font-semibold tracking-tight">
              Mango Mania
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Premium mangos sourced directly from partner orchards. Quality
              you can taste, delivered with care.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Mango Mania. All rights reserved.
          </p>
          <p>Local delivery · Pay on delivery available at checkout</p>
        </div>
      </div>
    </footer>
  );
}
