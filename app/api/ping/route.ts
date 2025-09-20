import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ status: "ok" });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to connect to MongoDB", details: e.message, status: "MongoDB connection failed" }, { status: 500 });
  }
}