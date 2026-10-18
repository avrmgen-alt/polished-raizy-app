import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { google } from 'googleapis'
import { getSettings } from '@/lib/settings'
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
  const owner = await getOwner()
  const { slug } = await params
  if (!owner) return NextResponse.redirect(new URL(`/${slug}/admin/login`, req.url))

  const s = await getSettings(owner.salonId, ['gcalClientId', 'gcalClientSecret'])
  if (!s.gcalClientId || !s.gcalClientSecret) {
    return NextResponse.redirect(new URL(`/${slug}/admin/settings?error=gcal_not_configured`, req.url))
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const oauth2 = new google.auth.OAuth2(
    s.gcalClientId,
    s.gcalClientSecret,
    `${appUrl}/${slug}/api/admin/gcal/callback`
  )
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    prompt: 'consent',
  })
  return NextResponse.redirect(url)
}
