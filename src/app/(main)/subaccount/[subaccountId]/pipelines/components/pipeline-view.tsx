'use client'

import React, { useEffect, useState } from 'react'
import { LaneDetail, PipelineDestilsWithLanesCardsTagsTickets, TicketAndTags } from '@/dto/types/ticket'
import { Lane, Ticket } from '@prisma/client'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import CustomModal from '@/components/molecules/modals/cutsom-modal'

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
  const router = useRouter()
  const { setOpen } = useModal()
  const ticketsFromAllLanes: TicketAndTags[] = []
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([])
  const [allTickets, setAllTickets] = useState<TicketAndTags[]>(ticketsFromAllLanes)

  lanes?.forEach((lane) => {
    lane?.Tickets.forEach((t) => {
      ticketsFromAllLanes.push(t)
    })
  })

  useEffect(() => {
    setAllLanes(lanes)
  }, [lanes])

  const handleAddLane = () => {
    setOpen(
      <CustomModal title='Create A Lane' subheading='Lanes allow you to group tickets'>
        <h1>Lane Form</h1>
      </CustomModal>,
    )
  }

  return <div>Pipelineview</div>
}

export default Pipelineview
