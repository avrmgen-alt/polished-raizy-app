import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const setting = await prisma.setting.findUnique({ where: { key: 'adminPasswordHash' } })
    if (!setting) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    const valid = await bcrypt.compare(password, setting.value)
    if (!valid) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    const token = signToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set('pbr_admin', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
