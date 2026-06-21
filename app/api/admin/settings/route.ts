import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const rows = await prisma.setting.findMany()
  const safe = rows.filter(r => r.key !== 'adminPasswordHash')
  return NextResponse.json(Object.fromEntries(safe.map(r => [r.key, r.value])))
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  // Special case: changing password
  if (body.newPassword) {
    const hash = await bcrypt.hash(body.newPassword, 12)
    await prisma.setting.upsert({ where: { key: 'adminPasswordHash' }, update: { value: hash }, create: { key: 'adminPasswordHash', value: hash } })
    return NextResponse.json({ ok: true })
  }
  // Regular settings update
  for (const [key, value] of Object.entries(body)) {
    if (key === 'adminPasswordHash') continue // never allow direct hash overwrite
    await prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })
  }
  return NextResponse.json({ ok: true })
}
