import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serviceId, serviceName, addons, date, time, name, phone, email, notes, depositCents } = body
    if (!serviceId || !date || !time || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        serviceName,
        addons: JSON.stringify(addons || []),
        date,
        time,
        name,
        phone: phone || '',
        email,
        notes: notes || null,
        depositPaid: depositCents || 0,
        status: 'pending',
      },
    })
    return NextResponse.json({ ok: true, bookingId: booking.id })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
