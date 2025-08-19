"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/ProductCard"
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
  createdAt: string
  brand?: string
  tags?: string[]
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
}

interface FilterState {
  category: string
  priceRange: [number, number]
  sortBy: string
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 10000],
    sortBy: "newest",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const productsData = await response.json();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    // Load products on mount
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) => product.isActive)

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((product) => product.category === filters.category)
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    setFilteredProducts(filtered)
  }, [products, filters])

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

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

  const shopDetails = (
    <div className="shop-details mb-8 md:mb-12 text-center">
      <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to Our Shop</h2>
      <p className="text-sm md:text-base text-gray-600 mb-2">
        Discover the latest trends and exclusive collections.
      </p>
      <p className="text-sm md:text-base text-gray-600">
        Enjoy seamless shopping with our curated products.
      </p>
    </div>
  )

  return (
    <div className="max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
      <div className="py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Shop</h1>
          <p className="text-gray-600 text-xs md:text-base">Discover our latest collection</p>
        </div>

        {/* Professional Details */}
        {shopDetails}

        {/* Filters */}
        <div className="mb-8 md:mb-12 flex flex-wrap justify-center gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Products Grid - matching FeaturedProducts style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product, index) => (
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Check back soon for new arrivals!</p>
          </div>
        )}
      </div>
    </div>
  )
}