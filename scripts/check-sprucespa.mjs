import Stripe from 'stripe'
import { createClient } from '@libsql/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })

const rows = await db.execute({ sql: 'SELECT id, name, slug, stripeCustomerId, stripeSubscriptionId, subscriptionStatus FROM Salon WHERE slug = ?', args: ['sprucespa'] })
const salon = rows.rows[0]
console.log('DB salon:', JSON.stringify(salon))

const SESSION_ID = 'cs_test_a15HFQVeahUGW8uu2mrb1yiCtXniHDOm4nCHGVias3TBOaQXXK186S7SPx'
const session = await stripe.checkout.sessions.retrieve(SESSION_ID, { expand: ['subscription'] })
console.log('Checkout session status:', session.status)
console.log('Checkout payment_status:', session.payment_status)
console.log('Subscription from session:', session.subscription?.id, session.subscription?.status)

if (salon.stripeSubscriptionId) {
  const sub = await stripe.subscriptions.retrieve(String(salon.stripeSubscriptionId))
  console.log('DB sub from Stripe:', sub.id, sub.status)
}
