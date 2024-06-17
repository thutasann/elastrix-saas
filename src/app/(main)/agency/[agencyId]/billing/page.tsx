import { addOnProducts, pricingCards } from '@/lib/constants'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import React from 'react'
import SubscriptionHelper from './comopnents/subscription-helper'
import { Separator } from '@/components/ui/separator'
import PricingCard from './comopnents/pricing-card'

interface IBillingPage {
  params: {
    agencyId: string
  }
}

async function BillingPage({ params }: IBillingPage) {
  const addOns = await stripe.products.list({
    ids: addOnProducts.map((product) => product.id),
  })

  const agencySubscription = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    select: {
      customerId: true,
      Subscription: true,
    },
  })

  const prices = await stripe.prices.list({
    product: process.env.NEXT_ELASTRIX_PRODUCT_ID,
    active: true,
  })

  const currentPlanDetails = pricingCards.find((c) => c.priceId == agencySubscription?.Subscription?.priceId)

  const charges = await stripe.charges.list({
    limit: 50,
    customer: agencySubscription?.customerId,
  })

  const allCharges = [
    ...charges.data.map((charge) => ({
      description: charge.description,
      id: charge.id,
      date: `${new Date(charge.created * 1000).toLocaleTimeString()} ${new Date(
        charge.created * 1000,
      ).toLocaleDateString()}`,
      status: 'Paid',
      amount: `$${charge.amount / 100}`,
    })),
  ]

  return (
    <>
      <SubscriptionHelper
        prices={prices.data}
        customerId={agencySubscription?.customerId || ''}
        planExists={agencySubscription?.Subscription?.active === true}
      />
      <h1 className='p-4 text-2xl'>Billing</h1>
      <Separator className='mb-6' />

      {/* Current Plan */}
      <h2 className='p-4 text-xl'>Current Plan</h2>
      <div className='flex flex-col justify-between gap-8 lg:!flex-row'>
        <PricingCard
          planExists={agencySubscription?.Subscription?.active === true}
          prices={prices.data}
          customerId={agencySubscription?.customerId || ''}
          amt={agencySubscription?.Subscription?.active === true ? currentPlanDetails?.price || '$0' : '$0'}
          buttonCta={agencySubscription?.Subscription?.active === true ? 'Change Plan' : 'Get Started'}
          highlightDescription='Want to modify your plan? You can do this here. If you have
          further question contact support@plura-app.com'
          highlightTitle='Plan Options'
          description={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.description || 'Lets get started'
              : 'Lets get started! Pick a plan that works best for you.'
          }
          duration='/ month'
          features={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.features || []
              : currentPlanDetails?.features ||
                pricingCards.find((pricing) => pricing.title === 'Starter')?.features ||
                []
          }
          title={agencySubscription?.Subscription?.active === true ? currentPlanDetails?.title || 'Starter' : 'Starter'}
        />
        {addOns.data.map((addOn) => (
          <PricingCard
            planExists={agencySubscription?.Subscription?.active === true}
            prices={prices.data}
            customerId={agencySubscription?.customerId || ''}
            key={addOn.id}
            amt={
              //@ts-ignore
              addOn.default_price?.unit_amount
                ? //@ts-ignore
                  `$${addOn.default_price.unit_amount / 100}`
                : '$0'
            }
            buttonCta='Subscribe'
            description='Dedicated support line & teams channel for support'
            duration='/ month'
            features={[]}
            title={'24/7 priority support'}
            highlightTitle='Get support now!'
            highlightDescription='Get priority support and skip the long long with the click of a button.'
          />
        ))}
      </div>

      {/* Payment History */}
    </>
  )
}

export default BillingPage
