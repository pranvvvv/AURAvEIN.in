"use client"

import { useEffect, useState } from "react"

interface PerformanceLoaderProps {
  children: React.ReactNode
  delay?: number
  fallback?: React.ReactNode
}

export default function PerformanceLoader({ 
  children, 
  delay = 100,
  fallback = <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
}: PerformanceLoaderProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!shouldRender) {
    return <>{fallback}</>
  }

  return <>{children}</>
}