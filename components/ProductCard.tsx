"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  videoUrl?: string
  rating: number
  reviews: number
  category: string
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)

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
    setIsAddingToCart(true)

    // Add to cart with default size M and color
    addToCart(product, "M", "Default", 1)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} (Size M) has been added to your cart.`,
      duration: 3000,
    })

    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  const handleWishlist = () => {
    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      if (!wishlist.some((item: Product) => item.id === product.id)) {
        wishlist.push(product)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        setIsWishlisted(true)
        toast({
          title: "Added to Wishlist",
          description: "Your favorite item is waiting! Complete your purchase now.",
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

  const formatPrice = (price: number) => {
    return `RS. ${price.toLocaleString()}`
  }

  if (viewMode === "list") {
    return (
      <div className="flex gap-6 p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        <div className="product-image-container w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={product.image && !product.image.includes('/placeholder.svg') ? product.image : "/placeholder.svg"}
            alt={product.name}
            width={200}
            height={200}
            className="product-image w-full h-full object-cover"
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
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-sm font-medium uppercase tracking-wider hover:text-gray-600 transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              className={`flex-1 text-xs uppercase tracking-wider ${isAddingToCart ? "add-to-cart-animation" : ""}`}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-3 h-3 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container relative aspect-square overflow-hidden group">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image && !product.image.includes('/placeholder.svg') ? product.image : "/placeholder.svg"}
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
            aria-label="Add to Wishlist"
            onClick={handleWishlist}
            className={isWishlisted ? "text-red-500" : ""}
          >
            <Heart fill={isWishlisted ? "currentColor" : "none"} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Share Product"
            onClick={handleShare}
          >
            <Share2 />
          </Button>
        </div>
        {/* Hover Actions */}
        <div className={`product-overlay ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <Button
            size="sm"
            className={`bg-white text-black hover:bg-gray-100 text-xs uppercase tracking-wider ${isAddingToCart ? "add-to-cart-animation" : ""}`}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="p-4 text-center">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xs font-medium uppercase tracking-wider hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
        </div>
      </div>
    </div>
  )
}
