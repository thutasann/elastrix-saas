import { Tabs, TabsList } from '@/components/ui/tabs'
import { LaneDetail } from '@/dto/types/ticket'
import { db } from '@/lib/db'
import { getLanesWithTicketAndTags, getPipelineDetails } from '@/lib/server-actions/queries/ticket-queries'
import { redirect } from 'next/navigation'
import React from 'react'
import PipelineInfoBar from './components/pipeline-infobar'

interface IPipelineDetailPage {
  params: {
    subaccountId: string
    pipelineId: string
  }
}

async function PipelineDetailPage({ params }: IPipelineDetailPage) {
  const pipelineDetails = await getPipelineDetails(params.pipelineId)

  if (!pipelineDetails) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`)
  }

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountId },
  })

  const lanes = (await getLanesWithTicketAndTags(params.pipelineId)) as LaneDetail[]

  return (
    <Tabs defaultValue='view' className='w-full'>
      <TabsList className='mb-4 h-16 w-full justify-between border-b-2 bg-transparent'>
        <PipelineInfoBar pipelineId={params.pipelineId} subAccountId={params.subaccountId} pipelines={pipelines} />
      </TabsList>
    </Tabs>
  )
}

export default PipelineDetailPage
