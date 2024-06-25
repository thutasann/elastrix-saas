'use client'

import React from 'react'
import { EditorElement } from '@/providers/editor/editor-types'
import { useEditor } from '@/providers/editor/editor-provider'
import { EditorBtns } from '@/dto/types/globals'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'

interface IVideoComponenet {
  element: EditorElement
}

function VideoComponenet({ element }: IVideoComponenet) {
  const { dispatch, state } = useEditor()
  const styles = element.styles

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, 'video')}
      onClick={handleOnClick}
      className={clsx('relative m-[5px] flex w-full items-center justify-center p-[2px] text-[16px] transition-all', {
        '!border-blue-500': state.editor.selectedElement.id === element.id,
        '!border-solid': state.editor.selectedElement.id === element.id,
        'border-[1px] border-dashed border-slate-300': !state.editor.liveMode,
      })}
    >
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <Badge className='absolute -left-[1px] -top-[23px] rounded-none rounded-t-lg'>
          {state.editor.selectedElement.name}
        </Badge>
      )}

      {!Array.isArray(element.content) && (
        <iframe
          width={element.styles.width || '560'}
          height={element.styles.height || '315'}
          src={element.content.src}
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        />
      )}

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className='absolute -right-[1px] -top-[25px] rounded-none rounded-t-lg bg-primary px-2.5 py-1 text-xs font-bold !text-white'>
          <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  )
}

export default VideoComponenet
