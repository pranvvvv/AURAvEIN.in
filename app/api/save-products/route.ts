import { NextRequest, NextResponse } from "next/server"
import { writeProductsToFile } from "@/lib/server-data"
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    // Only allow writing products from admin and only allow in non-production environments
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
    }
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value || null
    const payload: any = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const products = await req.json()
    
    // Save products to file
    writeProductsToFile(products)
    
    return NextResponse.json({ 
      success: true, 
      message: "Products saved successfully",
      count: products.length 
    })
  } catch (error) {
    console.error('Error saving products:', error)
    return NextResponse.json(
      { error: "Failed to save products" },
      { status: 500 }
    )
  }
} 