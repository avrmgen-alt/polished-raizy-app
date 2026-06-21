import BookingClient from '@/components/BookingClient'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

export default async function BookingPage() {
  const services = await prisma.service.findMany({ where: { isAddon: false }, orderBy: { order: 'asc' } })
  const addons = await prisma.service.findMany({ where: { isAddon: true }, orderBy: { order: 'asc' } })
  const depositCents = parseInt(await getSetting('depositAmount') || '1000')
  const stripePk = await getSetting('stripePublishableKey')

  return <BookingClient services={services} addons={addons} depositCents={depositCents} stripePk={stripePk} />
}
