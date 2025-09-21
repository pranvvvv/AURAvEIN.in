import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import ClientLayout from "./clientLayout"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: "AURAvEIN.IN - Premium Oversized Fashion",
  description: "Discover premium oversized fashion at AURAvEIN. Shop French Terry, Cotton Tees, and exclusive streetwear collections. Free shipping on orders over ₹999.",
  generator: 'AURAvEIN',
  applicationName: "AURAvEIN",
  keywords: ["auravein", "fashion", "clothing", "premium", "online shopping", "oversized", "streetwear", "french terry", "cotton tees"],
  authors: [{ name: "AURAvEIN" }],
  creator: "PRANAV",
  robots: "index, follow",
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/WhatsApp Image 2025-09-21 at 14.48.17_48bd4937.jpg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/WhatsApp Image 2025-09-21 at 14.48.17_48bd4937.jpg',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/WhatsApp Image 2025-09-21 at 14.48.17_48bd4937.jpg',
    },
  ],
  alternates: {
    canonical: "https://auravein.store"
  },
  openGraph: {
    title: "AURAvEIN.IN - Premium Oversized Fashion",
    description: "Discover premium oversized fashion at AURAvEIN. Shop French Terry, Cotton Tees, and exclusive streetwear collections.",
    url: "https://auravein.store",
    siteName: "AURAvEIN",
    images: [
      {
        url: "https://auravein.store/IMG_7224.JPG",
        width: 1200,
        height: 630,
        alt: "AURAvEIN - Premium Oversized Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURAvEIN.IN - Premium Oversized Fashion",
    description: "Discover premium oversized fashion at AURAvEIN. Shop French Terry, Cotton Tees, and exclusive streetwear collections.",
    images: ["https://auravein.store/IMG_7224.JPG"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon configurations */}
        <link rel="icon" type="image/png" sizes="32x32" href="/WhatsApp Image 2025-09-21 at 14.48.17_48bd4937.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/WhatsApp Image 2025-09-21 at 14.48.17_48bd4937.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/WhatsApp Image 2025-09-21 at 14.48.17_48bd4937.jpg" />
        <link rel="shortcut icon" href="/WhatsApp Image 2025-09-21 at 14.48.17_48bd4937.jpg" />
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="sm3-6cYkcAoHtSTy0mGS2EIMf8NQqhsv4kEWMWHj4_Q" />
        
        {/* Preload critical images */}
        <link rel="preload" href="/IMG_7127.JPG" as="image" type="image/jpeg" />
        <link rel="preload" href="/IMG_7222.JPG" as="image" type="image/jpeg" />
        <link rel="preload" href="/IMG_7223.JPG" as="image" type="image/jpeg" />
        <link rel="preload" href="/IMG_7218.JPG" as="image" type="image/jpeg" />
        <link rel="preload" href="/IMG_7224.JPG" as="image" type="image/jpeg" />
        
        {/* DNS and font optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
