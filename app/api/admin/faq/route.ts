import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.faqItem.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const { question, answer, published, order } = await req.json()
  const count = await prisma.faqItem.count({ where: { source: 'admin' } })
  const item = await prisma.faqItem.create({ data: { question, answer, published: published ?? false, order: order ?? count, source: 'admin' } })
  return NextResponse.json(item)
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json()
  const item = await prisma.faqItem.update({ where: { id }, data })
  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await prisma.faqItem.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
