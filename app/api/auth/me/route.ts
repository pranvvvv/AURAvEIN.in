import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import User from '@/lib/models/User'
// ...mongodb code removed

export async function GET(req: Request) {
  // Backend removed, always return not authenticated
  return NextResponse.json({ error: 'Backend removed. User unavailable.' }, { status: 501 });
}
