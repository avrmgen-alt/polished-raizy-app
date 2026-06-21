import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const count = await prisma.service.count()
  const svc = await prisma.service.create({ data: { ...data, order: count } })
  return NextResponse.json(svc)
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json()
  const svc = await prisma.service.update({ where: { id }, data })
  return NextResponse.json(svc)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await prisma.service.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
