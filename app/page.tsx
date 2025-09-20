"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import HeroSection from "@/components/HeroSection"
import FeaturedCategories from "@/components/FeaturedCategories"
import FeaturedProducts from "@/components/FeaturedProducts"
import PromoBanner from "@/components/PromoBanner"
import BlogSection from "@/components/BlogSection"
import NewsletterSection from "@/components/NewsletterSection"
import InstagramFeed from "@/components/InstagramFeed"

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
