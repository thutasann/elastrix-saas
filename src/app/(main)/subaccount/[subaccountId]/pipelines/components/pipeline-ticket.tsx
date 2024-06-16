import CustomModal from '@/components/molecules/modals/cutsom-modal'
import TicketForm from '@/components/organisms/forms/ticket-form'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { TicketWithTags } from '@/dto/types/ticket'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { deleteTicket } from '@/lib/server-actions/queries/ticket-queries'
import { useModal } from '@/providers/modal-provider'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction } from 'react'
import { Draggable } from 'react-beautiful-dnd'

interface IPipelineTicket {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>
  ticket: TicketWithTags[0]
  subaccountId: string
  allTickets: TicketWithTags
  index: number
}

function PipelineTicket({ setAllTickets, ticket, subaccountId, allTickets, index }: IPipelineTicket) {
  const { toast } = useToast()
  const router = useRouter()
  const { setOpen, data } = useModal()

  const editnewTicket = (ticket: TicketWithTags[0]) => {
    setAllTickets((tickets) =>
      allTickets.map((t) => {
        if (t.id === ticket.id) {
          return ticket
        }
        return t
      }),
    )
  }

  const handleClickEdit = async () => {
    setOpen(
      <CustomModal title='Update Ticket Details' subheading=''>
        <TicketForm getNewTicket={editnewTicket} laneId={ticket.laneId} subaccountId={subaccountId} />
      </CustomModal>,
    )
  }

  const handleDeleteTicket = async () => {
    try {
      setAllTickets((tickets) => tickets.filter((t) => t.id !== ticket.id))
      const response = await deleteTicket(ticket.id)
      toast({
        title: 'Deleted',
        description: 'Deleted ticket from lane.',
      })

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a ticket | ${response?.name}`,
        subAccountId: subaccountId,
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not delete the ticket.',
      })
      console.log('ticket delete error ', error)
    }
  }

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300, y: 20 }
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          }
        }
        return (
          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <AlertDialog>
              <DropdownMenu>
                <Card className='my-4 bg-white shadow-none transition-all dark:bg-slate-900'>
                  <CardHeader className='p-[12px]'>
                    <CardTitle className='flex items-center justify-between'>
                      <span>{ticket.name}</span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </DropdownMenu>
            </AlertDialog>
          </div>
        )
      }}
    </Draggable>
  )
}

export default PipelineTicket
