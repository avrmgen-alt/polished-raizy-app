import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SESSION_ID = process.argv[2]
const session = await stripe.checkout.sessions.retrieve(SESSION_ID, {
  expand: ['payment_intent', 'subscription', 'setup_intent'],
})
console.log('status:', session.status)
console.log('payment_status:', session.payment_status)
console.log('mode:', session.mode)
console.log('payment_intent:', JSON.stringify(session.payment_intent)?.slice(0, 100))
console.log('subscription:', JSON.stringify(session.subscription)?.slice(0, 100))
console.log('setup_intent:', JSON.stringify(session.setup_intent)?.slice(0, 100))
console.log('all keys:', Object.keys(session).filter(k => !['object','livemode','locale','metadata','total_details','url','custom_text','custom_fields','consent_collection','consent','billing_address_collection','shipping_address_collection','shipping_options','tax_id_collection'].includes(k)))
