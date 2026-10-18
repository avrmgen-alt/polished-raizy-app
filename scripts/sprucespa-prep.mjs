// Step 1: Get sprucespa salon info
// Step 2: Create Stripe customer if needed and attach test PM
// Step 3: Update DB with customer ID so Subscribe flow skips customer creation
import Stripe from 'stripe'
import { createClient } from '@libsql/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const rows = await db.execute({
  sql: 'SELECT id, name, ownerEmail, stripeCustomerId FROM Salon WHERE slug = ?',
  args: ['sprucespa'],
})
const salon = rows.rows[0]
console.log('Salon:', JSON.stringify(salon))

let customerId = salon.stripeCustomerId
if (!customerId) {
  // Create Stripe customer
  const customer = await stripe.customers.create({
    email: String(salon.ownerEmail),
    name: String(salon.name),
    metadata: { salonId: String(salon.id), slug: 'sprucespa' },
  })
  customerId = customer.id
  await db.execute({
    sql: 'UPDATE Salon SET stripeCustomerId = ? WHERE slug = ?',
    args: [customerId, 'sprucespa'],
  })
  console.log('Created Stripe customer:', customerId)
} else {
  console.log('Existing Stripe customer:', customerId)
}

// Attach a test PM as default
const pm = await stripe.paymentMethods.create({
  type: 'card',
  card: { token: 'tok_visa' },
})
await stripe.paymentMethods.attach(pm.id, { customer: customerId })
await stripe.customers.update(customerId, {
  invoice_settings: { default_payment_method: pm.id },
})
console.log('Attached PM:', pm.id, 'to customer:', customerId)
console.log('CUSTOMER_ID=' + customerId)
