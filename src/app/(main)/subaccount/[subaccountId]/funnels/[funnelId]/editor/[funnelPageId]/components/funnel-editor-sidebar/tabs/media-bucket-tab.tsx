'use client'

import MediaComponent from '@/components/organisms/sub-account/media'
import { GetMediaFiles } from '@/dto/types/agency'
import { getMedia } from '@/lib/server-actions/queries/subaccount-queries'
import React, { useEffect, useState } from 'react'

interface IMediaBucketTab {
  subaccountId: string
}

function MediaBucketTab({ subaccountId }: IMediaBucketTab) {
  const [data, setData] = useState<GetMediaFiles>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(subaccountId)
      setData(response)
    }
    fetchData()
  }, [subaccountId])

  return (
    <div className='h-[900px] overflow-auto p-4'>
      <MediaComponent data={data} subaccountId={subaccountId} />
    </div>
  )
}

export default MediaBucketTab
