// Complete a Stripe subscription checkout session via subscription API
// The checkout session is open but the customer has a default PM attached.
// We create the subscription directly, then expire the checkout session.
// The checkout session will redirect to success_url when we handle the webhook
// (or we can navigate directly to success_url).
import Stripe from 'stripe'
import { createClient } from '@libsql/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SESSION_ID = process.argv[2]
if (!SESSION_ID) throw new Error('Pass session ID as arg')

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// 1. Retrieve checkout session
const session = await stripe.checkout.sessions.retrieve(SESSION_ID)
console.log('Session status:', session.status, '| payment_status:', session.payment_status)
console.log('Customer:', session.customer)
console.log('Success URL:', session.success_url)

const customerId = session.customer
const priceId = process.env.STRIPE_PRICE_ID

// 2. Get default PM
const customer = await stripe.customers.retrieve(customerId)
const defaultPm = customer.invoice_settings?.default_payment_method
console.log('Default PM:', defaultPm)

if (!defaultPm) throw new Error('No default PM on customer')

// 3. Create subscription with default PM
const sub = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  default_payment_method: defaultPm,
  metadata: { checkout_session: SESSION_ID },
})
console.log('Subscription:', sub.id, 'status:', sub.status)

// 4. Check if latest invoice was paid (it should be for active sub)
const inv = await stripe.invoices.retrieve(sub.latest_invoice)
console.log('Invoice status:', inv.status, 'amount_paid:', inv.amount_paid)

// 5. Update DB
const rows = await db.execute({
  sql: 'SELECT id FROM Salon WHERE slug = ?',
  args: ['sprucespa'],
})
const salonId = rows.rows[0]?.id
if (salonId) {
  await db.execute({
    sql: 'UPDATE Salon SET stripeSubscriptionId = ?, subscriptionStatus = ? WHERE id = ?',
    args: [sub.id, sub.status, salonId],
  })
  console.log('DB updated — sprucespa subscriptionStatus:', sub.status)
}

// 6. Print the success URL so we can navigate there
console.log('SUCCESS_URL=' + session.success_url)
