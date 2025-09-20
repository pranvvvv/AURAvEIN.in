import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
// ...mongodb code removed
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  // Backend removed, always return error for register
  return NextResponse.json({ error: 'Backend removed. Registration unavailable.' }, { status: 501 });
}
