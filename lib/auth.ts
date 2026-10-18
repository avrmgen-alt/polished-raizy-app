import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'bookdesk-jwt-secret-change-in-production'

export interface OwnerPayload {
  salonId: string
  slug: string
  email: string
}

export function signOwnerToken(payload: OwnerPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyOwnerToken(token: string): OwnerPayload | null {
  try {
    return jwt.verify(token, SECRET) as OwnerPayload
  } catch {
    return null
  }
}

// Legacy single-tenant helpers (kept for backward compat during migration)
export function signToken() {
  return jwt.sign({ admin: true }, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): boolean {
  return verifyOwnerToken(token) !== null
}
