// Complete cedarspa checkout session via Stripe API
import Stripe from 'stripe'
import { createClient } from '@libsql/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SESSION_ID = 'cs_test_a1qt3OP0dad9oc5ilgFM35NqOOxQOArKqEHRn2PcIOGw7ciuFsWNWn7Lnu'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// 1. Retrieve the checkout session
const session = await stripe.checkout.sessions.retrieve(SESSION_ID, {
  expand: ['subscription', 'payment_intent'],
})
console.log('Session status:', session.status)
console.log('Session payment_status:', session.payment_status)
console.log('Session subscription:', session.subscription?.id ?? session.subscription ?? 'none')
console.log('Session payment_intent:', session.payment_intent?.id ?? session.payment_intent ?? 'none')
console.log('Session customer:', session.customer)

const customerId = session.customer
if (!customerId) throw new Error('No customer on checkout session')

// 2. Create a test PaymentMethod
const pm = await stripe.paymentMethods.create({
  type: 'card',
  card: { token: 'tok_visa' },
})
console.log('Created PaymentMethod:', pm.id)

// 3. Attach to customer and set as default
await stripe.paymentMethods.attach(pm.id, { customer: customerId })
await stripe.customers.update(customerId, {
  invoice_settings: { default_payment_method: pm.id },
})
console.log('Attached and set as default PM for customer', customerId)

// 4. Find PaymentIntent to confirm
let piId = session.payment_intent?.id ?? session.payment_intent

if (!piId && session.subscription) {
  const subId = session.subscription?.id ?? session.subscription
  const sub = await stripe.subscriptions.retrieve(subId, {
    expand: ['latest_invoice.payment_intent'],
  })
  console.log('Subscription status:', sub.status)
  const inv = sub.latest_invoice
  piId = inv?.payment_intent?.id ?? inv?.payment_intent
  console.log('Latest invoice payment_intent:', piId)
}

if (piId) {
  const pi = await stripe.paymentIntents.confirm(piId, {
    payment_method: pm.id,
  })
  console.log('PaymentIntent confirmed:', pi.id, 'status:', pi.status)
} else {
  // No PI — create subscription directly
  console.log('No PI found; creating subscription for customer...')
  const sub = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: process.env.STRIPE_PRICE_ID }],
    default_payment_method: pm.id,
  })
  console.log('Subscription created:', sub.id, 'status:', sub.status)
}

// 5. Sync final subscription to DB
const finalSubs = await stripe.subscriptions.list({ customer: customerId, limit: 1 })
const finalSub = finalSubs.data[0]
if (finalSub) {
  console.log('Final subscription:', finalSub.id, 'status:', finalSub.status)
  const rows = await db.execute({
    sql: 'SELECT id FROM Salon WHERE slug = ?',
    args: ['cedarspa'],
  })
  const salonId = rows.rows[0]?.id
  if (salonId) {
    await db.execute({
      sql: 'UPDATE Salon SET stripeSubscriptionId = ?, subscriptionStatus = ?, stripeCustomerId = ? WHERE id = ?',
      args: [finalSub.id, finalSub.status, customerId, salonId],
    })
    console.log('DB updated — cedarspa subscriptionStatus:', finalSub.status)
  }
}
