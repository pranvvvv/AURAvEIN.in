import jwt from 'jsonwebtoken'
import { NextApiResponse } from 'next'

const JWT_SECRET = process.env.JWT_SECRET || 'please_set_a_real_secret'
const COOKIE_NAME = 'token'

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

function buildCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
  return `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax; ${secure}`
}

export function setTokenCookie(res: NextApiResponse, token: string) {
  const cookie = buildCookie(COOKIE_NAME, token, 7 * 24 * 60 * 60)
  res.setHeader('Set-Cookie', cookie)
}

export function clearTokenCookie(res: NextApiResponse) {
  const cookie = buildCookie(COOKIE_NAME, '', 0)
  res.setHeader('Set-Cookie', cookie)
}
