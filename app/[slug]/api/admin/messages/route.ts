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
  const messages = await prisma.contactMessage.findMany({ where: { salonId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(messages)
}

export async function PATCH(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, read } = await req.json()
  const existing = await prisma.contactMessage.findFirst({ where: { id, salonId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const msg = await prisma.contactMessage.update({ where: { id }, data: { read } })
  return NextResponse.json(msg)
}
