import { loadStripe, type Stripe } from '@stripe/stripe-js'

/** stripe promise */
let stripePromise: Promise<Stripe | null>

/**
 * get stripe
 * @param connectedAccountId - connected account Id
 */
export const getStripe = (connectedAccountId?: string): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '', {
      stripeAccount: connectedAccountId,
    })
  }
  return stripePromise
}
