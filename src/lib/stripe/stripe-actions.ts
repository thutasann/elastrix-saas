'use server'

import Stripe from 'stripe'
import { db } from '../db'
import { stripe } from '.'

/** subscription created */
export const subscriptionCreated = async (subscription: Stripe.Subscription, customerId: string) => {
  try {
    const agency = await db.agency.findFirst({
      where: {
        customerId: customerId,
      },
    })
  } catch (error) {
    console.log('subscription created error : ', error)
  }
}
