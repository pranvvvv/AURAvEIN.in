import { NextResponse } from "next/server"
import { readProductsFromFile } from "@/lib/server-data"

export async function GET() {
  try {
    const products = readProductsFromFile()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error reading products:', error)
    return NextResponse.json(
      { error: "Failed to read products" },
      { status: 500 }
    )
  }
} 