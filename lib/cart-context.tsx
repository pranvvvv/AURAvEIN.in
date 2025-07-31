"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color?: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: any, size: string, color?: string, quantity?: number) => void
  removeFromCart: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Safe localStorage operations with error handling
const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn('LocalStorage quota exceeded or unavailable:', error)
    // Clear old data if quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      try {
        // Clear other non-essential localStorage items
        const keysToKeep = ['dope-cart', 'dope_current_user', 'dope_products']
        const allKeys = Object.keys(localStorage)
        allKeys.forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key)
          }
        })
        // Try again after clearing
        localStorage.setItem(key, value)
        return true
      } catch (retryError) {
        console.error('Failed to save to localStorage even after cleanup:', retryError)
        return false
      }
    }
    return false
  }
}

const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn('Failed to read from localStorage:', error)
    return null
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = safeLocalStorageGet("dope-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(Array.isArray(parsedCart) ? parsedCart : [])
      } catch (error) {
        console.warn('Failed to parse cart data:', error)
        setCartItems([])
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length >= 0) {
      safeLocalStorageSet("dope-cart", JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (product: any, size: string, color?: string, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id && item.size === size)

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity,
        },
      ]
    })
  }

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)))
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id && item.size === size ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
