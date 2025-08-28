import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { products as fallbackProducts } from '@/lib/data'
import { readProductsFromFile, writeProductsToFile } from '@/lib/server-data'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

// GET products
export async function GET() {
  try {
    try {
      await dbConnect();
      const products = await Product.find({});
      // If DB returned nothing, check the local fallback file (dev fallback)
      if (!Array.isArray(products) || products.length === 0) {
        try {
          const fileProducts = readProductsFromFile() || []
          if (Array.isArray(fileProducts) && fileProducts.length > 0) {
            return NextResponse.json(fileProducts)
          }
        } catch (fileErr) {
          // ignore and fallback to bundled data
        }
      }
      return NextResponse.json(products);
    } catch (dbError: any) {
      // If database is unreachable (Atlas TLS / network errors), return fallback data from file or bundled data
      console.warn('Products DB fetch failed, serving fallback products:', dbError?.message || dbError);
      try {
        const fileProducts = readProductsFromFile() || []
        if (Array.isArray(fileProducts) && fileProducts.length > 0) return NextResponse.json(fileProducts)
      } catch (fileErr) {
        // ignore
      }
      return NextResponse.json(fallbackProducts || []);
    }
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to fetch products", details: e.message }, { status: 500 });
  }
}

// POST product
export async function POST(req: NextRequest) {
  // parse body once so it can be reused on DB failure
  let data: any = null
  try {
    data = await req.json()
  } catch (e) {
    data = null
  }

  try {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value || null
  const payload: any = verifyToken(token || '')
  if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await dbConnect();
    const product = await Product.create(data || {})
    return NextResponse.json(product)
  } catch (e: any) {
    // If DB operation fails, only persist to local server file in non-production (safe fallback)
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.warn('Product create failed, writing to products file fallback (dev only):', e?.message || e)
        const existing = readProductsFromFile() || []
        const newProduct = { id: Date.now().toString(), ...(data || {}) }
        const merged = Array.isArray(existing) ? [...existing, newProduct] : [newProduct]
        writeProductsToFile(merged)
        return NextResponse.json(newProduct, { status: 201 })
      } catch (fileErr: any) {
        return NextResponse.json({ error: "Failed to add product", details: e.message, fileError: fileErr?.message || fileErr }, { status: 500 })
      }
    }
    return NextResponse.json({ error: 'Database error', details: e?.message || String(e) }, { status: 500 })
  }
}

// PUT product
export async function PUT(req: NextRequest) {
  // parse once
  let data: any = null
  try {
    data = await req.json()
  } catch (e) {
    data = null
  }

  try {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value || null
  const payload: any = verifyToken(token || '')
  if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await dbConnect();
    const { _id, ...update } = data || {}
    await Product.findByIdAndUpdate(_id, update)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.warn('Product update failed, updating products file fallback (dev only):', e?.message || e)
        const existing = readProductsFromFile() || []
        const { _id, ...update } = data || {}
        const updated = (existing || []).map((p: any) => p.id === _id ? { ...p, ...update } : p)
        writeProductsToFile(updated)
        return NextResponse.json({ success: true })
      } catch (fileErr: any) {
        return NextResponse.json({ error: "Failed to update product", details: e.message, fileError: fileErr?.message || fileErr }, { status: 500 })
      }
    }
    return NextResponse.json({ error: 'Database error', details: e?.message || String(e) }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  // parse once
  let body: any = null
  try {
    body = await req.json()
  } catch (e) {
    body = null
  }

  try {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value || null
  const payload: any = verifyToken(token || '')
  if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await dbConnect();
    const { _id } = body || {}
    await Product.findByIdAndDelete(_id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.warn('Product delete failed, updating products file fallback (dev only):', e?.message || e)
        const { _id } = body || {}
        const existing = readProductsFromFile() || []
        const updated = (existing || []).map((p: any) => p.id === _id ? { ...p, isActive: false } : p)
        writeProductsToFile(updated)
        return NextResponse.json({ success: true })
      } catch (fileErr: any) {
        return NextResponse.json({ error: "Failed to delete product", details: e.message, fileError: fileErr?.message || fileErr }, { status: 500 })
      }
    }
    return NextResponse.json({ error: 'Database error', details: e?.message || String(e) }, { status: 500 })
  }
}