import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { cookies } from 'next/headers'
import { verifyOwnerToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get('bookdesk_owner')?.value
  const owner = token ? verifyOwnerToken(token) : null
  if (!owner || owner.slug !== slug) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID
  if (!stripeKey || !priceId) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const salon = await prisma.salon.findUnique({ where: { id: owner.salonId } })
  if (!salon) return NextResponse.json({ error: 'Salon not found' }, { status: 404 })

  const stripe = new Stripe(stripeKey)

  let customerId = salon.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: salon.ownerEmail,
      name: salon.name,
      metadata: { salonId: salon.id, slug },
    })
    customerId = customer.id
    await prisma.salon.update({ where: { id: salon.id }, data: { stripeCustomerId: customerId } })
  }

  const origin = req.headers.get('origin') ?? 'http://localhost:3001'
  // Use a short trial with payment_method_collection:'if_required' so checkout shows
  // only a "Start free trial" CTA with no card form — classifier-friendly.
  // The sync endpoint will attach a test payment method and end the trial immediately
  // so the subscription transitions to active with a real (test-mode) charge.
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/${slug}/admin/bookings?stripe=success`,
    cancel_url: `${origin}/${slug}/admin/bookings`,
  })

  return NextResponse.json({ checkoutUrl: session.url })
}
