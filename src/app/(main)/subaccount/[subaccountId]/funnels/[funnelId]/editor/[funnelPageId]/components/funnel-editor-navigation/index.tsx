'use client'

import { Input } from '@/components/ui/input'
import { TooltipProvider } from '@/components/ui/tooltip'
import { upsertFunnelPage } from '@/lib/server-actions/queries/funnel-queries'
import { cn } from '@/lib/utils'
import { useEditor } from '@/providers/editor/editor-provider'
import { FunnelPage } from '@prisma/client'
import { ArrowLeftCircle, EyeIcon, Redo2, Undo2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import React, { FocusEventHandler, useEffect } from 'react'
import DevicesTab from './devices-tab'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'

interface IFunnelEditorNavigation {
  funnelId: string
  funnelPageDetails: FunnelPage
  subaccountId: string
}

function FunnelEditorNavigation({ funnelId, funnelPageDetails, subaccountId }: IFunnelEditorNavigation) {
  const router = useRouter()
  const { state, dispatch } = useEditor()

  useEffect(() => {
    dispatch({
      type: 'SET_FUNNELPAGE_ID',
      payload: { funnelPageId: funnelPageDetails.id },
    })
  }, [dispatch, funnelPageDetails.id])

  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (event) => {
    const value = event.target.value
    if (value === funnelPageDetails.name) return
    if (value) {
      await upsertFunnelPage(
        subaccountId,
        funnelPageDetails.id,
        {
          name: value,
          order: funnelPageDetails.order,
        },
        funnelId,
      )
      toast('Success', {
        description: 'Saved Funnel Page title',
        style: {
          zIndex: '9999',
        },
      })
      router.refresh()
    } else {
      toast('Oppse!', {
        description: 'You need to have a title!',
        style: {
          zIndex: '9999',
        },
      })
      event.target.value = funnelPageDetails.name
    }
  }

  const handlePreviewClick = () => {
    dispatch({
      type: 'TOGGLE_PREVIEW_MODE',
    })
    dispatch({
      type: 'TOGGLE_LIVE_MODE',
    })
  }

  const handleUndo = () => {
    dispatch({
      type: 'UNDO',
    })
  }

  const handleRedo = () => {
    dispatch({
      type: 'REDO',
    })
  }

  const handleOnSave = async () => {
    const content = JSON.stringify(state.editor.elements)
    const { id, ...funnelPageDetailsWithoutId } = funnelPageDetails
    try {
      const response = await upsertFunnelPage(
        subaccountId,
        funnelPageDetails.id,
        {
          ...funnelPageDetailsWithoutId,
          content,
        },
        funnelId,
      )
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subAccountId: subaccountId,
      })
      toast('Success', {
        description: 'Saved Editor',
      })
    } catch (error) {
      console.log('editor save error: ', error)
      toast('Oppse!', {
        description: 'Could not save editor',
      })
    }
  }

  return (
    <TooltipProvider>
      <nav
        className={cn('flex items-center justify-between gap-2 border-b-[1px] p-6 transition-all', {
          '!h-0 !overflow-hidden !p-0': state.editor.previewMode,
        })}
      >
        <aside className='flex w-[300px] max-w-[260px] items-center gap-4'>
          <Link href={`/subaccount/${subaccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle className='stroke-muted-foreground hover:opacity-95' />
          </Link>
          <div className='flex w-full flex-col'>
            <Input
              defaultValue={funnelPageDetails.name}
              className='m-0 h-5 border-none p-0 text-lg font-bold'
              onBlur={handleOnBlurTitleChange}
            />
            <span className='text-sm text-muted-foreground'>Path: /{funnelPageDetails.pathName}</span>
          </div>
        </aside>
        <DevicesTab />
        <aside className='flex items-center gap-2'>
          <Button onClick={handlePreviewClick} variant='ghost' size='icon' className='hover:bg-slate-800'>
            <EyeIcon />
          </Button>
          <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            variant={'ghost'}
            size={'icon'}
            className='hover:bg-slate-800'
          >
            <Undo2 />
          </Button>
          <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleRedo}
            variant={'ghost'}
            size={'icon'}
            className='hover:bg-slate-800'
          >
            <Redo2 />
          </Button>
          <div className='mr-4 flex flex-col items-center'>
            <div className='flex flex-row items-center gap-3 font-bold text-muted-foreground'>
              Draft
              <Switch defaultChecked={true} />
              Publish
            </div>
            <span className='text-sm text-muted-foreground'>
              Last updated {funnelPageDetails.updatedAt.toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleOnSave}>Save</Button>
        </aside>
      </nav>
    </TooltipProvider>
  )
}

export default FunnelEditorNavigation
