'use client'

import React, { useEffect, useState } from 'react'
import { LaneDetail, PipelineDestilsWithLanesCardsTagsTickets, TicketAndTags } from '@/dto/types/ticket'
import { Lane, Ticket } from '@prisma/client'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import CustomModal from '@/components/molecules/modals/cutsom-modal'
import CreateLaneForm from '@/components/organisms/forms/create-lane-form'
import { DragDropContext, type DropResult, Droppable } from 'react-beautiful-dnd'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import PipelineLane from './pipeline-lane'

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
  console.log('allLanes', allLanes)
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
        <CreateLaneForm pipelineId={pipelineId} />
      </CustomModal>,
    )
  }

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source, type } = dropResult
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    switch (type) {
      case 'lane': {
        const newLanes = [...allLanes]
          .toSpliced(source.index, 1)
          .toSpliced(destination.index, 0, allLanes[source.index])
          .map((lane, index) => {
            return { ...lane, order: index }
          })
        setAllLanes(newLanes)
        updateLanesOrder(newLanes)
      }

      case 'ticket': {
        let newLanes = [...allLanes]
        const originaLane = newLanes.find((lane) => lane.id === source.droppableId)
        const destinationLane = newLanes.find((lane) => lane.id === destination.droppableId)

        if (!originaLane || !destinationLane) {
          return
        }

        if (source.droppableId === destination.droppableId) {
          const newOrderedTickets = [...originaLane.Tickets]
            .toSpliced(source.index, 1)
            .toSpliced(destination.index, 0, originaLane.Tickets[source.index])
            .map((item, idx) => {
              return { ...item, order: idx }
            })
          originaLane.Tickets = newOrderedTickets
          setAllLanes(newLanes)
          updateTicketsOrder(newOrderedTickets)
          router.refresh()
        } else {
          const [currentTicket] = originaLane.Tickets.splice(source.index, 1)

          originaLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          })

          destinationLane.Tickets.splice(destination.index, 0, {
            ...currentTicket,
            laneId: destination.droppableId,
          })

          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          })
          setAllLanes(newLanes)
          updateTicketsOrder([...destinationLane.Tickets, ...originaLane.Tickets])
          router.refresh()
        }
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='use-automation-zoom-in rounded-xl bg-white/60 p-4 dark:bg-background/60'>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-bold'>{pipelineDetails?.name}</h1>
          <Button className='flex items-center gap-4' onClick={handleAddLane}>
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
        <Droppable droppableId='lanes' type='lane' direction='horizontal' key='lanes'>
          {(provided) => {
            return (
              <div
                className='flex items-center gap-x-2 overflow-auto'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div className='mt-4 flex'>
                  {allLanes.map((lane, index) => (
                    <PipelineLane
                      allTickets={allTickets}
                      setAllTickets={setAllTickets}
                      subaccountId={subAccountId}
                      pipelineId={pipelineId}
                      tickets={lane.Tickets}
                      laneDetails={lane}
                      index={index}
                      key={lane.id}
                    />
                  ))}
                </div>
              </div>
            )
          }}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default Pipelineview
