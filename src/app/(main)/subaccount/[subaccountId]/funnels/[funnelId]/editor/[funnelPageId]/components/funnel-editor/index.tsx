/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Button } from '@/components/ui/button'
import { getFunnelPageDetails } from '@/lib/server-actions/queries/funnel-queries'
import { useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { EyeOff } from 'lucide-react'
import React, { useEffect } from 'react'
import RecursiveFunnelEditorComponents from './funnel-editor-components'

interface IFunnelEditor {
  funnelPageId: string
  liveMode?: boolean
}

function FunnelEditor({ funnelPageId, liveMode }: IFunnelEditor) {
  const { state, dispatch } = useEditor()

  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: 'TOGGLE_LIVE_MODE',
        payload: { value: true },
      })
    }
  }, [liveMode])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFunnelPageDetails(funnelPageId)
      if (!response) return
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          elements: response.content ? JSON.parse(response?.content) : '',
          withLive: !!liveMode,
        },
      })
    }
    fetchData()
  }, [funnelPageId])

  const handleClick = () => {
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {},
    })
  }

  const handleUnPreview = () => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
    dispatch({ type: 'TOGGLE_LIVE_MODE' })
  }

  return (
    <div
      className={clsx(
        'use-automation-zoom-in mr-[385px] h-full overflow-scroll rounded-md bg-background transition-all',
        {
          '!mr-0 !p-0': state.editor.previewMode === true || state.editor.liveMode === true,
          '!w-[850px]': state.editor.device === 'Tablet',
          '!w-[420px]': state.editor.device === 'Mobile',
          'w-full': state.editor.device === 'Desktop',
        },
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          variant={'ghost'}
          size={'icon'}
          className='fixed left-0 top-0 z-[100] h-6 w-6 bg-slate-600 p-[2px]'
          onClick={handleUnPreview}
        >
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => (
          <div key={childElement.id}>
            <RecursiveFunnelEditorComponents key={childElement.id} element={childElement} />
          </div>
        ))}
    </div>
  )
}

export default FunnelEditor
