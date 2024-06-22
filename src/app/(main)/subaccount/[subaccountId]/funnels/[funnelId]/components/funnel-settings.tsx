import React from 'react'
import { Funnel } from '@prisma/client'
import { db } from '@/lib/db'
import { getConnectAccountProducts } from '@/lib/stripe/stripe-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FunnelForm from '@/components/organisms/forms/funnel-form'
import FunnelProductsTable from './funnel-products-table'

interface IFunnelSettings {
  subaccountId: string
  defaultData: Funnel
}

async function FunnelSettings({ subaccountId, defaultData }: IFunnelSettings) {
  const subAccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  })

  if (!subAccountDetails) return
  if (!subAccountDetails.connectAccountId) return

  const products = await getConnectAccountProducts(subAccountDetails.connectAccountId)
  console.log('products', products, subAccountDetails.connectAccountId)

  return (
    <div className='flex flex-col gap-4 xl:!flex-row'>
      <Card className='flex-1 flex-shrink'>
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel. You can sell one time and recurring
            products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {subAccountDetails.connectAccountId ? (
              <FunnelProductsTable defaultData={defaultData} products={products} />
            ) : (
              'Connect your stripe account to sell products'
            )}
          </>
        </CardContent>
      </Card>

      <FunnelForm subAccountId={subaccountId} defaultData={defaultData} />
    </div>
  )
}

export default FunnelSettings
