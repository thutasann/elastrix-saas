'use client'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FunnelsForSubAccount } from '@/dto/types/agency'
import { useModal } from '@/providers/modal-provider'
import { FunnelPage } from '@prisma/client'
import { Check, Router } from 'lucide-react'
import React, { useState } from 'react'
import { type DropResult, type DragStart, DragDropContext, Droppable } from 'react-beautiful-dnd'
import FunnelStepCard from './funnel-step-card'
import { useToast } from '@/components/ui/use-toast'
import { upsertFunnelPage } from '@/lib/server-actions/queries/funnel-queries'
import { Button } from '@/components/ui/button'
import CustomModal from '@/components/molecules/modals/cutsom-modal'
import FunnelPageForm from '@/components/organisms/forms/funnel-page-form'
import { useRouter } from 'next/navigation'

interface IFUnnelSteps {
  funnel: FunnelsForSubAccount
  subaccountId: string
  pages: FunnelPage[]
  funnelId: string
}

function FunnelSteps({ funnel, subaccountId, pages, funnelId }: IFUnnelSteps) {
  const router = useRouter()
  const { setOpen } = useModal()
  const { toast } = useToast()
  const [clickedPage, setClickedPage] = useState(pages[0])
  const [pagesState, setPagesState] = useState(pages)

  const onDragStart = (event: DragStart) => {
    const { draggableId } = event
    const values = pagesState.find((page) => page.id === draggableId)
  }

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pages[source.index])
      .map((page, index) => {
        return {
          ...page,
          order: index,
        }
      })
    setPagesState(newPageOrder)

    newPageOrder.forEach(async (page, index) => {
      console.log('page.id', page.id)
      try {
        await upsertFunnelPage(
          subaccountId,
          page.id,
          {
            order: index,
            name: page.name,
          },
          funnelId,
        )
      } catch (error) {
        console.log('funnel page upsert error : ', error)
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Could not save page order',
        })
        return
      }
    })
  }

  return (
    <AlertDialog>
      <div className='flex flex-col border-[1px] lg:!flex-row'>
        <aside className='flex flex-[0.3px] flex-col justify-between bg-background p-6'>
          {/* Funnel Steps */}
          <ScrollArea className='h-full'>
            <div className='flex items-center gap-4 text-xl font-bold'>Funnel Steps</div>
            {pagesState.length ? (
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable droppableId='funnels' direction='vertical' key='funnels'>
                  {(provided) => {
                    return (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {pagesState.map((page, index) => (
                          <div className='relative' key={page.id} onClick={() => setClickedPage(page)}>
                            <FunnelStepCard
                              funnelPage={page}
                              activePage={page.id === clickedPage?.id}
                              index={index}
                              key={page.id}
                            />
                          </div>
                        ))}
                      </div>
                    )
                  }}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className='py-6 text-center text-muted-foreground'>No Pages</div>
            )}
          </ScrollArea>

          {/* Cretae Funnel Page */}
          <Button
            className='mt-4 w-full'
            onClick={() => {
              setOpen(
                <CustomModal
                  title='Create or Update a Funnel Page'
                  subheading='Funnel Pages allow you to create step by step processes for customers to follow'
                >
                  <FunnelPageForm subaccountId={subaccountId} funnelId={funnelId} order={pagesState.length} />
                </CustomModal>,
              )
            }}
          >
            Create New Steps
          </Button>
        </aside>
      </div>
    </AlertDialog>
  )
}

export default FunnelSteps
