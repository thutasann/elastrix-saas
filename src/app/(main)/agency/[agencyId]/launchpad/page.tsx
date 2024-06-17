import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import { getStripeOAuthLink, stripe } from '@/lib/stripe'
import { CheckCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ILaunchPage {
  params: {
    agencyId: string
  }
  searchParams: { code: string }
}

async function LaunchPadPage({ params, searchParams }: ILaunchPage) {
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
  })

  if (!agencyDetails) return

  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode

  const stripeOAuthLink = getStripeOAuthLink('agency', `launchpad___${agencyDetails.id}`)

  let connectedStripeAccount = false

  if (searchParams.code) {
    if (!agencyDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: 'authorization_code',
          code: searchParams.code,
        })
        console.log('stripe_user_id', response.stripe_user_id)
        await db.agency.update({
          where: { id: params.agencyId },
          data: {
            connectAccountId: response.stripe_user_id,
          },
        })
        connectedStripeAccount = true
      } catch (error) {
        console.log('🔴 Could not connect stripe account')
      }
    }
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='h-full w-full max-w-[800px]'>
        <Card className='border-none'>
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>Follow the steps below to get your account setup.</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <div className='flex w-full items-center justify-between gap-2 rounded-lg border p-4'>
              <div className='flex flex-col gap-4 md:!flex-row md:items-center'>
                <Image
                  src='/assets/appstore.png'
                  alt='app logo'
                  height={80}
                  width={80}
                  className='rounded-md object-contain'
                />
                <p> Save the website as a shortcut on your mobile device</p>
              </div>
              <Button disabled>Start</Button>
            </div>
            <div className='flex w-full items-center justify-between gap-2 rounded-lg border p-4'>
              <div className='flex flex-col gap-4 md:!flex-row md:items-center'>
                <Image
                  src='/assets/stripelogo.png'
                  alt='app logo'
                  height={80}
                  width={80}
                  className='rounded-md object-contain'
                />
                <p>Connect your stripe account to accept payments and see your dashboard.</p>
              </div>
              {agencyDetails.connectAccountId || connectedStripeAccount ? (
                <CheckCircleIcon size={50} className='flex-shrink-0 p-2 text-primary' />
              ) : (
                <Link href={stripeOAuthLink} className='rounded-md bg-primary px-4 py-2 text-white'>
                  Start
                </Link>
              )}
            </div>
            <div className='flex w-full items-center justify-between gap-2 rounded-lg border p-4'>
              <div className='flex flex-col gap-4 md:!flex-row md:items-center'>
                <Image
                  src={agencyDetails.agencyLogo}
                  alt='app logo'
                  height={80}
                  width={80}
                  className='rounded-md object-contain'
                />
                <p> Fill in all your bussiness details</p>
              </div>
              {allDetailsExist ? (
                <CheckCircleIcon size={50} className='flex-shrink-0 p-2 text-primary' />
              ) : (
                <Link
                  className='rounded-md bg-primary px-4 py-2 text-white'
                  href={`/agency/${params.agencyId}/settings`}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LaunchPadPage
