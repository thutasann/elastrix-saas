import React from 'react'
import { getFunnels } from '@/lib/server-actions/queries/funnel-queries'
import BlurPage from '@/components/organisms/agency/blur-page'

interface ISubAccoutnFunnelsPage {
  params: {
    subaccountId: string
  }
}

async function SubAccountFunnelsPage({ params }: ISubAccoutnFunnelsPage) {
  const funnels = await getFunnels(params.subaccountId)
  if (!funnels) return null

  return <BlurPage>Funnels: {JSON.stringify(funnels)}</BlurPage>
}

export default SubAccountFunnelsPage
