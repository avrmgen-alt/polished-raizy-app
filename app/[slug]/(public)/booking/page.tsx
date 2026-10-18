import { notFound } from 'next/navigation'
import BookingClient from '@/components/BookingClient'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'
import { getSalonBySlug } from '@/lib/tenant'

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) notFound()

  const services = await prisma.service.findMany({ where: { salonId: salon.id, isAddon: false }, orderBy: { order: 'asc' } })
  const addons = await prisma.service.findMany({ where: { salonId: salon.id, isAddon: true }, orderBy: { order: 'asc' } })
  const depositCents = parseInt(await getSetting(salon.id, 'depositAmount') || '1000')
  const stripePk = await getSetting(salon.id, 'stripePublishableKey')

  return <BookingClient services={services} addons={addons} depositCents={depositCents} stripePk={stripePk || ''} slug={slug} salonName={salon.name} />
}
