"use client"

import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { ShoppingBag } from "lucide-react"
import { products } from "@/lib/data"

interface Product {
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
  isFeatured: boolean
  isLimitedEdition?: boolean
  quantity: number
  overlaySettings?: {
    showSizeSelector: boolean
    showColorSelector: boolean
    showAddToCart: boolean
    defaultSize: string
    defaultColor: string
    buttonText: string
    buttonIcon: string
  }
  createdAt: Date
  updatedAt: Date
}

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const productsData = await response.json();
        // Sort limited edition products first, then by featured status
        const sortedProducts = productsData.sort((a: any, b: any) => {
          if (a.isLimitedEdition && !b.isLimitedEdition) return -1;
          if (!a.isLimitedEdition && b.isLimitedEdition) return 1;
          return 0;
        });
        setFeaturedProducts(sortedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setFeaturedProducts([]);
      }
    };
    loadProducts();
  }, []);

  if (featuredProducts.length === 0) {
    return (
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Featured Products</h2>
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No featured products available</p>
              <p className="text-gray-400 text-sm">Check back soon for new arrivals!</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Featured Products</h2>
          <p className="text-gray-600 text-xs md:text-base">Discover our handpicked selection of premium items</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="product-grid-item product-card-entrance"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard 
                product={product} 
                overlaySettings={product.overlaySettings}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}