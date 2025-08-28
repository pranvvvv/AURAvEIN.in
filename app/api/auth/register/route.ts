import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { dbConnect } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password, role } = body
  if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  try {
    await dbConnect()
    const existing = await User.findOne({ email })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, role: role === 'admin' ? 'admin' : 'user' })
    const token = signToken({ id: user._id, email: user.email, role: user.role })
    const res = NextResponse.json({ id: user._id, name: user.name, email: user.email, role: user.role }, { status: 201 })
    res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`)
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
