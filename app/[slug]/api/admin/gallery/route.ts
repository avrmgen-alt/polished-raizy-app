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
  const photos = await prisma.galleryPhoto.findMany({ where: { salonId }, orderBy: { order: 'asc' } })
  return NextResponse.json(photos)
}

export async function POST(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { url, caption } = await req.json()
  const count = await prisma.galleryPhoto.count({ where: { salonId } })
  const photo = await prisma.galleryPhoto.create({ data: { salonId, url, caption: caption || '', order: count } })
  return NextResponse.json(photo)
}

export async function PATCH(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await req.json()
  const existing = await prisma.galleryPhoto.findFirst({ where: { id, salonId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const photo = await prisma.galleryPhoto.update({ where: { id }, data })
  return NextResponse.json(photo)
}

export async function DELETE(req: NextRequest) {
  const salonId = await getSalonId()
  if (!salonId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const existing = await prisma.galleryPhoto.findFirst({ where: { id, salonId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.galleryPhoto.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
