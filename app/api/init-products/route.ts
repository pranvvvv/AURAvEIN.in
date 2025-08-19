import { NextResponse } from "next/server"
import { initializeProductsFile } from "@/lib/server-data"
import { products as initialProducts } from "@/lib/data"

export async function POST() {
  try {
    // Initialize the products file with initial data
    initializeProductsFile(initialProducts)
    
    return NextResponse.json({ 
      success: true, 
      message: "Products file initialized successfully"
    })
  } catch (error) {
    console.error('Error initializing products file:', error)
    return NextResponse.json(
      { error: "Failed to initialize products file" },
      { status: 500 }
    )
  }
} 