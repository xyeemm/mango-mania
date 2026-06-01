import type { Metadata } from "next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";
import { AppMotionConfig } from "@/components/motion-config";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mango Mania — Premium Farm-Fresh Mangos",
    template: "%s | Mango Mania",
  },
  description:
    "Curated Alphonso, Kesar, and specialty mangos delivered from trusted orchards. Order online for local delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <CartProvider>
          <AppMotionConfig>
            {children}
            <Toaster theme="light" position="top-center" richColors />
          </AppMotionConfig>
        </CartProvider>
      </body>
    </html>
  );
}
