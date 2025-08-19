"use client"

import { useState, useEffect } from "react"
import { getProductsFromDataFile } from "@/lib/firebaseService"

export default function TestDataPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const dataProducts = await getProductsFromDataFile()
        setProducts(dataProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return <div className="p-8">Loading products from data.ts...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products from data.ts</h1>
      <p className="mb-4">Total products: {products.length}</p>
      
      <div className="grid gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Category: {product.category}</p>
            <p>Featured: {product.isFeatured ? 'Yes' : 'No'}</p>
            <p>Images: {product.images?.length || 0}</p>
            {product.images && product.images.length > 0 && (
              <div className="mt-2">
                <p>Image URLs:</p>
                <ul className="text-sm text-gray-600">
                  {product.images.map((img: string, index: number) => (
                    <li key={index}>{img}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 