import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })

  const stripe = new Stripe(stripeKey)
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = webhookSecret ? stripe.webhooks.constructEvent(body, sig, webhookSecret) : JSON.parse(body) as Stripe.Event
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const sub = event.data.object as Stripe.Subscription
  const salonId = sub.metadata?.salonId
  if (!salonId) return NextResponse.json({ received: true })

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    await prisma.salon.update({
      where: { id: salonId },
      data: { stripeSubscriptionId: sub.id, subscriptionStatus: sub.status },
    })
  } else if (event.type === 'customer.subscription.deleted') {
    await prisma.salon.update({ where: { id: salonId }, data: { subscriptionStatus: 'canceled' } })
  }

  return NextResponse.json({ received: true })
}
