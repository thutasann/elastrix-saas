'use client'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FunnelsForSubAccount } from '@/dto/types/agency'
import { useModal } from '@/providers/modal-provider'
import { FunnelPage } from '@prisma/client'
import React, { useState } from 'react'
import { type DropResult, type DragStart, DragDropContext, Droppable } from 'react-beautiful-dnd'
import FunnelStepCard from './funnel-step-card'
import { useToast } from '@/components/ui/use-toast'
import { upsertFunnelPage } from '@/lib/server-actions/queries/funnel-queries'
import { Button } from '@/components/ui/button'
import CustomModal from '@/components/molecules/modals/cutsom-modal'
import FunnelPageForm from '@/components/organisms/forms/funnel-page-form'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, LucideEdit } from 'lucide-react'
import Link from 'next/link'
import FunnelPagePlaceholder from '@/components/molecules/icons/funnel-page-placeholder'

interface IFUnnelSteps {
  funnel: FunnelsForSubAccount
  subaccountId: string
  pages: FunnelPage[]
  funnelId: string
}

function FunnelSteps({ funnel, subaccountId, pages, funnelId }: IFUnnelSteps) {
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
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx }
      })
    setPagesState(newPageOrder)

    newPageOrder.forEach(async (page, index) => {
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
        console.log(error)
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Could not save page order',
        })
        return
      }
    })

    toast({
      title: 'Success',
      description: 'Saved page order',
    })

    toast({
      title: 'Success',
      description: 'Saved page order',
    })
  }

  return (
    <AlertDialog>
      <div className='flex flex-col border-[1px] lg:!flex-row'>
        {/* Funnels */}
        <aside className='flex flex-[0.3] flex-col justify-between bg-background p-6'>
          {/* Funnel Steps */}
          <ScrollArea className='h-full'>
            <div className='flex items-center gap-4 text-xl font-bold'>Funnel Steps</div>
            {pagesState.length ? (
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable droppableId='funnels' direction='vertical' key='funnels'>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {pagesState.map((page, idx) => (
                        <div className='relative' key={page.id} onClick={() => setClickedPage(page)}>
                          <FunnelStepCard
                            funnelPage={page}
                            index={idx}
                            key={page.id}
                            activePage={page.id === clickedPage?.id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
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

        <aside className='flex-[0.7] bg-muted p-4'>
          {!!pages.length ? (
            <Card className='flex h-full flex-col justify-between'>
              <CardHeader>
                <p className='text-sm text-muted-foreground'>Page name</p>
                <CardTitle>{clickedPage?.name}</CardTitle>
                <CardDescription className='flex flex-col gap-4'>
                  <div className='w-full overflow-clip rounded-lg border-2'>
                    <Link
                      href={`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${clickedPage?.id}`}
                      className='group relative'
                    >
                      <div className='w-full cursor-pointer group-hover:opacity-30'>
                        <FunnelPagePlaceholder />
                      </div>
                      <LucideEdit
                        size={50}
                        className='transofrm absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !text-muted-foreground opacity-0 transition-all duration-100 group-hover:opacity-100'
                      />
                    </Link>

                    <Link
                      target='_blank'
                      href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                      className='group flex items-center justify-start gap-2 p-2 transition-colors duration-200 hover:text-primary'
                    >
                      <ExternalLink size={15} />
                      <div className='w-64 overflow-hidden overflow-ellipsis'>
                        {process.env.NEXT_PUBLIC_SCHEME}
                        {funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/{clickedPage?.pathName}
                      </div>
                    </Link>
                  </div>

                  <FunnelPageForm
                    subaccountId={subaccountId}
                    defaultData={clickedPage}
                    funnelId={funnelId}
                    order={clickedPage?.order || 0}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className='flex h-[600px] items-center justify-center text-muted-foreground'>
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  )
}

export default FunnelSteps
