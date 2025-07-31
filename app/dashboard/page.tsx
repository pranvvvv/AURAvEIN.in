"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, User, Heart, ShoppingBag } from "lucide-react"
import { getCurrentUser, getOrders, getWishlist, logoutUser, type Order, type WishlistItem } from "@/lib/localStorage"

export default function Dashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Load user orders
    const allOrders = getOrders()
    const userOrders = allOrders.filter((order) => order.userId === currentUser.id)
    setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

    // Load wishlist
    const userWishlist = getWishlist(currentUser.id)
    setWishlist(userWishlist)
  }, [currentUser, router])

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Wishlist
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link href="/shop">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="font-semibold">Total: ₹{order.total.toLocaleString()}</p>
                    <div className="flex gap-2">
                      {order.status === "shipped" && (
                        <Button size="sm" variant="outline">
                          Track Package
                        </Button>
                      )}
                      {order.status === "delivered" && (
                        <Button size="sm" variant="outline">
                          Rate & Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Wishlist ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No items in wishlist</p>
                <Link href="/shop">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h3 className="font-medium mb-2">{item.name}</h3>
                    <p className="text-lg font-semibold mb-4">₹{item.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <p className="text-gray-900">{currentUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-gray-900">{currentUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <p className="text-gray-900">{currentUser.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Member Since</label>
                <p className="text-gray-900">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
              <Button variant="outline" className="mt-4 bg-transparent">
                Edit Profile
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
