import CircleProgress from '@/components/atoms/statistics/circle-progress'
import ClipboardIcon from '@/components/molecules/icons/clipboardIcon'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { AreaChart } from '@tremor/react'
import { Contact2, DollarSign, Goal, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface IAgencyIdPage {
  params: {
    agencyId: string
  }
  searchParams: {
    code: string
  }
}

async function AgencyIdPage({ params, searchParams }: IAgencyIdPage) {
  let currency = 'USD'
  let sessions
  let totalClosedSessions
  let totalPendingSessions
  let net = 0
  let potentialIncome = 0
  let closingRate = 0
  const currentYear = new Date().getFullYear()
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
  })

  if (!agencyDetails) return

  const subAccounts = await db.subAccount.findMany({
    where: {
      agencyId: params.agencyId,
    },
  })

  if (agencyDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: agencyDetails.connectAccountId,
    })

    currency = response.default_currency?.toUpperCase() || 'USD'

    /** checkout sessions */
    const checkoutSessions = await stripe.checkout.sessions.list(
      {
        created: {
          gte: startDate,
          lte: endDate,
        },
        limit: 10,
      },
      { stripeAccount: agencyDetails.connectAccountId },
    )

    sessions = checkoutSessions.data

    totalClosedSessions = checkoutSessions.data
      ?.filter((session) => session.status === 'complete')
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }))

    totalPendingSessions = checkoutSessions.data
      .filter((session) => session.status === 'open')
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }))

    net = +totalClosedSessions.reduce((total, session) => total + (session.amount_total || 0), 0).toFixed(2)

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2)

    closingRate = +((totalClosedSessions.length / checkoutSessions.data.length) * 100).toFixed(2)
  }

  return (
    <div className='relative h-full'>
      {!agencyDetails.connectAccountId && (
        <div className='absolute -left-10 -top-10 bottom-0 right-0 z-30 flex items-center justify-center bg-background/50 backdrop-blur-md'>
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Stripe</CardTitle>
              <CardDescription>You need to connect your stripe account to see metrics</CardDescription>
              <Link
                href={`/agency/${agencyDetails.id}/launchpad`}
                className='flex w-fit items-center gap-2 rounded-md bg-secondary p-2 text-[16px] text-white'
              >
                <ClipboardIcon />
                Launch Pad
              </Link>
            </CardHeader>
          </Card>
        </div>
      )}
      {agencyDetails.connectAccountId && (
        <>
          <h1 className='text-4xl'>Dashboard</h1>
          <Separator className='my-6' />
          <div className='flex flex-col gap-4 pb-6'>
            <div className='flex flex-col gap-4 xl:!flex-row'>
              {/* Income */}
              <Card className='relative flex-1'>
                <CardHeader>
                  <CardDescription>Income</CardDescription>
                  <CardTitle className='text-4xl'>{net ? `${currency} ${net.toFixed(2)}` : `$0.00`}</CardTitle>
                  <small className='text-xs text-muted-foreground'>For the year {currentYear}</small>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                  Total revenue generated as reflected in your stripe dashboard.
                </CardContent>
                <DollarSign className='absolute right-4 top-4 text-muted-foreground' />
              </Card>

              {/* Potential Income */}
              <Card className='relative flex-1'>
                <CardHeader>
                  <CardDescription>Potential Income</CardDescription>
                  <CardTitle className='text-4xl'>
                    {potentialIncome ? `${currency} ${potentialIncome.toFixed(2)}` : `$0.00`}
                  </CardTitle>
                  <small className='text-xs text-muted-foreground'>For the year {currentYear}</small>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>This is how much you can close.</CardContent>
                <DollarSign className='absolute right-4 top-4 text-muted-foreground' />
              </Card>

              {/* Active Clients */}
              <Card className='relative flex-1'>
                <CardHeader>
                  <CardDescription>Active Clients</CardDescription>
                  <CardTitle className='text-4xl'>{subAccounts.length}</CardTitle>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                  Reflects the number of sub accounts you own and manage.
                </CardContent>
                <Contact2 className='absolute right-4 top-4 text-muted-foreground' />
              </Card>

              {/* Agency Goal */}
              <Card className='relative flex-1'>
                <CardHeader>
                  <CardTitle>Agency Goal</CardTitle>
                  <CardDescription>
                    <p className='mt-2'>Reflects the number of sub accounts you want to own and manage.</p>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className='flex w-full flex-col'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Current: {subAccounts.length}</span>
                      <span className='text-sm text-muted-foreground'>Goal: {agencyDetails.goal}</span>
                    </div>
                    <Progress value={(subAccounts.length / agencyDetails.goal) * 100} />
                  </div>
                </CardFooter>
                <Goal className='absolute right-4 top-4 text-muted-foreground' />
              </Card>
            </div>

            <div className='flex flex-col gap-4 xl:!flex-row'>
              {/* Transaction History */}
              <Card className='flex-1 p-4'>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <AreaChart
                  className='stroke-primary text-sm'
                  data={[...(totalClosedSessions || []), ...(totalPendingSessions || [])]}
                  index='created'
                  categories={['amount_total']}
                  colors={['primary']}
                  yAxisWidth={30}
                  showAnimation={true}
                />
              </Card>

              {/* Conversions */}
              <Card className='w-full xl:w-[400px]'>
                <CardHeader>
                  <CardTitle>Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CircleProgress
                    value={closingRate}
                    description={
                      <>
                        {sessions && (
                          <div className='flex flex-col'>
                            Abandoned
                            <div className='flex gap-2'>
                              <ShoppingCart className='text-rose-700' />
                              {sessions.length}
                            </div>
                          </div>
                        )}
                        {totalClosedSessions && (
                          <div className='felx flex-col'>
                            Won Carts
                            <div className='flex gap-2'>
                              <ShoppingCart className='text-emerald-700' />
                              {totalClosedSessions.length}
                            </div>
                          </div>
                        )}
                      </>
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AgencyIdPage
