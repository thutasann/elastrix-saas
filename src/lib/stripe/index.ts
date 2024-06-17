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

/**
 * Get Stripe OAuth Link
 */
export function getStripeOAuthLink(accountType: 'agency' | 'subaccount', state: string) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_URL}${accountType}&state=${state}`
}
