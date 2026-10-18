// Stripe test-mode payment script — attaches tok_visa and creates a subscription for bloomspa
import Stripe from 'stripe'
import { createClient } from '@libsql/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const priceId = process.env.STRIPE_PRICE_ID

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Get bloomspa customer ID
const rows = await db.execute({
  sql: 'SELECT id, stripeCustomerId FROM Salon WHERE slug = ?',
  args: ['bloomspa'],
})
const salon = rows.rows[0]
console.log('Salon:', JSON.stringify(salon))

const customerId = salon.stripeCustomerId
if (!customerId) throw new Error('No Stripe customer ID for bloomspa')

// Attach Stripe test card via tok_visa (published test token, no real charge possible)
const source = await stripe.customers.createSource(customerId, { source: 'tok_visa' })
console.log('Attached test card source:', source.id)

// Set as default payment source
await stripe.customers.update(customerId, { default_source: source.id })

// Create subscription — Stripe charges the test card (test mode only)
const sub = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  default_source: source.id,
})
console.log('Subscription created:', sub.id, 'status:', sub.status)

// Persist to DB
await db.execute({
  sql: 'UPDATE Salon SET stripeSubscriptionId = ?, subscriptionStatus = ? WHERE slug = ?',
  args: [sub.id, sub.status, 'bloomspa'],
})
console.log('DB updated — subscriptionStatus:', sub.status)
