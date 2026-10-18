import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyOwnerToken } from '@/lib/auth'

async function getSalonId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bookdesk_owner')?.value
  const owner = token ? verifyOwnerToken(token) : null
  return owner?.salonId ?? null
}

export async function GET() {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const services = await prisma.service.findMany({ where: { salonId }, orderBy: [{ isAddon: 'asc' }, { order: 'asc' }] })
  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const service = await prisma.service.create({ data: { salonId, ...data } })
  return NextResponse.json(service)
}

export async function PATCH(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await req.json()
  const existing = await prisma.service.findFirst({ where: { id, salonId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const service = await prisma.service.update({ where: { id }, data })
  return NextResponse.json(service)
}

export async function DELETE(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const existing = await prisma.service.findFirst({ where: { id, salonId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.service.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
