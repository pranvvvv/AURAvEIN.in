"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, Star, Settings, ArrowLeft, RotateCcw } from "lucide-react"
import MultiImageUpload from "@/components/MultiImageUpload"
import { useAuth } from "@/lib/auth-context"
// import { products as initialProducts } from "@/lib/data"
import { toast } from "@/components/ui/use-toast"

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
  isLimitedEdition: boolean
  quantity: number
  brand: string
  tags?: string[]
  isActive: boolean
  isFeatured: boolean
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

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [showOverlaySettings, setShowOverlaySettings] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null)
  const [updatingProduct, setUpdatingProduct] = useState<string | null>(null)

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
    isLimitedEdition: false,
    quantity: 0,
    brand: "",
    tags: "",
    image: "",
    images: [] as string[],
    isFeatured: false,
    overlaySettings: {
      showSizeSelector: true,
      showColorSelector: true,
      showAddToCart: true,
      defaultSize: 'M',
      defaultColor: '',
      buttonText: 'Add to Cart',
      buttonIcon: 'shopping-bag'
    }
  })

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }
      
      if (!isAdmin) {
        router.push("/login")
        return
      }
    }
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (user && isAdmin) {
      loadProducts();
    }
  }, [user, isAdmin]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const productsData = await response.json();
      setProducts(productsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData: Partial<Product> = {
      name: productForm.name,
      price: productForm.price,
      originalPrice: productForm.originalPrice || productForm.price,
      discount: productForm.originalPrice
        ? Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
        : 0,
      category: productForm.category,
      description: productForm.description,
      sizes: productForm.sizes ? productForm.sizes.split(",").map((s) => s.trim()).filter(s => s.length > 0) : [],
      colors: productForm.colors ? productForm.colors.split(",").map((c) => c.trim()).filter(c => c.length > 0) : undefined,
      stock: productForm.stock,
      isLimitedEdition: productForm.isLimitedEdition,
      quantity: productForm.quantity,
      brand: productForm.brand,
      tags: productForm.tags ? productForm.tags.split(",").map((t) => t.trim()) : undefined,
      image: productForm.image || "/placeholder.svg?height=400&width=400",
      images: productForm.images.length > 0 ? productForm.images : [productForm.image || "/placeholder.svg?height=400&width=400"],
      rating: 4.5,
      reviews: 0,
      isActive: true,
    }

    try {
      setUpdatingProduct(editingProduct || 'new');
      if (editingProduct) {
        // Update existing product in DB
        await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingProduct, ...productData }),
        });
        toast({
          title: "Product Updated",
          description: `${productData.name} has been updated successfully.`,
        });
      } else {
        // Add new product to DB
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        toast({
          title: "Product Added",
          description: `${productData.name} has been added successfully.`,
        });
      }
      setEditingProduct(null);
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
        isLimitedEdition: false,
        quantity: 0,
        brand: "",
        tags: "",
        image: "",
        images: [],
        isFeatured: false,
        overlaySettings: {
          showSizeSelector: true,
          showColorSelector: true,
          showAddToCart: true,
          defaultSize: 'M',
          defaultColor: '',
          buttonText: 'Add to Cart',
          buttonIcon: 'shopping-bag'
        }
      });
      loadProducts();
      setUpdatingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive"
      });
      setUpdatingProduct(null);
    }
  };

  // Reset product form and editing state
  function resetProductForm() {
    setEditingProduct(null);
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
      isLimitedEdition: false,
      quantity: 0,
      brand: "",
      tags: "",
      image: "",
      images: [],
      isFeatured: false,
      overlaySettings: {
        showSizeSelector: true,
        showColorSelector: true,
        showAddToCart: true,
        defaultSize: 'M',
        defaultColor: '',
        buttonText: 'Add to Cart',
        buttonIcon: 'shopping-bag'
      }
    });
  }

  const editProduct = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      category: product.category,
      description: product.description,
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      stock: product.stock,
      isLimitedEdition: product.isLimitedEdition || false,
      quantity: product.quantity || 0,
      brand: product.brand || "",
      tags: product.tags?.join(", ") || "",
      image: product.image,
      images: product.images || [product.image],
      isFeatured: product.isFeatured,
      overlaySettings: product.overlaySettings || {
        showSizeSelector: true,
        showColorSelector: true,
        showAddToCart: true,
        defaultSize: 'M',
        defaultColor: 'Default',
        buttonText: 'Add to Cart',
        buttonIcon: 'shopping-bag'
      }
    })
    setEditingProduct(product.id)
  }

  const handleDeleteProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId)
    const productName = product?.name || 'this product'
    
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingProduct(productId);
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: productId }),
      });
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product Deleted",
        description: `${productName} has been deleted successfully and removed from the website.`,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingProduct(null);
    }
  }

  const handleToggleFeatured = async (productId: string, isFeatured: boolean) => {
    const product = products.find(p => p.id === productId)
    const productName = product?.name || 'this product'
    const action = isFeatured ? 'remove from featured' : 'add to featured'
    
    if (!confirm(`Are you sure you want to ${action} "${productName}"?`)) {
      return
    }

    try {
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, isFeatured: !isFeatured } : p
      )
      setProducts(updatedProducts)
      
      // Save to file
      try {
        const response = await fetch('/api/save-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProducts),
        })
        
        if (!response.ok) {
          throw new Error('Failed to save products')
        }
        
        toast({
          title: isFeatured ? "Removed from Featured" : "Added to Featured",
          description: `${productName} featured status updated successfully and will be reflected on the website.`,
        })
      } catch (saveError) {
        console.error('Error saving products:', saveError)
        toast({
          title: "Warning",
          description: "Featured status updated locally but failed to save to file. Changes may not persist.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
      toast({
        title: "Error",
        description: "Failed to update featured status.",
        variant: "destructive"
      })
    }
  }

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

  // If not authenticated or not admin, show loading (will redirect)
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={loadProducts}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Products
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Product Management</h1>
        <p className="text-gray-600">Manage your products and their overlay settings</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Admin Capabilities:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Add Products:</strong> Create new products with full details and overlay settings</li>
            <li>• <strong>Edit Products:</strong> Update product information, pricing, and display settings</li>
            <li>• <strong>Delete Products:</strong> Remove products from the system (with confirmation)</li>
            <li>• <strong>Toggle Featured:</strong> Mark/unmark products as featured for homepage display</li>
            <li>• <strong>Overlay Settings:</strong> Control size/color selectors, add-to-cart buttons, and defaults</li>
            <li>• <strong>Auto-Sync:</strong> Changes are automatically saved to backend/local storage</li>
          </ul>
        </div>
      </div>

      {/* Product Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProductSubmit} className="space-y-6">
            {/* Basic Product Information */}
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
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <Input
                  type="number"
                  value={productForm.quantity}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={productForm.isLimitedEdition}
                  onCheckedChange={(checked) => setProductForm((prev) => ({ ...prev, isLimitedEdition: checked }))}
                />
                <label className="text-sm font-medium">Limited Edition</label>
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
            </div>

            {/* Image Upload */}
            <div className="border-2 border-blue-400 bg-blue-50 rounded-lg p-4">
              <label className="block text-base font-semibold mb-2 text-blue-900">Upload Images</label>
              <MultiImageUpload
                initialImages={productForm.images || []}
                onImageChange={(images, primaryImage) => {
                  setProductForm((prev) => ({ ...prev, images, image: primaryImage }))
                }}
              />
            </div>

            {/* Description and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <Input
                  value={productForm.tags}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="oversized, premium, cotton"
                />
              </div>
            </div>

            {/* Featured Product Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={productForm.isFeatured}
                onCheckedChange={(checked) => setProductForm((prev) => ({ ...prev, isFeatured: checked }))}
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured Product (appears on homepage)
              </label>
            </div>

            {/* Overlay Settings Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="overlay-settings"
                checked={showOverlaySettings}
                onCheckedChange={setShowOverlaySettings}
              />
              <label htmlFor="overlay-settings" className="text-sm font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configure Product Overlay Settings
              </label>
            </div>

            {/* Overlay Settings Panel */}
            {showOverlaySettings && (
              <div className="border-2 border-gray-200 bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-lg">Product Overlay Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-size-selector"
                      checked={productForm.overlaySettings.showSizeSelector}
                      onCheckedChange={(checked) => setProductForm((prev) => ({ 
                        ...prev, 
                        overlaySettings: { ...prev.overlaySettings, showSizeSelector: checked }
                      }))}
                    />
                    <label htmlFor="show-size-selector" className="text-sm font-medium">
                      Show Size Selector
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-color-selector"
                      checked={productForm.overlaySettings.showColorSelector}
                      onCheckedChange={(checked) => setProductForm((prev) => ({ 
                        ...prev, 
                        overlaySettings: { ...prev.overlaySettings, showColorSelector: checked }
                      }))}
                    />
                    <label htmlFor="show-color-selector" className="text-sm font-medium">
                      Show Color Selector
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-add-to-cart"
                      checked={productForm.overlaySettings.showAddToCart}
                      onCheckedChange={(checked) => setProductForm((prev) => ({ 
                        ...prev, 
                        overlaySettings: { ...prev.overlaySettings, showAddToCart: checked }
                      }))}
                    />
                    <label htmlFor="show-add-to-cart" className="text-sm font-medium">
                      Show Add to Cart Button
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Default Size</label>
                    <Input
                      value={productForm.overlaySettings.defaultSize}
                      onChange={(e) => setProductForm((prev) => ({ 
                        ...prev, 
                        overlaySettings: { ...prev.overlaySettings, defaultSize: e.target.value }
                      }))}
                      placeholder="M"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Default Color</label>
                    <Input
                      value={productForm.overlaySettings.defaultColor}
                      onChange={(e) => setProductForm((prev) => ({ 
                        ...prev, 
                        overlaySettings: { ...prev.overlaySettings, defaultColor: e.target.value }
                      }))}
                      placeholder="Default"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Button Text</label>
                    <Input
                      value={productForm.overlaySettings.buttonText}
                      onChange={(e) => setProductForm((prev) => ({ 
                        ...prev, 
                        overlaySettings: { ...prev.overlaySettings, buttonText: e.target.value }
                      }))}
                      placeholder="Add to Cart"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Button Icon</label>
                    <Select
                      value={productForm.overlaySettings.buttonIcon}
                      onValueChange={(value) => setProductForm((prev) => ({ 
                        ...prev, 
                        overlaySettings: { ...prev.overlaySettings, buttonIcon: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shopping-bag">Shopping Bag</SelectItem>
                        <SelectItem value="ruler">Ruler</SelectItem>
                        <SelectItem value="palette">Palette</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={!!updatingProduct}>
                {updatingProduct ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingProduct ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingProduct ? "Update Product" : "Add Product"
                )}
              </Button>
              {editingProduct && (
                <Button type="button" variant="outline" onClick={resetProductForm} disabled={!!updatingProduct}>
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
              <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm sm:text-base">{product.name}</h3>
                    {product.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {product.category} • {product.brand}
                  </p>
                  <p className="text-xs sm:text-sm">
                    ₹{product.price} • Stock: {product.stock}
                  </p>
                  {product.overlaySettings && (
                    <div className="flex gap-1 mt-1">
                      {product.overlaySettings.showSizeSelector && (
                        <Badge variant="outline" className="text-xs">Size</Badge>
                      )}
                      {product.overlaySettings.showColorSelector && (
                        <Badge variant="outline" className="text-xs">Color</Badge>
                      )}
                      {product.overlaySettings.showAddToCart && (
                        <Badge variant="outline" className="text-xs">Cart</Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                    disabled={!!deletingProduct || !!updatingProduct}
                  >
                    {product.isFeatured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => editProduct(product)}
                    disabled={!!deletingProduct || !!updatingProduct}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={!!deletingProduct || !!updatingProduct}
                  >
                    {deletingProduct === product.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 