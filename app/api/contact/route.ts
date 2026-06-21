import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json()
    if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await prisma.contactMessage.create({ data: { name, phone: phone || null, email, message } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
