"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Package, Users, ShoppingCart, Plus, Edit, Trash2, Eye, DollarSign } from "lucide-react"
import MultiImageUpload from "@/components/MultiImageUpload"
import {
  getCurrentUser,
  getProducts,
  getOrders,
  getUsers,
  getCoupons,
  saveProducts,
  saveCoupons,
  type Product,
  type Order,
  type User,
  type Coupon,
} from "@/lib/localStorage"
import { toast } from "@/components/ui/use-toast"

export default function AdminPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  // Product form state
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    price: 0,
    originalPrice: 0,
    category: "",
    description: "",
    sizes: "",
    colors: "",
    stock: 0,
    brand: "",
    tags: "",
    image: "",
    images: [] as string[],
  })

  // Coupon form state
  const [couponForm, setCouponForm] = useState({
    id: "",
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    expiryDate: "",
    usageLimit: 0,
  })

  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      router.push("/admin/login")
      return
    }

    loadData()
  }, [currentUser, router])

  const loadData = () => {
    setProducts(getProducts())
    setOrders(getOrders())
    setUsers(getUsers())
    setCoupons(getCoupons())
  }

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalCustomers = users.filter((user) => !user.isAdmin).length
  const totalProducts = products.length

  // Monthly sales data
  const monthlySales = orders.reduce(
    (acc, order) => {
      const month = new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + order.total
      return acc
    },
    {} as Record<string, number>,
  )

  const salesData = Object.entries(monthlySales).map(([month, revenue]) => ({
    month,
    revenue,
    orders: orders.filter(
      (order) => new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) === month,
    ).length,
  }))

  // Category wise sales
  const categorySales = products.reduce(
    (acc, product) => {
      const productOrders = orders.filter((order) => order.items.some((item) => item.productId === product.id))
      const categoryRevenue = productOrders.reduce((sum, order) => {
        const productItems = order.items.filter((item) => item.productId === product.id)
        return sum + productItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
      }, 0)

      acc[product.category] = (acc[product.category] || 0) + categoryRevenue
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryData = Object.entries(categorySales).map(([category, revenue]) => ({
    category,
    revenue,
  }))

  // Order status distribution
  const statusDistribution = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
    status,
    count,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Product management functions
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData: Product = {
      id: editingProduct || Date.now().toString(),
      name: productForm.name,
      price: productForm.price,
      originalPrice: productForm.originalPrice || productForm.price,
      discount: productForm.originalPrice
        ? Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
        : 0,
      category: productForm.category,
      description: productForm.description,
      sizes: productForm.sizes.split(",").map((s) => s.trim()),
      colors: productForm.colors ? productForm.colors.split(",").map((c) => c.trim()) : undefined,
      stock: productForm.stock,
      brand: productForm.brand,
      tags: productForm.tags ? productForm.tags.split(",").map((t) => t.trim()) : undefined,
      image: productForm.image || "/placeholder.svg?height=400&width=400",
      images: productForm.images.length > 0 ? productForm.images : [productForm.image || "/placeholder.svg?height=400&width=400"],
      rating: 4.5,
      reviews: 0,
      isActive: true,
      createdAt: editingProduct
        ? products.find((p) => p.id === editingProduct)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    }

    const updatedProducts = editingProduct
      ? products.map((p) => (p.id === editingProduct ? productData : p))
      : [...products, productData]

    saveProducts(updatedProducts)
    setProducts(updatedProducts)
    resetProductForm()

    toast({
      title: editingProduct ? "Product Updated" : "Product Added",
      description: `${productData.name} has been ${editingProduct ? "updated" : "added"} successfully.`,
    })
  }

  const resetProductForm = () => {
    setProductForm({
      id: "",
      name: "",
      price: 0,
      originalPrice: 0,
      category: "",
      description: "",
      sizes: "",
      colors: "",
      stock: 0,
      brand: "",
      tags: "",
      image: "",
      images: [],
    })
    setEditingProduct(null)
  }

  const editProduct = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      category: product.category,
      description: product.description,
      sizes: product.sizes.join(", "),
      colors: product.colors?.join(", ") || "",
      stock: product.stock,
      brand: product.brand || "",
      tags: product.tags?.join(", ") || "",
      image: product.image,
      images: product.images || [product.image],
    })
    setEditingProduct(product.id)
  }

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId)
    saveProducts(updatedProducts)
    setProducts(updatedProducts)

    toast({
      title: "Product Deleted",
      description: "Product has been deleted successfully.",
    })
  }

  // Coupon management functions
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const couponData: Coupon = {
      id: editingCoupon || Date.now().toString(),
      code: couponForm.code.toUpperCase(),
      type: couponForm.type,
      value: couponForm.value,
      minOrderValue: couponForm.minOrderValue,
      maxDiscount: couponForm.type === "percentage" ? couponForm.maxDiscount : undefined,
      expiryDate: couponForm.expiryDate,
      usageLimit: couponForm.usageLimit,
      usedCount: editingCoupon ? coupons.find((c) => c.id === editingCoupon)?.usedCount || 0 : 0,
      isActive: true,
      createdAt: editingCoupon
        ? coupons.find((c) => c.id === editingCoupon)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    }

    const updatedCoupons = editingCoupon
      ? coupons.map((c) => (c.id === editingCoupon ? couponData : c))
      : [...coupons, couponData]

    saveCoupons(updatedCoupons)
    setCoupons(updatedCoupons)
    resetCouponForm()

    toast({
      title: editingCoupon ? "Coupon Updated" : "Coupon Created",
      description: `Coupon ${couponData.code} has been ${editingCoupon ? "updated" : "created"} successfully.`,
    })
  }

  const resetCouponForm = () => {
    setCouponForm({
      id: "",
      code: "",
      type: "percentage",
      value: 0,
      minOrderValue: 0,
      maxDiscount: 0,
      expiryDate: "",
      usageLimit: 0,
    })
    setEditingCoupon(null)
  }

  const editCoupon = (coupon: Coupon) => {
    setCouponForm({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount || 0,
      expiryDate: coupon.expiryDate.split("T")[0],
      usageLimit: coupon.usageLimit,
    })
    setEditingCoupon(coupon.id)
  }

  const deleteCoupon = (couponId: string) => {
    const updatedCoupons = coupons.filter((c) => c.id !== couponId)
    saveCoupons(updatedCoupons)
    setCoupons(updatedCoupons)

    toast({
      title: "Coupon Deleted",
      description: "Coupon has been deleted successfully.",
    })
  }

  if (!currentUser || !currentUser.isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser.name}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From {totalOrders} orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Average: ₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">In inventory</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percent }) => `${status} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Sales */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product Management</h2>
            <Button onClick={() => setActiveTab("add-product")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Product Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Brand</label>
                    <Input
                      value={productForm.brand}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, brand: e.target.value }))}
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price (₹)</label>
                    <Input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Original Price (₹)</label>
                    <Input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, originalPrice: Number(e.target.value) }))}
                      placeholder="Enter original price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Input
                      value={productForm.category}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., t-shirts, hoodies"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stock</label>
                    <Input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                      placeholder="Enter stock quantity"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sizes (comma separated)</label>
                    <Input
                      value={productForm.sizes}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, sizes: e.target.value }))}
                      placeholder="S, M, L, XL, XXL"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Colors (comma separated)</label>
                    <Input
                      value={productForm.colors}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, colors: e.target.value }))}
                      placeholder="Black, White, Red"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <MultiImageUpload
                      initialImages={productForm.images || []}
                      onImageChange={(images, primaryImage) => {
                        setProductForm((prev) => ({ ...prev, images, image: primaryImage }))
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input
                      value={productForm.description}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter product description"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                    <Input
                      value={productForm.tags}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, tags: e.target.value }))}
                      placeholder="oversized, premium, cotton"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
                  {editingProduct && (
                    <Button type="button" variant="outline" onClick={resetProductForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>All Products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {product.category} • {product.brand}
                      </p>
                      <p className="text-sm">
                        ₹{product.price} • Stock: {product.stock}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editProduct(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Order Management</h2>
            <div className="text-sm text-gray-600">Total Orders: {orders.filter(o => o.screenshot).length}</div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {orders.filter(order => order.screenshot).length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No paid orders found</p>
                  </div>
                ) : (
                  orders.filter(order => order.screenshot).map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{order.coupon ? order.coupon : "No Coupon"}</Badge>
                          <Badge className="bg-green-100 text-green-800">{order.status}</Badge>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Products:</p>
                        <ul className="text-sm ml-4 list-disc">
                          {order.items.map((item: any, idx: number) => (
                            <li key={idx}>{item.name} (x{item.quantity}) - ₹{item.price * item.quantity}</li>
                          ))}
                        </ul>
                        </div>
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Customer Address:</p>
                        <div className="text-sm text-gray-700 ml-2">
                          {order.address.fullName}, {order.address.phone}<br />
                          {order.address.house}, {order.address.street}, {order.address.landmark}<br />
                          {order.address.city} - {order.address.pincode}
                        </div>
                      </div>
                      <div className="mb-3 flex flex-col md:flex-row md:items-center md:gap-8">
                        <div className="text-sm mb-2 md:mb-0">
                          <span className="font-medium">Total:</span> RS. {order.total}<br />
                          <span className="font-medium">Discount:</span> RS. {order.discount || 0}<br />
                          <span className="font-medium">Final:</span> RS. {order.finalTotal || order.total}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">UPI ID:</span> {order.upiId || "-"}
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="font-medium text-sm">Payment Screenshot:</span><br />
                        <img src={order.screenshot} alt="Payment Screenshot" className="mt-2 rounded max-h-40 border" style={{maxWidth:'100%'}} />
                      </div>
                      <div className="text-xs text-gray-500">Placed at: {new Date(order.createdAt).toLocaleString("en-IN")}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Customer Management</h2>
            <div className="text-sm text-gray-600">Total Customers: {totalCustomers}</div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {users
                  .filter((user) => !user.isAdmin)
                  .map((user) => {
                    const userOrders = orders.filter((order) => order.userId === user.id)
                    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)

                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-600">{user.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{userOrders.length} orders</p>
                          <p className="text-sm text-gray-600">₹{totalSpent.toLocaleString()} spent</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(user.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Coupon Management</h2>
          </div>

          {/* Coupon Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCouponSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Coupon Code</label>
                    <Input
                      value={couponForm.code}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="WELCOME10"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Type</label>
                    <Select
                      value={couponForm.type}
                      onValueChange={(value: "percentage" | "fixed") =>
                        setCouponForm((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {couponForm.type === "percentage" ? "Discount %" : "Discount Amount (₹)"}
                    </label>
                    <Input
                      type="number"
                      value={couponForm.value}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, value: Number(e.target.value) }))}
                      placeholder={couponForm.type === "percentage" ? "10" : "200"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Order Value (₹)</label>
                    <Input
                      type="number"
                      value={couponForm.minOrderValue}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, minOrderValue: Number(e.target.value) }))}
                      placeholder="1000"
                      required
                    />
                  </div>

                  {couponForm.type === "percentage" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Maximum Discount (₹)</label>
                      <Input
                        type="number"
                        value={couponForm.maxDiscount}
                        onChange={(e) => setCouponForm((prev) => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                        placeholder="500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <Input
                      type="date"
                      value={couponForm.expiryDate}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, expiryDate: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Usage Limit</label>
                    <Input
                      type="number"
                      value={couponForm.usageLimit}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))}
                      placeholder="100"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">{editingCoupon ? "Update Coupon" : "Create Coupon"}</Button>
                  {editingCoupon && (
                    <Button type="button" variant="outline" onClick={resetCouponForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Coupons List */}
          <Card>
            <CardHeader>
              <CardTitle>All Coupons ({coupons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {coupon.code}
                        </Badge>
                        <Badge variant={coupon.isActive ? "default" : "secondary"}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm">
                        {coupon.type === "percentage"
                          ? `${coupon.value}% off (max ₹${coupon.maxDiscount || "unlimited"})`
                          : `₹${coupon.value} off`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Min order: ₹{coupon.minOrderValue} • Used: {coupon.usedCount}/{coupon.usageLimit} • Expires:{" "}
                        {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editCoupon(coupon)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCoupon(coupon.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

