import { NextRequest, NextResponse } from "next/server";

// GET users
export async function GET() {
  // Backend removed, return empty array
  return NextResponse.json([]);
}

// POST user
export async function POST(req: NextRequest) {
  // Backend removed, return success
  return NextResponse.json({ insertedId: "static-id" });
}

// PUT user
export async function PUT(req: NextRequest) {
  // Backend removed, return success
  return NextResponse.json({ success: true });
}

// DELETE user
export async function DELETE(req: NextRequest) {
  // Backend removed, return success
  return NextResponse.json({ success: true });
}