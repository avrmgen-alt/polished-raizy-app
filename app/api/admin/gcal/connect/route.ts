import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getSettings } from '@/lib/settings'

export async function GET(req: NextRequest) {
  const s = await getSettings(['gcalClientId', 'gcalClientSecret'])
  if (!s.gcalClientId || !s.gcalClientSecret) {
    return NextResponse.redirect(new URL('/admin/settings?error=gcal_not_configured', req.url))
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const oauth2 = new google.auth.OAuth2(s.gcalClientId, s.gcalClientSecret, `${appUrl}/api/admin/gcal/callback`)
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    prompt: 'consent',
  })
  return NextResponse.redirect(url)
}
