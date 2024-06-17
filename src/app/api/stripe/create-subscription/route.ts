import { ICreateSubscription } from '@/dto/types/stripe'
import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { customerId, priceId }: ICreateSubscription = await req.json()
  if (!customerId || !priceId) {
    return new NextResponse('Customer Id or Price Id is missing', {
      status: 400,
    })
  }

  const subscriptionExists = await db.agency.findFirst({
    where: { customerId },
    include: {
      Subscription: true,
    },
  })

  try {
    if (subscriptionExists?.Subscription?.subscritiptionId && subscriptionExists.Subscription.active) {
      // update subscriptoin instead of creating one
      if (!subscriptionExists.Subscription.subscritiptionId) {
        throw new Error('Could not find the subscriptoin Id to update the subscription.')
      }

      Logger.info('Updating the subscription.....')
      const currentSubscriptionDetails = await stripe.subscriptions.retrieve(
        subscriptionExists.Subscription.subscritiptionId,
      )

      const subscription = await stripe.subscriptions.update(subscriptionExists.Subscription.subscritiptionId, {
        items: [
          {
            id: currentSubscriptionDetails.items.data[0].id,
            deleted: true,
          },
          { price: priceId },
        ],
        expand: ['latest_invoice.payment_intent'],
      })
      return NextResponse.json({
        subscriptionId: subscription.id,
        //@ts-ignore
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      })
    } else {
      Logger.info('Creating a subscription ...')
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      })
      return NextResponse.json({
        subscriptionId: subscription.id,
        //@ts-ignore
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      })
    }
  } catch (error: any) {
    console.log('🔴 create Subscription error : ', error.message)
    return new NextResponse('Internal Server Error', {
      status: 500,
    })
  }
}
