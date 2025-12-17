import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
    expires: new Date(0),
  });
  return response;
}
