"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { useEffect } from "react"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NewsletterPopup from "@/components/NewsletterPopup"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { initializeData } from "@/lib/hybridService"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize localStorage data on app start with error handling
    try {
      initializeData()
    } catch (error) {
      console.error('Failed to initialize data:', error)
      // If localStorage is full, try to clear some space
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        try {
          // Clear non-essential items
          const keysToKeep = ['dope-cart', 'dope_current_user', 'dope_products']
          const allKeys = Object.keys(localStorage)
          allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
              localStorage.removeItem(key)
            }
          })
          // Try again
          initializeData()
        } catch (retryError) {
          console.error('Failed to initialize data even after cleanup:', retryError)
        }
      }
    }
  }, [])

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
