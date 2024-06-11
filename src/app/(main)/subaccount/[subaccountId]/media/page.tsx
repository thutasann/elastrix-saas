import BlurPage from '@/components/organisms/agency/blur-page'
import MediaComponent from '@/components/organisms/sub-account/media'
import { getMedia } from '@/lib/server-actions/queries/subaccount-queries'
import React from 'react'

interface ISubAccountMediaPage {
  params: {
    subaccountId: string
  }
}

async function SubAccountMediaPage({ params }: ISubAccountMediaPage) {
  const data = await getMedia(params.subaccountId)
  return (
    <BlurPage>
      <MediaComponent data={data} subaccountId={params.subaccountId} />
    </BlurPage>
  )
}

export default SubAccountMediaPage
