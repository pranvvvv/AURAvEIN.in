import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const couponsFilePath = path.join(process.cwd(), "lib", "coupons.json");

function readCouponsFromFile() {
  if (!fs.existsSync(couponsFilePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(couponsFilePath, "utf8"));
  } catch (error) {
    return [];
  }
}

function writeCouponsToFile(coupons: any[]) {
  fs.writeFileSync(couponsFilePath, JSON.stringify(coupons, null, 2), "utf8");
}

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();
    
    if (!code || !cartTotal) {
      return NextResponse.json(
        { valid: false, message: "Invalid request parameters" },
        { status: 400 }
      );
    }

    const coupons = readCouponsFromFile();
    const coupon = coupons.find((c: any) => 
      c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        message: "Invalid coupon code"
      });
    }

    // Check if coupon is expired
    if (coupon.expiryDate) {
      const expiryDate = new Date(coupon.expiryDate);
      const currentDate = new Date();
      if (currentDate > expiryDate) {
        return NextResponse.json({
          valid: false,
          message: "Coupon has expired"
        });
      }
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`
      });
    }

    // Check usage limit
    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
      return NextResponse.json({
        valid: false,
        message: "Coupon usage limit exceeded"
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      // Apply max discount limit if set
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;

    return NextResponse.json({
      valid: true,
      message: "Coupon applied successfully!",
      coupon: {
        ...coupon,
        discountAmount
      }
    });

  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { valid: false, message: "Error validating coupon" },
      { status: 500 }
    );
  }
}

// API endpoint to mark coupon as used
export async function PUT(req: NextRequest) {
  try {
    const { code } = await req.json();
    
    const coupons = readCouponsFromFile();
    const updatedCoupons = coupons.map((c: any) => {
      if (c.code.toUpperCase() === code.toUpperCase()) {
        return {
          ...c,
          usedCount: (c.usedCount || 0) + 1,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    writeCouponsToFile(updatedCoupons);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating coupon usage:", error);
    return NextResponse.json(
      { error: "Failed to update coupon usage" },
      { status: 500 }
    );
  }
}