import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSalonBySlug } from '@/lib/tenant'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const salon = await getSalonBySlug(slug)
    if (!salon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const { question } = await req.json()
    if (!question) return NextResponse.json({ error: 'Missing question' }, { status: 400 })
    await prisma.faqItem.create({ data: { salonId: salon.id, question, published: false, source: 'visitor' } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
