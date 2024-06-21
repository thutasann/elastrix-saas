'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FunnelPage } from '@prisma/client'
import { ArrowDown, Mail } from 'lucide-react'
import { Draggable } from 'react-beautiful-dnd'
import { createPortal } from 'react-dom'

interface IFunnelStepCard {
  funnelPage: FunnelPage
  index: number
  activePage: boolean
}

function FunnelStepCard({ activePage, funnelPage, index }: IFunnelStepCard) {
  const portal = document.getElementById('blur-page')

  return (
    <Draggable draggableId={funnelPage.id} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300 }
          // @ts-ignore
          const x = provided.draggableProps.style?.left - offset.x
          // @ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            left: x,
          }
        }
        const component = (
          <Card
            className='relative my-2 cursor-grab p-0'
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <CardContent className='flex flex-row items-center gap-4 p-0'>
              <div className='flex h-14 w-14 items-center justify-center bg-muted'>
                <Mail />
                <ArrowDown size={18} className='absolute -bottom-2 text-primary' />
              </div>
              {funnelPage.name}
            </CardContent>
            {activePage && <div className='absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500' />}
          </Card>
        )
        if (!portal) return component
        if (snapshot.isDragging) {
          return createPortal(component, portal)
        }
        return component
      }}
    </Draggable>
  )
}

export default FunnelStepCard
