"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import useLocalStorage from "@/hooks/useLocalStorage"

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  images?: string[]
  size: string
  color?: string
  quantity: number
  category?: string
  productId: string // Store the original product ID for reference
  description?: string // Product description from admin
}

interface CartContextType {
  cartItems: CartItem[]
  appliedCoupon: any | null
  addToCart: (product: any, size: string, color?: string, quantity?: number) => void
  removeFromCart: (id: string, size: string, color?: string) => void
  updateQuantity: (id: string, size: string, quantity: number, color?: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
  getCartItemById: (id: string, size: string, color?: string) => CartItem | undefined
  applyCoupon: (coupon: any) => void
  removeCoupon: () => void
  getFinalTotal: () => number
  getDiscountAmount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("dope-cart", [])
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null)

  const addToCart = (product: any, size: string, color?: string, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => 
        item.id === product.id && 
        item.size === size && 
        item.color === color
      )

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.size === size && item.color === color 
            ? { ...item, quantity: item.quantity + quantity } 
            : item,
        )
      }

      return [
        ...prev,
        {
          id: product.id,
          productId: product.id, // Store original product ID
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          image: product.image,
          images: product.images,
          category: product.category,
          size,
          color,
          quantity,
          description: product.description, // Add description from admin
        },
      ]
    })
  }

  const removeFromCart = (id: string, size: string, color?: string) => {
    setCartItems((prev) => prev.filter((item) => 
      !(item.id === id && item.size === size && item.color === color)
    ))
  }

  const updateQuantity = (id: string, size: string, quantity: number, color?: string) => {
    setCartItems((prev) => prev.map((item) => 
      item.id === id && item.size === size && item.color === color 
        ? { ...item, quantity } 
        : item
    ))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const getCartItemById = (id: string, size: string, color?: string) => {
    return cartItems.find((item) => 
      item.id === id && 
      item.size === size && 
      item.color === color
    )
  }

  const applyCoupon = (coupon: any) => {
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0
    return appliedCoupon.discountAmount || 0
  }

  const getFinalTotal = () => {
    const subtotal = getCartTotal()
    const discount = getDiscountAmount()
    return Math.max(0, subtotal - discount)
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      appliedCoupon,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      getCartTotal,
      getCartItemCount,
      getCartItemById,
      applyCoupon,
      removeCoupon,
      getFinalTotal,
      getDiscountAmount
    }}>
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