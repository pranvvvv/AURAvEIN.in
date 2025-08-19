"use client"

import React, { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, Heart, Share2, ShoppingBag, Minus, Plus, Truck, Shield, RotateCcw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { products } from "@/lib/data"
import Link from "next/link"

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

export default function ProductPage() {
  const params = useParams()
  const { addToCart, cartItems } = useCart()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("Default")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Available colors for the product
  const availableColors = ["Default", "Black", "White", "Navy", "Red", "Green"]

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        setError(null)
        
        // Try to get products from API first, fallback to static data
        let productsData = products
        
        try {
          const response = await fetch('/api/refresh-products')
          if (response.ok) {
            const apiProducts = await response.json()
            if (apiProducts.length > 0) {
              productsData = apiProducts
            }
          }
        } catch (apiError) {
          console.log('Using static products data')
        }
        
        // Find product from the data
        const productData = productsData.find((p: any) => p.id === params.id)
        
        if (!productData) {
          setError("Product not found")
          setIsLoading(false)
          return
        }

        // Transform the product to match the expected format
        const transformedProduct: Product = {
          ...productData,
          isActive: true,
          isFeatured: true,
          stock: productData.quantity,
          createdAt: (productData as any).createdAt || new Date(),
          updatedAt: (productData as any).updatedAt || new Date(),
          overlaySettings: {
            showSizeSelector: true,
            showColorSelector: false,
            showAddToCart: true,
            defaultSize: "M",
            defaultColor: "Default",
            buttonText: "ADD TO CART",
            buttonIcon: "ShoppingBag"
          }
        }

        setProduct(transformedProduct)
        
        // Initialize selections
        if (transformedProduct.sizes && transformedProduct.sizes.length > 0) {
          setSelectedSize(transformedProduct.sizes[0])
        }
        
        setSelectedColor("Default")
        setSelectedImage(0)
        
        // Check if product is already wishlisted
        try {
          const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
          setIsWishlisted(wishlist.some((item: Product) => item.id === productData.id))
        } catch (error) {
          console.warn('Failed to read wishlist from localStorage:', error)
          setIsWishlisted(false)
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading product:', err)
        setError('Failed to load product')
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleVideoPlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play()
      } catch (error) {
        console.log("Video play interrupted")
      }
    }
  }

  const handleVideoPause = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause()
      } catch (error) {
        console.log("Video pause interrupted")
      }
    }
  }

  const handleAddToCart = () => {
    if (!product) {
      toast({
        title: "Product not found",
        description: "Unable to add product to cart.",
        variant: "destructive",
      })
      return
    }

    // Validate size selection (always required)
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "Size selection is required to add this item to cart.",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)

    try {
      // Get primary image (first image in the array)
      const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image

      addToCart(product, selectedSize, selectedColor, quantity)

      toast({
        title: "Added to cart!",
        description: `${product.name} (Size: ${selectedSize}, Color: ${selectedColor}) has been added to your cart.`,
      })

      // Reset quantity after adding to cart
      setQuantity(1)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = () => {
    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      if (!isWishlisted) {
        wishlist.push(product)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        setIsWishlisted(true)
        toast({
          title: "Added to Wishlist",
          description: "Your favorite item is waiting! Complete your purchase now.",
        })
      } else {
        wishlist = wishlist.filter((item: Product) => item.id !== product?.id)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        setIsWishlisted(false)
        toast({
          title: "Removed from Wishlist",
          description: "Item removed from your wishlist.",
        })
      }
    } catch (error) {
      console.warn('Failed to update wishlist:', error)
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product?.id}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Check out this amazing product: ${product?.name}`,
          url: url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Product link has been copied to your clipboard.",
        })
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not share or copy link.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image]
  const primaryImage = allImages[0]

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 text-sm sm:text-base">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-3 sm:space-y-4">
          {/* Main Image with image counter */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
            {allImages.length > 1 && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
                {selectedImage + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {allImages.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700">
                  Product Images ({allImages.length})
                </h3>
              </div>
              {/* Mobile: Horizontal scroll */}
              <div className="block sm:hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 relative aspect-square w-16 h-16 overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index ? "border-black ring-2 ring-black/20" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {/* Desktop: Grid */}
              <div className="hidden sm:grid grid-cols-4 gap-2">
                {allImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedImage === index ? "border-black ring-2 ring-black/20" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video (if available) */}
          {product.videoUrl && (
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
              <video
                ref={videoRef}
                src={product.videoUrl}
                className="w-full h-full object-cover"
                onMouseEnter={handleVideoPlay}
                onMouseLeave={handleVideoPause}
                muted
                loop
              />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4 sm:space-y-6">
          {/* Product Header */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs sm:text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
              <Badge variant="secondary" className="w-fit text-xs sm:text-sm">{product.category}</Badge>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-2xl sm:text-3xl font-bold">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg sm:text-xl text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            {product.discount && (
              <Badge className="bg-green-100 text-green-800 w-fit text-xs sm:text-sm">
                {product.discount}% OFF
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600">{product.description}</p>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 border rounded-md transition-all duration-200 text-sm sm:text-base ${
                    selectedSize === size
                      ? "border-black bg-black text-white shadow-md"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection removed as requested */}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-2 sm:px-3 sm:py-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="px-3 py-2 sm:px-4 sm:py-2 border-x text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-2 sm:px-3 sm:py-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <span className="text-xs sm:text-sm text-gray-600">
                {product.stock || 0} items available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize || isAddingToCart}
              className={`flex-1 transition-all duration-300 text-sm sm:text-base py-2 sm:py-3 ${isAddingToCart ? 'animate-pulse' : ''}`}
            >
              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <div className="flex gap-3 sm:gap-4">
              <Button 
                variant="outline" 
                onClick={handleWishlist}
                className="transition-all duration-200 hover:bg-red-50 px-3 sm:px-4"
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" onClick={handleShare} className="px-3 sm:px-4">
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 sm:pt-6 border-t">
            <div className="text-center">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-xs sm:text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over ₹999</p>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-xs sm:text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-500">100% secure checkout</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-xs sm:text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-500">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-8 sm:mt-12 lg:mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4 sm:mt-6">
            <div className="prose max-w-none text-sm sm:text-base">
              <p>{product?.description}</p>
              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Product Details</h3>
              <ul className="text-sm sm:text-base space-y-1">
                <li>Material: Premium cotton blend</li>
                <li>Care: Machine wash cold</li>
                <li>Fit: Regular fit</li>
                <li>Style: Casual</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 sm:mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl sm:text-3xl font-bold">{product?.rating}</div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          product && i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{product?.reviews} reviews</p>
                </div>
              </div>
              <Separator />
              <p className="text-sm sm:text-base text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-4 sm:mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm sm:text-base">Shipping Information</h3>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li>• Free shipping on orders over ₹999</li>
                <li>• Standard delivery: 5-7 business days</li>
                <li>• Express delivery: 2-3 business days (additional charges apply)</li>
                <li>• International shipping available</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
