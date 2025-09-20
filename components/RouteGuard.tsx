"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  allowedPaths?: string[]
}

export default function RouteGuard({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  allowedPaths = ["/login", "/register", "/"]
}: RouteGuardProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return // Wait for auth to load

    // Check if current path is allowed without authentication
    const isAllowedPath = allowedPaths.some(path => {
      if (path === "/") {
        return pathname === "/"
      }
      return pathname.startsWith(path)
    })

    // If path is allowed without auth, allow access
    if (isAllowedPath && !requireAuth) {
      return
    }

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push("/login")
      return
    }

    // If admin access is required but user is not admin
    if (requireAdmin && !isAdmin) {
      router.push("/login")
      return
    }

    // If user is authenticated but trying to access login/register pages, redirect to appropriate dashboard
    if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      return
    }
  }, [user, loading, isAuthenticated, isAdmin, pathname, router, requireAuth, requireAdmin, allowedPaths])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated, show loading
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // If admin access is required but user is not admin, show loading
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 