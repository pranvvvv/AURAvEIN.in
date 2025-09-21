import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ClientLayout from "./clientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AURAvEIN.IN - Premium Oversized Fashion",
  description: "Discover premium oversized fashion at AURAvEIN. Shop French Terry, Cotton Tees, and exclusive streetwear collections. Free shipping on orders over ₹999.",
  generator: 'AURAvEIN',
  applicationName: "AURAvEIN",
  keywords: ["auravein", "fashion", "clothing", "premium", "online shopping", "oversized", "streetwear", "french terry", "cotton tees"],
  authors: [{ name: "AURAvEIN" }],
  creator: "PRANAV",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  robots: "index, follow",
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
        {/* Google Search Console Verification - Replace with your actual verification code */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE_HERE" />
        
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
