import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { dbConnect } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = body
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  try {
    await dbConnect()
    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const token = signToken({ id: user._id, email: user.email, role: user.role })
    const res = NextResponse.json({ id: user._id, name: user.name, email: user.email, role: user.role })
    res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`)
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
