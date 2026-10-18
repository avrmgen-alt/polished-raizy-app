import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSalonBySlug } from '@/lib/tenant'
import { signOwnerToken } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { email, password } = await req.json()
    const salon = await getSalonBySlug(slug)
    if (!salon) return NextResponse.json({ error: 'Salon not found' }, { status: 404 })
    if (salon.ownerEmail !== email) return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 })
    const valid = await bcrypt.compare(password, salon.ownerPasswordHash)
    if (!valid) return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 })
    const token = signOwnerToken({ salonId: salon.id, slug, email: salon.ownerEmail })
    const res = NextResponse.json({ ok: true })
    res.cookies.set('bookdesk_owner', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
