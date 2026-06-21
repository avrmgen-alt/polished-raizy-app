import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(photos)
}

export async function POST(req: NextRequest) {
  const { url, caption } = await req.json()
  const count = await prisma.galleryPhoto.count()
  const photo = await prisma.galleryPhoto.create({ data: { url, caption: caption || '', order: count } })
  return NextResponse.json(photo)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await prisma.galleryPhoto.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
