import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/lib/productModel";

// GET products
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to fetch products", details: e.message }, { status: 500 });
  }
}

// POST product
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const product = await Product.create(data);
    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to add product", details: e.message }, { status: 500 });
  }
}

// PUT product
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { _id, ...update } = data;
    await Product.findByIdAndUpdate(_id, update);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to update product", details: e.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { _id } = await req.json();
    await Product.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to delete product", details: e.message }, { status: 500 });
  }
}