import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { dbConnect } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body || {}
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    await dbConnect()
    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    if (user.role !== 'admin' && !user.isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role })
    const res = NextResponse.json({ id: user._id, name: user.name, email: user.email, role: user.role })
    // Set httpOnly token cookie
    res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Login failed' }, { status: 500 })
  }
}
