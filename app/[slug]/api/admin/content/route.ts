import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyOwnerToken } from '@/lib/auth'

const CONTENT_KEYS = ['heroLine1', 'heroLine2', 'heroCopy', 'heroImage', 'aboutCopy1', 'aboutCopy2', 'studioLocation', 'studioPhone', 'studioIg', 'studioHours']

async function getSalonId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bookdesk_owner')?.value
  const owner = token ? verifyOwnerToken(token) : null
  return owner?.salonId ?? null
}

export async function GET() {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await prisma.setting.findMany({ where: { salonId, key: { in: CONTENT_KEYS } } })
  return NextResponse.json(Object.fromEntries(rows.map(r => [r.key, r.value])))
}

export async function PATCH(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  for (const [key, value] of Object.entries(body)) {
    if (!CONTENT_KEYS.includes(key)) continue
    await prisma.setting.upsert({
      where: { salonId_key: { salonId, key } },
      update: { value: String(value) },
      create: { salonId, key, value: String(value) },
    })
  }
  return NextResponse.json({ ok: true })
}
