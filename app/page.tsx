"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useAuth } from "@/lib/auth-context"
import HeroSection from "@/components/HeroSection"
import FeaturedCategories from "@/components/FeaturedCategories"

// Dynamic imports for below-the-fold components
const FeaturedProducts = dynamic(() => import("@/components/FeaturedProducts"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
})
const PromoBanner = dynamic(() => import("@/components/PromoBanner"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
})
const BlogSection = dynamic(() => import("@/components/BlogSection"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
})
const NewsletterSection = dynamic(() => import("@/components/NewsletterSection"), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />,
})
const InstagramFeed = dynamic(() => import("@/components/InstagramFeed"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
})

export default function Home() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  // Homepage is accessible to everyone, no authentication required
  // But we'll show different content based on authentication status

  return (
    // Main container for bluorng.com-like width and padding
    <div className="max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromoBanner />
      <BlogSection />
      <NewsletterSection />
      <InstagramFeed />
    </div>
  )
}
