import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LaneDetail } from '@/dto/types/ticket'
import { db } from '@/lib/db'
import {
  getLanesWithTicketAndTags,
  getPipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
} from '@/lib/server-actions/queries/ticket-queries'
import { redirect } from 'next/navigation'
import React from 'react'
import PipelineInfoBar from '../components/pipeline-infobar'
import Pipelineview from '../components/pipeline-view'
import PipelineSettings from '../components/pipeline-settings'

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
        <div>
          <TabsTrigger value='view'>Pipeline View</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value='view'>
        <Pipelineview
          lanes={lanes}
          pipelineDetails={pipelineDetails}
          pipelineId={params.pipelineId}
          subAccountId={params.subaccountId}
          updateLanesOrder={updateLanesOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value='settings'>
        <PipelineSettings pipelineId={params.pipelineId} pipelines={pipelines} subaccountId={params.subaccountId} />
      </TabsContent>
    </Tabs>
  )
}

export default PipelineDetailPage
