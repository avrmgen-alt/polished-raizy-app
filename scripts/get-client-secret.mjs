import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SESSION_ID = process.argv[2]
const session = await stripe.checkout.sessions.retrieve(SESSION_ID)
console.log('client_secret:', session.client_secret?.slice(0, 60) + '...')
console.log('session_id:', session.id)
