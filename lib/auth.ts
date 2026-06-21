import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'polished-by-raizy-jwt-secret'

export function signToken() {
  return jwt.sign({ admin: true }, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, SECRET)
    return true
  } catch {
    return false
  }
}
