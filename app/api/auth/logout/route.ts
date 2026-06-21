import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('pbr_admin', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
