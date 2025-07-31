"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/ProductCard"
import { getProducts, type Product } from "@/lib/localStorage"

interface FilterState {
  search: string
  categories: string[]
  brands: string[]
  colors: string[]
  sizes: string[]
  priceRange: [number, number]
  inStock: boolean
  sortBy: string
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, 10000],
    inStock: false,
    sortBy: "newest",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const allProducts = getProducts()
    setProducts(allProducts)
  }, [])

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.category))]
    const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))]
    const colors = [...new Set(products.flatMap((p) => p.colors || []))]
    const sizes = [...new Set(products.flatMap((p) => p.sizes))]
    const maxPrice = Math.max(...products.map((p) => p.price), 10000)

    return { categories, brands, colors, sizes, maxPrice }
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand || "")) {
        return false
      }

      // Color filter
      if (filters.colors.length > 0) {
        const hasColor = product.colors?.some((color) => filters.colors.includes(color))
        if (!hasColor) return false
      }

      // Size filter
      if (filters.sizes.length > 0) {
        const hasSize = product.sizes.some((size) => filters.sizes.includes(size))
        if (!hasSize) return false
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Stock filter
      if (filters.inStock && product.stock <= 0) {
        return false
      }

      return true
    })

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [products, filters])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: "categories" | "brands" | "colors" | "sizes", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: [0, filterOptions.maxPrice],
      inStock: false,
      sortBy: "newest",
    })
  }

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.search ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice ? 1 : 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shop All Products</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {/* Filter Toggle */}
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Sort */}
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {filters.search && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Search: {filters.search}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("search", "")} />
                        </Badge>
                      )}
                      {filters.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="flex items-center gap-1">
                          {category}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => toggleArrayFilter("categories", category)}
                          />
                        </Badge>
                      ))}
                      {filters.brands.map((brand) => (
                        <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                          {brand}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleArrayFilter("brands", brand)} />
                        </Badge>
                      ))}
                      {filters.colors.map((color) => (
                        <Badge key={color} variant="secondary" className="flex items-center gap-1">
                          {color}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleArrayFilter("colors", color)} />
                        </Badge>
                      ))}
                      {filters.sizes.map((size) => (
                        <Badge key={size} variant="secondary" className="flex items-center gap-1">
                          {size}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleArrayFilter("sizes", size)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className="space-y-4">
                  <h4 className="font-medium">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                      max={filterOptions.maxPrice}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>₹{filters.priceRange[0]}</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {filterOptions.categories.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Categories</h4>
                    {filterOptions.categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleArrayFilter("categories", category)}
                        />
                        <label htmlFor={`category-${category}`} className="text-sm capitalize">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Brands */}
                {filterOptions.brands.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Brands</h4>
                    {filterOptions.brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={filters.brands.includes(brand || "")}
                          onCheckedChange={() => toggleArrayFilter("brands", brand || "")}
                        />
                        <label htmlFor={`brand-${brand}`} className="text-sm">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Colors */}
                {filterOptions.colors.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Colors</h4>
                    {filterOptions.colors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color}`}
                          checked={filters.colors.includes(color)}
                          onCheckedChange={() => toggleArrayFilter("colors", color)}
                        />
                        <label htmlFor={`color-${color}`} className="text-sm">
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sizes */}
                {filterOptions.sizes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={filters.sizes.includes(size) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleArrayFilter("sizes", size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => updateFilter("inStock", checked)}
                  />
                  <label htmlFor="in-stock" className="text-sm">
                    In Stock Only
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
