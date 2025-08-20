"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getCategories } from "@/lib/firebaseService"

interface Category {
  id: string
  name: string
  subtitle: string
  image: string
  href: string
  order: number
  isActive: boolean
  createdAt: Date
}

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const categoriesData = await getCategories()
        setCategories(categoriesData as Category[])
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading categories:', err)
        setError('Failed to load categories')
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-gray-200"></div>
                <div className="p-3 md:p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || categories.length === 0) {
    return null // Don't show anything if there are no categories or error
  }

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={200}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 md:p-4 text-center">
                <h3 className="font-semibold text-base md:text-lg mb-1">{category.name}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
