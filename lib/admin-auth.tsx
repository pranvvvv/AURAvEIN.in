"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AdminSession {
  id: string
  name: string
  email: string
  isAdmin: boolean
  role: string
  loginTime: string
}

export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = () => {
    try {
      const adminSession = localStorage.getItem('adminSession')
      if (adminSession) {
        const admin = JSON.parse(adminSession)
        
        // Check if session is still valid (24 hours)
        const loginTime = new Date(admin.loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
        
        if (hoursDiff < 24 && admin.isAdmin) {
          setAdminUser(admin)
        } else {
          // Session expired
          localStorage.removeItem('adminSession')
          setAdminUser(null)
        }
      } else {
        setAdminUser(null)
      }
    } catch (error) {
      console.error('Error checking admin auth:', error)
      setAdminUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('adminSession')
    setAdminUser(null)
    router.push('/admin/login')
  }

  return {
    adminUser,
    loading,
    isAuthenticated: !!adminUser,
    logout,
    checkAdminAuth
  }
}