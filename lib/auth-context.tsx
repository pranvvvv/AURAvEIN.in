"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// ...hybridService removed, implement auth with new backend if needed
// ...existing code...

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
      // ...firebase removed, implement admin check with new backend if needed

      // Check for regular user
      // ...hybridService removed, implement user check with new backend if needed

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
    setLoading(true)
    try {
      // ...hybridService removed, implement login with new backend if needed
      throw new Error('Login not implemented')
    } finally {
      setLoading(false)
    }
  }



  const register = async (userData: any) => {
    setLoading(true)
    try {
      // ...hybridService removed, implement register with new backend if needed
      throw new Error('Register not implemented')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      // ...hybridService removed, implement logout with new backend if needed
      setUser(null)
      router.push("/login")
    } finally {
      setLoading(false)
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