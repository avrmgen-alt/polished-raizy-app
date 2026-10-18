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
  const bookings = await prisma.booking.findMany({ where: { salonId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(bookings)
}

export async function PATCH(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  const booking = await prisma.booking.findFirst({ where: { id, salonId } })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const updated = await prisma.booking.update({ where: { id }, data: { status } })
  return NextResponse.json(updated)
}
