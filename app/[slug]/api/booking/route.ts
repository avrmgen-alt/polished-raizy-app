import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSalonBySlug } from '@/lib/tenant'
import { getSetting } from '@/lib/settings'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const salon = await getSalonBySlug(slug)
    if (!salon) return NextResponse.json({ error: 'Salon not found' }, { status: 404 })

    const body = await req.json()
    const { serviceId, serviceName, addons, date, time, name, phone, email, notes, depositCents } = body
    if (!serviceId || !date || !time || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const depositAmount = depositCents ?? parseInt(await getSetting(salon.id, 'depositAmount') || '1000')

    const booking = await prisma.booking.create({
      data: {
        salonId: salon.id,
        serviceId,
        serviceName,
        addons: JSON.stringify(addons || []),
        date,
        time,
        name,
        phone: phone || '',
        email,
        notes: notes || null,
        depositPaid: depositAmount,
        status: 'pending',
      },
    })
    return NextResponse.json({ ok: true, bookingId: booking.id })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
