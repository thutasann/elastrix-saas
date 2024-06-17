import BlurPage from '@/components/organisms/agency/blur-page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import { getStripeOAuthLink, stripe } from '@/lib/stripe'
import { CheckCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ISubAccountLaunchPadPage {
  searchParams: {
    state: string
    code: string
  }
  params: { subaccountId: string }
}

async function SubAccountLaunchPadPage({ params, searchParams }: ISubAccountLaunchPadPage) {
  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
  })

  if (!subaccountDetails) return

  const allDetailsExist =
    subaccountDetails.address &&
    subaccountDetails.subAccountLogo &&
    subaccountDetails.city &&
    subaccountDetails.companyEmail &&
    subaccountDetails.companyPhone &&
    subaccountDetails.country &&
    subaccountDetails.name &&
    subaccountDetails.state

  const stripeOAuthLink = getStripeOAuthLink('subaccount', `launchpad___${subaccountDetails.id}`)

  let connectedStripeAccount = false

  if (searchParams.code) {
    if (!subaccountDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: 'authorization_code',
          code: searchParams.code,
        })
        await db.subAccount.update({
          where: { id: params.subaccountId },
          data: { connectAccountId: response.stripe_user_id },
        })
        connectedStripeAccount = true
      } catch (error) {
        console.log('🔴 Could not connect stripe account', error)
      }
    }
  }

  return (
    <BlurPage>
      <div className='flex flex-col items-center justify-center'>
        <div className='h-full w-full max-w-[800px]'>
          <Card className='border-none'>
            <CardHeader>
              <CardTitle>Lets get started!</CardTitle>
              <CardDescription>Follow the steps below to get your account setup correctly.</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex h-20 w-full items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-4'>
                  <Image
                    src='/assets/appstore.png'
                    alt='App logo'
                    height={80}
                    width={80}
                    className='rounded-md object-contain'
                  />
                  <p>Save the website as a shortcut on your mobile devide</p>
                </div>
                <Button disabled>Start</Button>
              </div>
              <div className='flex h-20 w-full items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-4'>
                  <Image
                    src='/assets/stripelogo.png'
                    alt='App logo'
                    height={80}
                    width={80}
                    className='rounded-md object-contain'
                  />
                  <p>Connect your stripe account to accept payments. Stripe is used to run payouts.</p>
                </div>
                {subaccountDetails.connectAccountId || connectedStripeAccount ? (
                  <CheckCircleIcon size={50} className='flex-shrink-0 p-2 text-primary' />
                ) : (
                  <Link className='rounded-md bg-primary px-4 py-2 text-white' href={stripeOAuthLink}>
                    Start
                  </Link>
                )}
              </div>
              <div className='flex h-20 w-full items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-4'>
                  <Image
                    src={subaccountDetails.subAccountLogo}
                    alt='App logo'
                    height={80}
                    width={80}
                    className='rounded-md object-contain p-4'
                  />
                  <p>Fill in all your business details.</p>
                </div>
                {allDetailsExist ? (
                  <CheckCircleIcon size={50} className='flex-shrink-0 p-2 text-primary' />
                ) : (
                  <Link
                    className='rounded-md bg-primary px-4 py-2 text-white'
                    href={`/subaccount/${subaccountDetails.id}/settings`}
                  >
                    Start
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlurPage>
  )
}

export default SubAccountLaunchPadPage
