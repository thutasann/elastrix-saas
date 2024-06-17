'use client'

import CustomModal from '@/components/molecules/modals/cutsom-modal'
import SubscriptionFormWrapper from '@/components/organisms/forms/subscription-form/subscription-form-wrapper'
import { PricesList } from '@/dto/types/stripe'
import { useModal } from '@/providers/modal-provider'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

interface ISubscriptionHelper {
  prices: PricesList['data']
  customerId: string
  planExists: boolean
}

function SubscriptionHelper({ prices, customerId, planExists }: ISubscriptionHelper) {
  const { setOpen } = useModal()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  useEffect(() => {
    if (plan) {
      setOpen(
        <CustomModal title='Upgrade Plan!' subheading='Get Started today to get access to premium features'>
          <SubscriptionFormWrapper planExists={planExists} customerId={customerId} />
        </CustomModal>,
        async () => ({
          plans: {
            defaultPriceId: plan ? plan : '',
            plans: prices,
          },
        }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan])

  return <div>SubscriptionHelper</div>
}

export default SubscriptionHelper
