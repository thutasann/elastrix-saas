'use client'

import React from 'react'
import { LaneDetail, PipelineDestilsWithLanesCardsTagsTickets } from '@/dto/types/ticket'
import { Lane, Ticket } from '@prisma/client'

interface IPipelineView {
  lanes: LaneDetail[]
  pipelineId: string
  subAccountId: string
  pipelineDetails: PipelineDestilsWithLanesCardsTagsTickets
  updateLanesOrder: (lanes: Lane[]) => Promise<void>
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>
}

function Pipelineview({
  lanes,
  pipelineDetails,
  pipelineId,
  subAccountId,
  updateLanesOrder,
  updateTicketsOrder,
}: IPipelineView) {
  return <div>Pipelineview</div>
}

export default Pipelineview
