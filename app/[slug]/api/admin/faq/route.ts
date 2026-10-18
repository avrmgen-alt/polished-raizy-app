import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyOwnerToken } from '@/lib/auth'

async function getSalonId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bookdesk_owner')?.value
  const owner = token ? verifyOwnerToken(token) : null
  return owner?.salonId ?? null
}

export async function GET() {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items = await prisma.faqItem.findMany({ where: { salonId }, orderBy: { order: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const item = await prisma.faqItem.create({ data: { salonId, ...data } })
  return NextResponse.json(item)
}

export async function PATCH(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await req.json()
  const existing = await prisma.faqItem.findFirst({ where: { id, salonId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const item = await prisma.faqItem.update({ where: { id }, data })
  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const existing = await prisma.faqItem.findFirst({ where: { id, salonId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.faqItem.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
