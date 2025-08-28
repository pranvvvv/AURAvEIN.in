import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import User from '@/lib/models/User'
import { dbConnect } from '@/lib/mongodb'

export async function GET(req: Request) {
  const cookies = (req as any).cookies || {}
  // In app router, cookies are not directly available on Request; fallback to NextResponse.rewrite if needed
  const token = cookies['token'] || null
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const payload: any = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  await dbConnect()
  const user = await User.findById(payload.id).select('-password')
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json(user)
}
