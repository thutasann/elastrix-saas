import Stripe from 'stripe'

/**
 * stripe instance
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'elastrix',
    version: '0.1.0',
  },
  typescript: true,
})
