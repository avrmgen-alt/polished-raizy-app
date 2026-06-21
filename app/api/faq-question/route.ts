import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, question } = await req.json()
    if (!question) return NextResponse.json({ error: 'Missing question' }, { status: 400 })
    await prisma.faqItem.create({
      data: {
        question,
        answer: null,
        published: false,
        source: 'customer',
        order: 999,
      },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
