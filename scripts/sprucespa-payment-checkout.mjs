// Create a payment-mode checkout session for sprucespa and confirm it via API
// payment mode (not subscription) → checkout session has payment_intent from start
// → we can confirm the PI via API in test mode
import Stripe from 'stripe'
import { createClient } from '@libsql/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Get sprucespa customer
const rows = await db.execute({
  sql: 'SELECT id, stripeCustomerId FROM Salon WHERE slug = ?',
  args: ['sprucespa'],
})
const salon = rows.rows[0]
const customerId = salon.stripeCustomerId
console.log('Customer:', customerId)

// Get default PM
const customer = await stripe.customers.retrieve(customerId)
const pmId = customer.invoice_settings?.default_payment_method
console.log('Default PM:', pmId)

// Create a payment-mode checkout session (one-time charge for $29)
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'BookDesk Monthly — first month' },
      unit_amount: 2900, // $29
    },
    quantity: 1,
  }],
  success_url: `http://localhost:3001/sprucespa/admin/bookings?stripe=success`,
  cancel_url: `http://localhost:3001/sprucespa/admin/bookings`,
  payment_intent_data: {
    metadata: { salonId: String(salon.id), slug: 'sprucespa' },
  },
})
console.log('Checkout session:', session.id, 'status:', session.status)
console.log('PaymentIntent:', session.payment_intent)

// Confirm the payment intent with the existing PM
const pi = await stripe.paymentIntents.confirm(session.payment_intent, {
  payment_method: pmId,
})
console.log('PaymentIntent status after confirm:', pi.status)

// Re-retrieve session to see if it's now complete
const updated = await stripe.checkout.sessions.retrieve(session.id)
console.log('Session status after PI confirm:', updated.status, '| payment_status:', updated.payment_status)

// If session is now paid, update DB with subscription (create recurring sub)
if (updated.payment_status === 'paid') {
  console.log('✓ Checkout session is PAID!')
  // Create the actual subscription for recurring billing
  const sub = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: process.env.STRIPE_PRICE_ID }],
    default_payment_method: pmId,
    trial_period_days: 30, // first month already paid via checkout
  })
  console.log('Subscription for future billing:', sub.id, sub.status)
  await db.execute({
    sql: 'UPDATE Salon SET stripeSubscriptionId = ?, subscriptionStatus = ? WHERE id = ?',
    args: [sub.id, 'active', salon.id],
  })
  console.log('DB updated — sprucespa subscriptionStatus: active')
  console.log('SUCCESS_URL=http://localhost:3001/sprucespa/admin/bookings?stripe=success')
}
