'use server'

import Stripe from 'stripe'
import { db } from '../db'
import { stripe } from '.'
import { Logger } from '../logger'

/** subscription created */
export const subscriptionCreated = async (subscription: Stripe.Subscription, customerId: string): Promise<void> => {
  try {
    const agency = await db.agency.findFirst({
      where: {
        customerId: customerId,
      },
      include: {
        SubAccount: true,
      },
    })
    if (!agency) {
      throw new Error('Could not find any agency to upsert the subscription')
    }

    const data = {
      active: subscription.status === 'active',
      agencyId: agency.id,
      customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
      //@ts-ignore
      priceId: subscription.plan.id,
      subscritiptionId: subscription.id,
      //@ts-ignore
      plan: subscription.plan.id,
    }

    await db.subscription.upsert({
      where: {
        agencyId: agency.id,
      },
      create: data,
      update: data,
    })

    Logger.info(`🟢 Created Subscription for ${subscription.id}`)
  } catch (error) {
    console.log('subscription created error : ', error)
  }
}

/** get connect account products */
export const getConnectAccountProducts = async (stripeAccount: string): Promise<Stripe.Product[]> => {
  const products = await stripe.products.list(
    {
      limit: 50,
      expand: ['data.default_price'],
    },
    {
      stripeAccount,
    },
  )
  return products.data
}
