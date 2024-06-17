'use client'

import CustomModal from '@/components/molecules/modals/cutsom-modal'
import CreateLaneForm from '@/components/organisms/forms/create-lane-form'
import TicketForm from '@/components/organisms/forms/ticket-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LaneDetail, TicketWithTags } from '@/dto/types/ticket'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { deleteLane } from '@/lib/server-actions/queries/ticket-queries'
import { cn } from '@/lib/utils'
import { useModal } from '@/providers/modal-provider'
import { Edit, MoreVertical, PlusCircleIcon, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import PipelineTicket from './pipeline-ticket'

interface IPipelineLane {
  allTickets: TicketWithTags
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>
  tickets: TicketWithTags
  pipelineId: string
  laneDetails: LaneDetail
  subaccountId: string
  index: number
}

function PipelineLane({
  setAllTickets,
  tickets,
  pipelineId,
  laneDetails,
  subaccountId,
  allTickets,
  index,
}: IPipelineLane) {
  const { setOpen } = useModal()
  const router = useRouter()

  const amt = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  })

  const laneAmt = useMemo(() => {
    return tickets.reduce((sum, ticket) => sum + (Number(ticket?.value) || 0), 0)
  }, [tickets])

  const randomColor = `#${Math.random().toString(16).slice(2, 8)}`

  const addNewTicket = (tickets: TicketWithTags[0]) => {
    setAllTickets([...allTickets, tickets])
  }

  const handleCreateTicket = () => {
    setOpen(
      <CustomModal title='Create a ticket' subheading='Tickets are a great way to keep track of tasks'>
        <TicketForm getNewTicket={addNewTicket} laneId={laneDetails.id} subaccountId={subaccountId} />
      </CustomModal>,
    )
  }

  const handleEditLane = () => {
    setOpen(
      <CustomModal title='Edit Lane Details' subheading=''>
        <CreateLaneForm pipelineId={pipelineId} defaultData={laneDetails} />
      </CustomModal>,
    )
  }

  const handleDeleteLane = async () => {
    try {
      const response = await deleteLane(laneDetails.id)
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a lane | ${response?.name}`,
        subAccountId: subaccountId,
      })
      router.refresh()
    } catch (error) {
      console.error('handle delete error : ', error)
    }
  }

  return (
    <Draggable draggableId={laneDetails.id} index={index} key={laneDetails.id}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300, y: 0 }
          // @ts-ignore
          const x = provided.draggableProps.style?.left - offset.x
          // @ts-ignore
          const y = provided.draggableProps.style?.top - offset.y
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          }
        }
        return (
          <div {...provided.draggableProps} ref={provided.innerRef} className='h-full'>
            <AlertDialog>
              <DropdownMenu>
                <div className='relative m-2 h-[700px] w-[300px] flex-shrink-0 overflow-visible rounded-lg border bg-slate-200/30 px-4 dark:bg-background/20'>
                  {/* lane */}
                  <div
                    {...provided.dragHandleProps}
                    className='absolute left-0 right-0 top-0 z-10 h-auto bg-slate-200/60 p-3 backdrop-blur-lg dark:bg-background/40'
                  >
                    <div className='flex w-full items-center gap-2'>
                      <div className={cn('h-4 w-4 rounded-full')} style={{ background: randomColor }} />
                      <span className='text-sm font-bold'>{laneDetails.name}</span>
                    </div>
                    <div className='mt-2 flex w-full flex-row items-center justify-between'>
                      <Badge className='bg-white text-black'>{amt.format(laneAmt)}</Badge>
                      <DropdownMenuTrigger>
                        <MoreVertical className='cursor-pointer text-muted-foreground' />
                      </DropdownMenuTrigger>
                    </div>
                  </div>

                  {/* pipeline tickets */}
                  <Droppable droppableId={laneDetails.id} key={laneDetails.id} type='ticket'>
                    {(provided) => {
                      return (
                        <div className='mt-24 max-h-[700px] overflow-auto'>
                          <div {...provided.droppableProps} ref={provided.innerRef} className='mt-2'>
                            {tickets?.map((ticket, index) => {
                              return (
                                <PipelineTicket
                                  allTickets={allTickets}
                                  setAllTickets={setAllTickets}
                                  subaccountId={subaccountId}
                                  ticket={ticket}
                                  key={ticket.id.toString()}
                                  index={index}
                                />
                              )
                            })}
                            {provided.placeholder}
                          </div>
                        </div>
                      )
                    }}
                  </Droppable>

                  {/* dropdown item */}
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger>
                      <DropdownMenuItem className='flex w-full items-center gap-2'>
                        <Trash size={15} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <DropdownMenuItem className='flex items-center gap-2' onClick={handleEditLane}>
                      <Edit size={15} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center gap-2' onClick={handleCreateTicket}>
                      <PlusCircleIcon size={15} />
                      Create Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from
                      our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className='flex items-center'>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-destructive' onClick={handleDeleteLane}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
          </div>
        )
      }}
    </Draggable>
  )
}

export default PipelineLane
