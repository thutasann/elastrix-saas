'use client'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FunnelsForSubAccount } from '@/dto/types/agency'
import { useModal } from '@/providers/modal-provider'
import { FunnelPage } from '@prisma/client'
import { Check } from 'lucide-react'
import React, { useState } from 'react'
import { type DropResult, type DragStart, DragDropContext, Droppable } from 'react-beautiful-dnd'
import FunnelStepCard from './funnel-step-card'

interface IFUnnelSteps {
  funnel: FunnelsForSubAccount
  subaccountId: string
  pages: FunnelPage[]
  funnelId: string
}

function FunnelSteps({ funnel, subaccountId, pages, funnelId }: IFUnnelSteps) {
  const [clickedPage, setClickedPage] = useState(pages[0])
  const [pagesState, setPagesState] = useState(pages)
  const { setOpen } = useModal()

  const onDragStart = (event: DragStart) => {
    const { draggableId } = event
    const values = pagesState.find((page) => page.id === draggableId)
  }

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult
  }

  return (
    <AlertDialog>
      <div className='flex flex-col border-[1px] lg:!flex-row'>
        <aside className='flex flex-[0.3px] flex-col justify-between bg-background p-6'>
          <ScrollArea className='h-full'>
            <div className='flex items-center gap-4'>
              <Check />
              Funnel Steps
            </div>
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
        </aside>
      </div>
    </AlertDialog>
  )
}

export default FunnelSteps
