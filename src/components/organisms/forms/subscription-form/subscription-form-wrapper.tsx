'use client'

import { useToast } from '@/components/ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { Plan } from '@prisma/client'
import { StripeElementsOptions } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { pricingCards } from '@/lib/constants'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe/stripe-client'
import { CustomLoader } from '@/components/molecules/loader'
import SubscriptionForm from '.'

interface ISubscriptionFormWrapper {
  customerId: string
  planExists: boolean
}

function SubscriptionFormWrapper({ customerId, planExists }: ISubscriptionFormWrapper) {
  const { data, setClose } = useModal()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedPriceId, setSelectedPriceId] = useState<Plan | ''>(data?.plans?.defaultPriceId || '')
  const [subscription, setSubscription] = useState<{
    subscriptionId: string
    clientSecret: string
  }>({ subscriptionId: '', clientSecret: '' })

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: 'flat',
      },
    }),
    [subscription],
  )

  useEffect(() => {
    if (!selectedPriceId) return
    const createSecret = async () => {
      const subscriptionResponse = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId: selectedPriceId,
        }),
      })
      const subscriptionResponseData = await subscriptionResponse.json()
      setSubscription({
        clientSecret: subscriptionResponseData.clientSecret,
        subscriptionId: subscriptionResponseData.subscriptionId,
      })
      if (planExists) {
        toast({
          title: 'Success',
          description: 'Your plan has been successfully upgraded!',
        })
        setClose()
        router.refresh()
      }
    }
    createSecret()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedPriceId, customerId])

  return (
    <div className='border-none transition-all'>
      <div className='flex flex-col gap-4'>
        {data?.plans?.plans.map((price) => (
          <Card
            className={cn('relative cursor-pointer transition-all', {
              'border-primary': selectedPriceId === price.id,
            })}
            onClick={() => setSelectedPriceId(price.id as Plan)}
            key={price.id}
          >
            <CardHeader>
              <CardTitle>
                ${price.unit_amount ? price.unit_amount / 100 : '0'}
                <p className='text-sm text-muted-foreground'>{price.nickname}</p>
                <p className='text-sm text-muted-foreground'>
                  {pricingCards.find((p) => p.priceId === price.id)?.description}
                </p>
              </CardTitle>
            </CardHeader>
            {selectedPriceId === price.id && (
              <div className='absolute right-4 top-4 h-2 w-2 rounded-full bg-emerald-500' />
            )}
          </Card>
        ))}

        {options.clientSecret && !planExists && (
          <>
            <h1 className='text-lg'>Payment Method</h1>
            <Elements stripe={getStripe()} options={options}>
              <SubscriptionForm selectedPriceId={selectedPriceId} />
            </Elements>
          </>
        )}

        {!options.clientSecret && selectedPriceId && (
          <div className='flex h-40 w-full items-center justify-center'>
            <CustomLoader />
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionFormWrapper
