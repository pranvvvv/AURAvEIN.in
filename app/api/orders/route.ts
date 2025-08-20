import { NextRequest, NextResponse } from "next/server";

// TODO: Implement real MongoDB logic if needed
export async function GET() {
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ insertedId: "mock" });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ success: true });
}