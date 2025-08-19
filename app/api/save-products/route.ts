import { NextRequest, NextResponse } from "next/server"
import { writeProductsToFile } from "@/lib/server-data"

export async function POST(req: NextRequest) {
  try {
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