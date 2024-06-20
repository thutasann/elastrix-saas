'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { updateFunnelProducts } from '@/lib/server-actions/queries/funnel-queries'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { Funnel } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Stripe from 'stripe'

interface IFunnelProductsTable {
  defaultData: Funnel
  products: Stripe.Product[]
}

function FunnelProductsTable({ defaultData, products }: IFunnelProductsTable) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [liveProducts, setLiveProducts] = useState<{ productId: string; recurring: boolean }[] | []>(
    JSON.parse(defaultData.liveProducts || '[]'),
  )

  const handleSaveProducts = async () => {
    setIsLoading(true)
    const response = await updateFunnelProducts(JSON.stringify(liveProducts), defaultData.id)
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel products | ${response.name}`,
      subAccountId: defaultData.subAccountId,
    })
    setIsLoading(false)
    router.refresh()
  }

  const handleAddProduct = async (product: Stripe.Product) => {
    // @ts-ignore
    const productIdExists = liveProducts.find((p) => p.productId === product.default_price.id)

    productIdExists
      ? // @ts-ignore
        setLiveProducts(liveProducts.filter((prod) => prod.productId !== product.default_price.id))
      : setLiveProducts([
          ...liveProducts,
          {
            // @ts-ignore
            productId: product.default_price.id as string,
            // @ts-ignore
            recurring: !!product.default_price.recurring,
          },
        ])
  }

  return (
    <>
      <Table className='rounded-md border-[1px] border-border bg-card'>
        <TableHeader className='rounded-md'>
          <TableHead>Live</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Interval</TableHead>
          <TableHead className='text-right'>Price</TableHead>
        </TableHeader>
        <TableBody className='truncate font-medium'>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Input
                  defaultChecked={
                    !!liveProducts.find(
                      (prod) =>
                        prod.productId ===
                        // @ts-ignore
                        product.default_price.id,
                    )
                  }
                  onChange={() => handleAddProduct(product)}
                  type='checkbox'
                  className='h-4 w-4'
                />
              </TableCell>
              <TableCell>
                <Image alt='product Image' height={60} width={60} src={product.images[0]} />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {
                  //@ts-ignore
                  product.default_price?.recurring ? 'Recurring' : 'One Time'
                }
              </TableCell>
              <TableCell className='text-right'>
                $
                {
                  //@ts-ignore
                  product.default_price?.unit_amount / 100
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button disabled={isLoading || products.length == 0} onClick={handleSaveProducts} className='mt-4'>
        Save Products
      </Button>
    </>
  )
}

export default FunnelProductsTable
