import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { signOwnerToken } from '@/lib/auth'

const DEFAULT_SETTINGS: Record<string, Record<string, string>> = {
  nail_salon: {
    heroLine1: 'Nails that speak', heroLine2: 'for themselves.',
    heroCopy: 'Premium nail care in a clean, calm studio. Book your appointment today.',
    aboutTitle: 'Our Studio', aboutBody: 'We believe beautiful nails start with healthy ones. Every visit is a moment to slow down.',
  },
  barber: {
    heroLine1: 'Sharp cuts,', heroLine2: 'clean style.',
    heroCopy: 'Classic barbering for the modern gentleman. Walk in or book ahead.',
    aboutTitle: 'The Barber Shop', aboutBody: 'A place where craft meets conversation. Come as you are, leave looking your best.',
  },
  spa: {
    heroLine1: 'Restore.', heroLine2: 'Renew. Relax.',
    heroCopy: 'Signature treatments designed to leave you feeling completely at ease.',
    aboutTitle: 'The Spa', aboutBody: 'We offer a full range of body and skincare treatments in a tranquil environment.',
  },
  lash: {
    heroLine1: 'Lashes that', heroLine2: 'last.',
    heroCopy: 'Lash extensions and lifts crafted for your eye shape and lifestyle.',
    aboutTitle: 'The Studio', aboutBody: 'We specialize in natural-looking lash enhancements tailored to you.',
  },
  other: {
    heroLine1: 'Book your', heroLine2: 'appointment.',
    heroCopy: 'Professional service by appointment. Easy online booking.',
    aboutTitle: 'About Us', aboutBody: 'We look forward to seeing you. Book online or reach out to learn more.',
  },
}

export async function POST(req: NextRequest) {
  const { name, slug, businessType, email, password } = await req.json()

  if (!name || !slug || !email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!/^[a-z0-9]{2,32}$/.test(slug)) {
    return NextResponse.json({ error: 'Slug must be 2–32 lowercase letters/numbers.' }, { status: 400 })
  }

  const existing = await prisma.salon.findFirst({ where: { OR: [{ slug }, { ownerEmail: email }] } })
  if (existing) {
    return NextResponse.json({ error: existing.slug === slug ? 'That URL is taken.' : 'That email is already registered.' }, { status: 409 })
  }

  const ownerPasswordHash = await bcrypt.hash(password, 12)
  const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

  const salon = await prisma.salon.create({
    data: { name, slug, businessType: businessType || 'other', ownerEmail: email, ownerPasswordHash, subscriptionStatus: 'trialing', trialEndsAt },
  })

  // Seed default settings for this business type
  const defaults = DEFAULT_SETTINGS[businessType] ?? DEFAULT_SETTINGS.other
  await Promise.all(Object.entries(defaults).map(([key, value]) =>
    prisma.setting.upsert({
      where: { salonId_key: { salonId: salon.id, key } },
      update: {},
      create: { salonId: salon.id, key, value },
    })
  ))

  // Pre-create Stripe customer if keys are configured (checkout happens later, on demand)
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (stripeKey) {
    try {
      const stripe = new Stripe(stripeKey)
      const customer = await stripe.customers.create({ email, name, metadata: { salonId: salon.id, slug } })
      await prisma.salon.update({ where: { id: salon.id }, data: { stripeCustomerId: customer.id } })
    } catch {
      // Non-fatal — customer will be created lazily on subscribe
    }
  }

  // Always go straight to admin on signup (trial-first flow)
  const token = signOwnerToken({ salonId: salon.id, slug, email })
  const res = NextResponse.json({ slug })
  res.cookies.set('bookdesk_owner', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}
