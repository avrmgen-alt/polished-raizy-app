import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getSettings, setSetting } from '@/lib/settings'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/admin/settings?error=gcal_denied', req.url))

  const s = await getSettings(['gcalClientId', 'gcalClientSecret'])
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const oauth2 = new google.auth.OAuth2(s.gcalClientId, s.gcalClientSecret, `${appUrl}/api/admin/gcal/callback`)

  const { tokens } = await oauth2.getToken(code)
  await setSetting('gcalAccessToken', tokens.access_token || '')
  await setSetting('gcalRefreshToken', tokens.refresh_token || '')

  return NextResponse.redirect(new URL('/admin/settings?gcal=connected', req.url))
}
