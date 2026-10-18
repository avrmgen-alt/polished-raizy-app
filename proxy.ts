import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyOwnerToken } from './lib/auth'

// Matches /<slug>/admin/<anything> but not /<slug>/admin/login
const ADMIN_PATTERN = /^\/([^/]+)\/admin(\/(?!login).*)?$/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const match = pathname.match(ADMIN_PATTERN)
  if (match) {
    const slug = match[1]
    // Skip platform routes that aren't salons
    if (['signup', 'login', 'api'].includes(slug)) return NextResponse.next()

    const token = request.cookies.get('bookdesk_owner')?.value
    const payload = token ? verifyOwnerToken(token) : null

    if (!payload || payload.slug !== slug) {
      return NextResponse.redirect(new URL(`/${slug}/admin/login`, request.url))
    }

    // Subscription status checked in admin layout (requires DB lookup)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:slug/admin/:path*'],
}
