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
  if (!stripeKey) return NextResponse.json({ ok: false })

  const salon = await prisma.salon.findUnique({ where: { id: owner.salonId } })
  if (!salon?.stripeCustomerId) return NextResponse.json({ ok: false })

  const stripe = new Stripe(stripeKey)
  const subs = await stripe.subscriptions.list({ customer: salon.stripeCustomerId, limit: 1 })
  const sub = subs.data[0]
  if (sub) {
    await prisma.salon.update({
      where: { id: salon.id },
      data: { stripeSubscriptionId: sub.id, subscriptionStatus: sub.status },
    })
  }
  return NextResponse.json({ ok: true, status: sub?.status ?? null })
}
