// LocalStorage data management for frontend-only eCommerce

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password: string
  address?: string
  createdAt: string
  isAdmin?: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  images?: string[]
  videoUrl?: string
  rating: number
  reviews: number
  category: string
  description: string
  sizes: string[]
  colors?: string[]
  stock: number
  isActive: boolean
  createdAt: string
  brand?: string
  tags?: string[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  size: string
  color?: string
  quantity: number
}

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  addedAt: string
}

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderValue: number
  maxDiscount?: number
  expiryDate: string
  usageLimit: number
  usedCount: number
  isActive: boolean
  createdAt: string
}

export interface DeliveryAddress {
  name: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  addressType: "home" | "office" | "other"
}

export interface Order {
  id: string
  userId?: string
  items: CartItem[]
  subtotal?: number
  discount?: number
  coupon?: string
  couponCode?: string
  deliveryFee?: number
  total: number
  finalTotal?: number
  status: string
  paymentMethod?: string
  paymentStatus?: string
  transactionId?: string
  deliveryAddress?: DeliveryAddress
  address?: any
  upiId?: string
  screenshot?: string
  createdAt: string
  updatedAt?: string
  estimatedDelivery?: string
}

// Safe localStorage operations
const safeSetItem = (key: string, value: string): boolean => {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error)
    return false
  }
}

const safeGetItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error)
    return null
  }
}

// Initialize default data
export const initializeData = () => {
  // Initialize products if not exists
  if (!safeGetItem("dope_products")) {
    const defaultProducts: Product[] = [
    
   
      {
        id: "5",
        name: "WHITE APEX WILD T-SHIRT",
        price: 4195,
        originalPrice: 5195,
        discount: 19,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RMkXrTxnA1vpz17GZLeE524Ifu4M1Q.png",
        videoUrl: "/placeholder.mp4",
        rating: 4.6,
        reviews: 234,
        category: "t-shirts",
        description:
          "White oversized t-shirt with unique apex wild design. Made from premium cotton for ultimate comfort.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Gray"],
        stock: 45,
        isActive: true,
        createdAt: new Date().toISOString(),
        brand: "DOPE",
        tags: ["white", "apex", "wild", "premium"],
      },
    ]
    safeSetItem("dope_products", JSON.stringify(defaultProducts))
  }

  // Initialize admin user if not exists
  if (!safeGetItem("dope_users")) {
    const defaultUsers: User[] = [
      {
        id: "admin",
        name: "Admin",
        email: "shivapranav432@gmail.com",
        phone: "+919876543210",
        password: "auravein282007",
        isAdmin: true,
        createdAt: new Date().toISOString(),
      },
    ]
    safeSetItem("dope_users", JSON.stringify(defaultUsers))
  }

  // Initialize coupons if not exists
  if (!safeGetItem("dope_coupons")) {
    const defaultCoupons: Coupon[] = [
      {
        id: "1",
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        minOrderValue: 1000,
        maxDiscount: 500,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        code: "FLAT200",
        type: "fixed",
        value: 200,
        minOrderValue: 2000,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 50,
        usedCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]
    safeSetItem("dope_coupons", JSON.stringify(defaultCoupons))
  }

  // Initialize empty arrays for other data
  if (!safeGetItem("dope_orders")) {
    safeSetItem("dope_orders", JSON.stringify([]))
  }
}

// Data access functions
export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return []
  const products = localStorage.getItem("dope_products")
  return products ? JSON.parse(products) : []
}

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem("dope_users")
  return users ? JSON.parse(users) : []
}

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return []
  const orders = localStorage.getItem("dope_orders")
  return orders ? JSON.parse(orders) : []
}

export const getCoupons = (): Coupon[] => {
  if (typeof window === 'undefined') return []
  const coupons = localStorage.getItem("dope_coupons")
  return coupons ? JSON.parse(coupons) : []
}

export const getCart = (userId: string): CartItem[] => {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem(`dope_cart_${userId}`)
  return cart ? JSON.parse(cart) : []
}

export const getWishlist = (userId: string): WishlistItem[] => {
  if (typeof window === 'undefined') return []
  const wishlist = localStorage.getItem(`dope_wishlist_${userId}`)
  return wishlist ? JSON.parse(wishlist) : []
}

// Data update functions
export const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return
  const minimalProducts = products.map(({ id, name, price, images }) => ({
   id,
   name,
   price,
   images,
  }));
  try {
    localStorage.setItem("dope_products", JSON.stringify(minimalProducts));
  } catch (e) {
    console.warn("LocalStorage quota exceeded:", e);
  }
}

export const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem("dope_users", JSON.stringify(users))
}

export const saveOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem("dope_orders", JSON.stringify(orders))
}

export const saveCoupons = (coupons: Coupon[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem("dope_coupons", JSON.stringify(coupons))
}

export const saveCart = (userId: string, cart: CartItem[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(`dope_cart_${userId}`, JSON.stringify(cart))
}

export const saveWishlist = (userId: string, wishlist: WishlistItem[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(`dope_wishlist_${userId}`, JSON.stringify(wishlist))
}

// Authentication functions
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const currentUser = localStorage.getItem("dope_current_user")
  return currentUser ? JSON.parse(currentUser) : null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem("dope_current_user", JSON.stringify(user))
  } else {
    localStorage.removeItem("dope_current_user")
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export const loginUser = ({ email, password }: LoginCredentials): User | null => {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

export const registerUser = (userData: Omit<User, "id" | "createdAt">): User => {
  const users = getUsers()
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  saveUsers(users)
  setCurrentUser(newUser)
  return newUser
}

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates }
    saveUsers(users)
    if (getCurrentUser()?.id === userId) {
      setCurrentUser(users[userIndex])
    }
    return users[userIndex]
  }
  return null
}

export const logoutUser = () => {
  setCurrentUser(null)
}

// Coupon functions
export const validateCoupon = (
  code: string,
  orderValue: number,
): { valid: boolean; coupon?: Coupon; error?: string } => {
  const coupons = getCoupons()
  const coupon = coupons.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive)

  if (!coupon) {
    return { valid: false, error: "Invalid coupon code" }
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, error: "Coupon has expired" }
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: "Coupon usage limit reached" }
  }

  if (orderValue < coupon.minOrderValue) {
    return { valid: false, error: `Minimum order value should be ₹${coupon.minOrderValue}` }
  }

  return { valid: true, coupon }
}

export const applyCoupon = (code: string): void => {
  const coupons = getCoupons()
  const couponIndex = coupons.findIndex((c) => c.code.toLowerCase() === code.toLowerCase())
  if (couponIndex !== -1) {
    coupons[couponIndex].usedCount += 1
    saveCoupons(coupons)
  }
}

export const calculateDiscount = (coupon: Coupon, orderValue: number): number => {
  if (coupon.type === "percentage") {
    const discount = (orderValue * coupon.value) / 100
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
  } else {
    return coupon.value
  }
}
