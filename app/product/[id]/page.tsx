"use client"

import React, { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Star, Heart, Share2, ShoppingBag, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { getProducts } from "@/lib/localStorage"


export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    const allProducts = getProducts()
    const found = allProducts.find((p: any) => p.id === params.id)
    setProduct(found)
  }, [params.id])

  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0])
    }
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0])
    }
    
    // Set initial selected image to primary image (always index 0 due to our image ordering)
    if (product) {
      setSelectedImage(0)
    }
  }, [product])

  const handleVideoPlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play()
      } catch (error) {
        // Silently handle the error - video might already be playing or paused
        console.log("Video play interrupted")
      }
    }
  }

  const handleVideoPause = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause()
      } catch (error) {
        // Silently handle the error
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

    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      })
      return
    }

    try {
      addToCart(product, selectedSize, selectedColor || "Default", quantity)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error adding to cart",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  // Filter out placeholder images and only show real uploaded images
  const productImages = React.useMemo(() => {
    if (!product) return []
    
    const allImages = []
    
    // Add primary image if it's not a placeholder
    if (product.image && !product.image.includes('/placeholder.svg')) {
      allImages.push(product.image)
    }
    
    // Add additional images if they exist and are not placeholders
    if (product.images && product.images.length > 0) {
      const validImages = product.images.filter(img => 
        img && !img.includes('/placeholder.svg') && !allImages.includes(img)
      )
      allImages.push(...validImages)
    }
    
    return allImages
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <div className="relative w-full h-full" onMouseEnter={handleVideoPlay} onMouseLeave={handleVideoPause}>
                <Image
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                  muted
                  loop
                  playsInline
                >
                  <source src="/placeholder-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Thumbnail Images - only show if there are multiple images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2 transition-colors ${
                      selectedImage === index ? "border-black" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.isNew && <Badge>New</Badge>}
                {product.sale && <Badge variant="destructive">Sale</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(124 reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Color</h3>
                <div className="flex gap-2">
                  {product.colors?.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button onClick={handleAddToCart} className="w-full" size="lg">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleWishlist} className="flex-1 bg-transparent">
                  <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm">Free shipping on orders over ₹999</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm">2 year warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <span className="text-sm">30 day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p>
                  {product.description ||
                    "This premium product combines style and comfort, crafted with attention to detail and quality materials. Perfect for everyday wear or special occasions."}
                </p>
                <h4>Features:</h4>
                <ul>
                  <li>Premium quality materials</li>
                  <li>Comfortable fit</li>
                  <li>Durable construction</li>
                  <li>Easy care instructions</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Product Details</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Material:</dt>
                      <dd>100% Cotton</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Care:</dt>
                      <dd>Machine wash cold</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Origin:</dt>
                      <dd>Made in India</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Size Guide</h4>
                  <p className="text-sm text-gray-600">
                    Please refer to our size guide for the perfect fit. If you're between sizes, we recommend sizing up.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">4.2 out of 5</span>
                  <span className="text-gray-600">(124 reviews)</span>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">Customer {review}</span>
                        <span className="text-sm text-gray-600">2 days ago</span>
                      </div>
                      <p className="text-gray-700">
                        Great quality product! Fits perfectly and the material feels premium. Would definitely
                        recommend.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
