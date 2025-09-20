import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { action, coupon, couponId } = await req.json();
    
    // Read current coupons from coupons-data.ts
    const couponsFilePath = path.join(process.cwd(), "lib", "coupons-data.ts");
    let currentCoupons = [];
    
    try {
      const fileContent = fs.readFileSync(couponsFilePath, "utf8");
      // Extract the coupons array from the file content
      const match = fileContent.match(/export const coupons = (\[[\s\S]*\]);/);
      if (match) {
        currentCoupons = JSON.parse(match[1]);
      }
    } catch (error) {
      console.log("coupons-data.ts not found or empty, starting fresh");
    }

    let updatedCoupons = [...currentCoupons];

    switch (action) {
      case "add":
        const newCoupon = {
          id: Date.now().toString(),
          ...coupon,
          createdAt: new Date().toISOString(),
          isActive: true
        };
        updatedCoupons.push(newCoupon);
        break;
        
      case "update":
        updatedCoupons = updatedCoupons.map(c => 
          c.id === couponId ? { ...c, ...coupon, updatedAt: new Date().toISOString() } : c
        );
        break;
        
      case "delete":
        updatedCoupons = updatedCoupons.filter(c => c.id !== couponId);
        break;
        
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Write updated coupons back to file
    const content = `export const coupons = ${JSON.stringify(updatedCoupons, null, 2)};\n`;
    fs.writeFileSync(couponsFilePath, content, "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating coupons-data.ts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 