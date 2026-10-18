import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSalonBySlug } from '@/lib/tenant'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const salon = await getSalonBySlug(slug)
    if (!salon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const { name, phone, email, message } = await req.json()
    if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await prisma.contactMessage.create({ data: { salonId: salon.id, name, phone: phone || null, email, message } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
