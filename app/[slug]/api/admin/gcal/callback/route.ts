import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { google } from 'googleapis'
import { getSettings, setSetting } from '@/lib/settings'
import { verifyOwnerToken } from '@/lib/auth'

async function getOwner() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bookdesk_owner')?.value
  return token ? verifyOwnerToken(token) : null
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const owner = await getOwner()
  if (!owner) return NextResponse.redirect(new URL(`/${slug}/admin/login`, req.url))

  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL(`/${slug}/admin/settings?error=gcal_denied`, req.url))

  const s = await getSettings(owner.salonId, ['gcalClientId', 'gcalClientSecret'])
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const oauth2 = new google.auth.OAuth2(
    s.gcalClientId,
    s.gcalClientSecret,
    `${appUrl}/${slug}/api/admin/gcal/callback`
  )

  const { tokens } = await oauth2.getToken(code)
  await setSetting(owner.salonId, 'gcalAccessToken', tokens.access_token || '')
  await setSetting(owner.salonId, 'gcalRefreshToken', tokens.refresh_token || '')

  return NextResponse.redirect(new URL(`/${slug}/admin/settings?gcal=connected`, req.url))
}
