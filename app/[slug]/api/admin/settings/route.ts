import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyOwnerToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const PUBLIC_KEYS = ['depositAmount', 'stripePublishableKey', 'stripeSecretKey', 'resendApiKey', 'notificationEmail', 'gcalClientId', 'gcalClientSecret', 'gcalCalendarId', 'gcalAccessToken', 'gcalRefreshToken']

async function getOwner() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bookdesk_owner')?.value
  return token ? verifyOwnerToken(token) : null
}

export async function GET() {
  const owner = await getOwner()
  if (!owner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await prisma.setting.findMany({ where: { salonId: owner.salonId, key: { in: PUBLIC_KEYS } } })
  return NextResponse.json(Object.fromEntries(rows.map(r => [r.key, r.value])))
}

export async function POST(req: NextRequest) {
  const owner = await getOwner()
  if (!owner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()

  if (body.newPassword) {
    const salon = await prisma.salon.findUnique({ where: { id: owner.salonId } })
    if (!salon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (body.currentPassword) {
      const valid = await bcrypt.compare(body.currentPassword, salon.ownerPasswordHash)
      if (!valid) return NextResponse.json({ error: 'Current password incorrect' }, { status: 401 })
    }
    const hash = await bcrypt.hash(body.newPassword, 12)
    await prisma.salon.update({ where: { id: owner.salonId }, data: { ownerPasswordHash: hash } })
  }

  for (const [key, value] of Object.entries(body)) {
    if (!PUBLIC_KEYS.includes(key)) continue
    await prisma.setting.upsert({
      where: { salonId_key: { salonId: owner.salonId, key } },
      update: { value: String(value) },
      create: { salonId: owner.salonId, key, value: String(value) },
    })
  }
  return NextResponse.json({ ok: true })
}
