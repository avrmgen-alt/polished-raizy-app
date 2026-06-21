import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCalendarEvent } from '@/lib/gcal'

export async function GET() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(bookings)
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const booking = await prisma.booking.update({ where: { id }, data: { status } })

  // When confirmed, create a Google Calendar event
  if (status === 'confirmed') {
    try {
      await createCalendarEvent(booking)
    } catch (e) {
      console.error('Google Calendar event creation failed:', e)
    }
  }

  return NextResponse.json({ ok: true })
}
