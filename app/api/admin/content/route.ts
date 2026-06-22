import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CONTENT_KEYS = ['heroLine1', 'heroLine2', 'heroCopy', 'heroImage', 'aboutCopy1', 'aboutCopy2', 'studioLocation', 'studioPhone', 'studioIg', 'studioHours']

export async function GET() {
  const rows = await prisma.setting.findMany({ where: { key: { in: CONTENT_KEYS } } })
  return NextResponse.json(Object.fromEntries(rows.map(r => [r.key, r.value])))
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  for (const [key, value] of Object.entries(body)) {
    if (!CONTENT_KEYS.includes(key)) continue
    await prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })
  }
  return NextResponse.json({ ok: true })
}
