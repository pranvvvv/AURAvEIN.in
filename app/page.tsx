import HeroSection from "@/components/HeroSection"
import CategoryShowcase from "@/components/CategoryShowcase"
import FeaturedCategories from "@/components/FeaturedCategories"
import FeaturedProducts from "@/components/FeaturedProducts"
import PromoBanner from "@/components/PromoBanner"
import BlogSection from "@/components/BlogSection"
import NewsletterSection from "@/components/NewsletterSection"
import InstagramFeed from "@/components/InstagramFeed"

export default function Home() {
  return (
    // Main container for bluorng.com-like width and padding
    <div className="max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
      <HeroSection />
      <CategoryShowcase />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromoBanner />
      <BlogSection />
      <NewsletterSection />
      <InstagramFeed />
    </div>
  )
}
