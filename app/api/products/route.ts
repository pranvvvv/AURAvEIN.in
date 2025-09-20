
import { NextRequest, NextResponse } from "next/server";
import productsData from "@/lib/products-data.json";

// GET products
export async function GET() {
  // Return static products from products-data.json
  return NextResponse.json(productsData);
}

// POST product
export async function POST(req: NextRequest) {
  // Backend removed, return posted data
  let data: any = null;
  try {
    data = await req.json();
  } catch (e) {
    data = null;
  }
  return NextResponse.json(data || {});
}

// PUT product
export async function PUT(req: NextRequest) {
  // Backend removed, return success
  return NextResponse.json({ success: true });
}

// DELETE product
export async function DELETE(req: NextRequest) {
  // Backend removed, return success
  return NextResponse.json({ success: true });
}