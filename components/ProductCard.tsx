"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Heart, Share2, Ruler, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"
import ProductQuantity from "./ProductQuantity"

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
  sizes?: string[]
  colors?: string[]
  stock?: number
  isLimitedEdition?: boolean
  quantity?: number
  isActive?: boolean
  isFeatured?: boolean
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

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
  overlaySettings?: Product['overlaySettings']
}

export default function ProductCard({ product, viewMode = "grid", overlaySettings }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const { addToCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showFlyAnimation, setShowFlyAnimation] = useState(false)

  // Get overlay settings with defaults
  const settings = overlaySettings || product.overlaySettings || {
    showSizeSelector: true,
    showColorSelector: true,
    showAddToCart: true,
    defaultSize: 'M',
    defaultColor: 'Default',
    buttonText: 'Add to Cart',
    buttonIcon: 'shopping-bag'
  }

  // Initialize selections from settings
  useEffect(() => {
    if (settings.defaultSize && !selectedSize) {
      setSelectedSize(settings.defaultSize)
    }
    if (settings.defaultColor && !selectedColor) {
      setSelectedColor(settings.defaultColor)
    }
  }, [settings, selectedSize, selectedColor])

  // Get primary image (first image from images array or fallback to image)
  const primaryImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image

  useEffect(() => {
    // Check if product is already wishlisted
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setIsWishlisted(wishlist.some((item: Product) => item.id === product.id))
    } catch (error) {
      console.warn('Failed to read wishlist from localStorage:', error)
      setIsWishlisted(false)
    }
  }, [product.id])

  const handleAddToCart = () => {
    if (!settings.showAddToCart) return

    setIsAddingToCart(true)
    setShowFlyAnimation(true)

    // Add to cart with selected size and color
    addToCart(product, selectedSize, selectedColor, 1)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} (Size: ${selectedSize}, Color: ${selectedColor}) has been added to your cart.`,
      duration: 3000,
    })

    // Reset animation after delay
    setTimeout(() => {
      setIsAddingToCart(false)
      setShowFlyAnimation(false)
    }, 1000)
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
          duration: 3000,
        })
      } else {
        wishlist = wishlist.filter((item: Product) => item.id !== product.id)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        setIsWishlisted(false)
        toast({
          title: "Removed from Wishlist",
          description: "Item removed from your wishlist.",
          duration: 3000,
        })
      }
    } catch (error) {
      console.warn('Failed to update wishlist:', error)
      toast({
        title: "Error",
        description: "Failed to add to wishlist. Please try again.",
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link Copied!",
        description: "Product link is ready to share.",
        duration: 2000,
      })
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy link.",
        duration: 2000,
        variant: "destructive",
      })
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  // Get button icon component
  const getButtonIcon = () => {
    switch (settings.buttonIcon) {
      case 'shopping-bag':
        return <ShoppingBag className="w-3 h-3 mr-1" />
      case 'ruler':
        return <Ruler className="w-3 h-3 mr-1" />
      case 'palette':
        return <Palette className="w-3 h-3 mr-1" />
      default:
        return <ShoppingBag className="w-3 h-3 mr-1" />
    }
  }

  if (viewMode === "list") {
    return (
      <div className="flex gap-6 p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300">
        <div className="product-image-container w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg">
          <Link href={`/product/${product.id}`} tabIndex={0}>
            <Image
              src={primaryImage && !primaryImage.includes('/placeholder.svg') ? primaryImage : "/placeholder.svg"}
              alt={product.name}
              width={200}
              height={200}
              className="product-image w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>
          {product.videoUrl && (
            <video
              className="video-hover"
              loop
              muted
              playsInline
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
              onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
            >
              <source src={product.videoUrl} type="video/mp4" />
            </video>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <Link href={`/product/${product.id}`} tabIndex={0}>
              <h3 className="text-sm font-medium uppercase tracking-wider hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded">
                {product.name}
              </h3>
            </Link>
            
            {/* Display Quantity and Limited Edition Status */}
            <ProductQuantity 
              quantity={product.quantity || 0} 
              isLimitedEdition={product.isLimitedEdition || false} 
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          </div>
          
          {/* Size Selection for List View */}
          {settings.showSizeSelector && product.sizes && product.sizes.length > 0 && (
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  onKeyDown={(e) => handleKeyDown(e, () => setSelectedSize(size))}
                  className={`px-3 py-1 text-xs border rounded transition-all duration-200 size-button focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${
                    selectedSize === size
                      ? "bg-black text-white border-black shadow-md"
                      : "bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50"
                  }`}
                  aria-label={`Select size ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* Color Selection for List View removed as requested */}
          
          <div className="flex gap-2">
            {settings.showAddToCart && (
              <Button
                className={`flex-1 text-xs uppercase tracking-wider transition-all duration-300 ${
                  isAddingToCart ? "animate-pulse bg-green-600" : ""
                }`}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                aria-label={`${settings.buttonText} ${product.name}`}
              >
                {getButtonIcon()}
                {isAddingToCart ? "Added!" : settings.buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
    >
      {/* Fly to cart animation */}
      {showFlyAnimation && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-fly-to-cart bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              ✓ Added to Cart
            </div>
          </div>
        </div>
      )}

      <div className="product-image-container relative aspect-square overflow-hidden group">
        <Link href={`/product/${product.id}`} tabIndex={0}>
          <Image
            src={primaryImage && !primaryImage.includes('/placeholder.svg') ? primaryImage : "/placeholder.svg"}
            alt={product.name}
            fill
            className="product-image object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.videoUrl && (
            <video
              className="video-hover"
              loop
              muted
              playsInline
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
              onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
            >
              <source src={product.videoUrl} type="video/mp4" />
            </video>
          )}
        </Link>
        {/* Wishlist & Share Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          <Button
            size="icon"
            variant="ghost"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlist}
            className={`${isWishlisted ? "text-red-500" : ""} bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1`}
          >
            <Heart fill={isWishlisted ? "currentColor" : "none"} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Share product"
            onClick={handleShare}
            className="bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
          >
            <Share2 />
          </Button>
        </div>
        
        {/* Hover Actions */}
        <div className={`product-overlay absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          <div className="space-y-3">
            {/* Size Selection */}
            {settings.showSizeSelector && product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-2 justify-center">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    onKeyDown={(e) => handleKeyDown(e, () => setSelectedSize(size))}
                    className={`px-3 py-1 text-xs border rounded transition-all duration-200 size-button focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 ${
                      selectedSize === size
                        ? "bg-white text-black border-white shadow-md"
                        : "bg-black/50 text-white border-white/50 hover:bg-white hover:text-black"
                    }`}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Color Selection */}
            {settings.showColorSelector && product.colors && product.colors.length > 0 && (
              <div className="flex gap-2 justify-center">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    onKeyDown={(e) => handleKeyDown(e, () => setSelectedColor(color))}
                    className={`px-3 py-1 text-xs border rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 ${
                      selectedColor === color
                        ? "bg-white text-black border-white shadow-md"
                        : "bg-black/50 text-white border-white/50 hover:bg-white hover:text-black"
                    }`}
                    aria-label={`Select color ${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
            
            {settings.showAddToCart && (
              <Button
                size="sm"
                className={`bg-white text-black hover:bg-gray-100 text-xs uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 ${
                  isAddingToCart ? "animate-pulse bg-green-600 text-white" : ""
                }`}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                aria-label={`${settings.buttonText} ${product.name}`}
              >
                {getButtonIcon()}
                {isAddingToCart ? "Added!" : settings.buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4 text-center">
        <Link href={`/product/${product.id}`} tabIndex={0}>
          <h3 className="text-xs md:text-sm font-medium uppercase tracking-wider hover:text-gray-600 transition-colors line-clamp-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded">
            {product.name}
          </h3>
        </Link>

        {/* Display Quantity and Limited Edition Status for Grid View */}
        <div className="mt-1">
          <ProductQuantity 
            quantity={product.quantity || 0} 
            isLimitedEdition={product.isLimitedEdition || false} 
          />
        </div>

        <div className="mt-2">
          <span className="text-xs md:text-sm font-medium">{formatPrice(product.price)}</span>
        </div>
        
        {/* Size and Color indicators for grid view */}
        <div className="mt-1 md:mt-2 text-xs text-gray-500 space-y-1">
          {settings.showSizeSelector && selectedSize && (
            <div>Size: {selectedSize}</div>
          )}
          {settings.showColorSelector && selectedColor && (
            <div>Color: {selectedColor}</div>
          )}
        </div>
      </div>
    </div>
  )
}
