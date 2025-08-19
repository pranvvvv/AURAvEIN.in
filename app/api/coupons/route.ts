

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const couponsFilePath = path.join(process.cwd(), "lib", "coupons.json");

function readCouponsFromFile() {
  if (!fs.existsSync(couponsFilePath)) return [];
  return JSON.parse(fs.readFileSync(couponsFilePath, "utf8"));
}

function writeCouponsToFile(coupons: any[]) {
  fs.writeFileSync(couponsFilePath, JSON.stringify(coupons, null, 2), "utf8");
}

export async function GET() {
  try {
    return NextResponse.json(readCouponsFromFile());
  } catch (e: any) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const coupons = readCouponsFromFile();
    // If code is provided by admin, use it; otherwise, generate one
    let code = data.code;
    if (!code || typeof code !== "string" || !code.trim()) {
      // Generate a random code, e.g., "AURA-" + 6 uppercase letters/digits
      code = "AURA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    const newCoupon = { ...data, code, id: Date.now().toString() };
    const updatedCoupons = [...coupons, newCoupon];
    writeCouponsToFile(updatedCoupons);
    return NextResponse.json(newCoupon);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to add coupon", details: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...update } = data;
    const coupons = readCouponsFromFile();
    const updatedCoupons = coupons.map((c: any) => c.id === id ? { ...c, ...update } : c);
    writeCouponsToFile(updatedCoupons);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to update coupon", details: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const coupons = readCouponsFromFile();
    const updatedCoupons = coupons.filter((c: any) => c.id !== id);
    writeCouponsToFile(updatedCoupons);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to delete coupon", details: e.message }, { status: 500 });
  }
}