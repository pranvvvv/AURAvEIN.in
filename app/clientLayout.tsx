
"use client"

import "./globals.css"

import type React from "react"
import { useEffect } from "react"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NewsletterPopup from "@/components/NewsletterPopup"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
// ...hybridService removed, implement data init with new backend if needed

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // ...hybridService removed, implement data init with new backend if needed

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <NewsletterPopup />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
