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
  return <MediaComponent data={data} subaccountId={params.subaccountId} />
}

export default SubAccountMediaPage
