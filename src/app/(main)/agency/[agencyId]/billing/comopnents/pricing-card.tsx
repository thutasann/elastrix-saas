'use client'

import React from 'react'
import CustomModal from '@/components/molecules/modals/cutsom-modal'
import SubscriptionFormWrapper from '@/components/organisms/forms/subscription-form/subscription-form-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PricesList } from '@/dto/types/agency'
import { useModal } from '@/providers/modal-provider'
import { useSearchParams } from 'next/navigation'

interface IPricingCard {
  features: string[]
  buttonCta: string
  title: string
  description: string
  amt: string
  duration: string
  highlightTitle: string
  highlightDescription: string
  customerId: string
  prices: PricesList['data']
  planExists: boolean
}

function PricingCard({
  amt,
  buttonCta,
  customerId,
  description,
  duration,
  features,
  highlightDescription,
  highlightTitle,
  planExists,
  prices,
  title,
}: IPricingCard) {
  const { setOpen } = useModal()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  const handleManagePlan = async () => {
    setOpen(
      <CustomModal
        title={'Manage Your Plan'}
        subheading='You can change your plan at any time from the billings settings'
      >
        <SubscriptionFormWrapper customerId={customerId} planExists={planExists} />
      </CustomModal>,
      async () => ({
        plans: {
          defaultPriceId: plan ? plan : '',
          plans: prices,
        },
      }),
    )
  }

  return (
    <Card className='flex flex-col justify-between lg:w-1/2'>
      <div>
        <CardHeader className='flex flex-col justify-between md:!flex-row'>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            <p className='text-6xl font-bold'>
              {amt}
              <small className='text-xs font-light text-muted-foreground'>{duration}</small>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <ul>
            {features.map((feature) => (
              <li key={feature} className='ml-4 list-disc text-muted-foreground'>
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      <CardFooter>
        <Card className='w-full'>
          <div className='flex flex-col items-center justify-between gap-4 rounded-lg border p-4 md:!flex-row'>
            <div>
              <p>{highlightTitle}</p>
              <p className='text-sm text-muted-foreground'>{highlightDescription}</p>
            </div>

            <Button className='w-full md:w-fit' onClick={handleManagePlan}>
              {buttonCta}
            </Button>
          </div>
        </Card>
      </CardFooter>
    </Card>
  )
}

export default PricingCard
