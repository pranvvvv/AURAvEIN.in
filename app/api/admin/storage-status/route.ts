import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { readProductsFromFile } from '@/lib/server-data'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    // Allow quick unauthenticated checks in development or when explicitly requested
    const allowPublic = process.env.NODE_ENV !== 'production' || req.nextUrl.searchParams.get('public') === '1'

    let payload: any = null
    if (!allowPublic) {
      const cookieStore = cookies()
      const token = cookieStore.get('token')?.value || null
      payload = verifyToken(token || '')
      if (!payload) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result: any = {
      mongodbUri: !!process.env.MONGODB_URI,
      dbConnected: false,
      storage: 'file',
      productCount: null,
      productsFileInfo: null,
    }

    // Try DB connection and light read
    if (process.env.MONGODB_URI) {
      try {
        await dbConnect()
        // count documents to verify read access
        const count = await Product.countDocuments({})
        result.dbConnected = true
        result.storage = 'mongodb'
        result.productCount = typeof count === 'number' ? count : null
      } catch (dbErr: any) {
        // DB connection/read failed — stay with file fallback
        result.dbConnected = false
        result.dbError = dbErr?.message || String(dbErr)
      }
    }

    // Add local products file info (exists, mtime, size)
    try {
      const fs = await import('fs')
      const path = await import('path')
      const productsFilePath = path.join(process.cwd(), 'lib', 'products-data.json')
      if (fs.existsSync(productsFilePath)) {
        const stats = fs.statSync(productsFilePath)
        result.productsFileInfo = { exists: true, mtime: stats.mtime.toISOString(), size: stats.size }
        // read few items to show fallback presence without altering anything
        const fileData = readProductsFromFile() || []
        result.fallbackCount = Array.isArray(fileData) ? fileData.length : null
      } else {
        result.productsFileInfo = { exists: false }
        result.fallbackCount = 0
      }
    } catch (fileErr: any) {
      result.productsFileInfo = { error: fileErr?.message || String(fileErr) }
    }

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to check storage status', details: e?.message || String(e) }, { status: 500 })
  }
}
