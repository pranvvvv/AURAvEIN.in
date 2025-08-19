"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginUser, registerUser, logoutUser, getCurrentUser } from "@/lib/hybridService"
import { loginAdmin, getCurrentAdmin, logoutAdmin } from "@/lib/firebaseService"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  isAdmin?: boolean
  role?: string
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log('checkAuthStatus called')
      setLoading(true)
      
      // Check for admin first
      console.log('Checking for admin...')
      const admin = await getCurrentAdmin()
      console.log('Admin check result:', admin)
      if (admin) {
        console.log('Admin found, setting user with admin data:', admin)
        setUser(admin)
        setLoading(false)
        return
      }

      // Check for regular user
      console.log('Checking for regular user...')
      const currentUser = getCurrentUser()
      console.log('Regular user check result:', currentUser)
      if (currentUser) {
        console.log('Regular user found, setting user')
        setUser(currentUser)
        setLoading(false)
        return
      }

      // No authenticated user found
      console.log('No authenticated user found')
      setUser(null)
      setLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email)
      
      // First try to login as admin
      try {
        console.log('Attempting admin login...')
        const adminData = await loginAdmin(email, password)
        console.log('Admin login successful:', adminData)
        console.log('Setting user state with admin data:', adminData)
        setUser(adminData)
        console.log('User state set, redirecting to admin...')
        
        // Verify admin session is stored
        const storedSession = localStorage.getItem('admin_session')
        console.log('Stored admin session:', storedSession)
        
        // Force a small delay to ensure state is updated
        setTimeout(() => {
          console.log('Redirecting to admin page...')
          router.push("/admin")
        }, 100)
        
        return
      } catch (adminError) {
        console.log('Admin login failed:', adminError)
        // If admin login fails, try regular user login
        console.log('Not an admin, trying regular user login...')
      }

      // Try regular user login
      console.log('Attempting regular user login...')
      const userData = await loginUser(email, password)
      console.log('Regular user login successful:', userData)
      setUser(userData)
      router.push("/dashboard")
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }



  const register = async (userData: any) => {
    try {
      const newUser = await registerUser(userData)
      setUser(newUser)
      router.push("/dashboard")
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Check if user is admin and logout accordingly
      if (user?.isAdmin || user?.role === 'admin') {
        await logoutAdmin()
      } else {
        await logoutUser()
      }
      
      setUser(null)
      
      // Clear admin session
      localStorage.removeItem('admin_session')
      
      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if there's an error
      setUser(null)
      localStorage.removeItem('admin_session')
      router.push("/login")
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: !!(user?.isAdmin || user?.role === 'admin')
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 