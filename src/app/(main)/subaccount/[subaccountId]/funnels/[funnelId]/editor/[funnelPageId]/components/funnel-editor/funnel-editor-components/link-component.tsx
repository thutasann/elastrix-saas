'use client'

import React from 'react'
import { EditorElement } from '@/providers/editor/editor-types'
import { useEditor } from '@/providers/editor/editor-provider'
import { EditorBtns } from '@/dto/types/globals'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Trash } from 'lucide-react'

interface ILinkComponent {
  element: EditorElement
}

function LinkComponent({ element }: ILinkComponent) {
  const { dispatch, state } = useEditor()
  const styles = element.styles

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type == null) return
    e.dataTransfer.setData('componentType', type)
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
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
      onDragStart={(e) => handleDragStart(e, 'text')}
      onClick={handleOnClickBody}
      className={clsx('relative m-[5px] w-full p-[2px] text-[16px] transition-all', {
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

      {!Array.isArray(element.content) && (state.editor.previewMode || state.editor.liveMode) && (
        <Link href={element.content.href || '#'} className='text-primary'>
          {element.content.innerText}
        </Link>
      )}

      {!state.editor.previewMode && !state.editor.liveMode && (
        <span
          contentEditable={!state.editor.liveMode}
          onBlur={(e) => {
            const spanElement = e.target as HTMLSpanElement
            dispatch({
              type: 'UPDATE_ELEMENT',
              payload: {
                elementDetails: {
                  ...element,
                  content: {
                    innerText: spanElement.innerText,
                  },
                },
              },
            })
          }}
          className='text-primary'
        >
          {!Array.isArray(element.content) && element.content.innerText}
        </span>
      )}
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className='absolute -right-[1px] -top-[25px] rounded-none rounded-t-lg bg-primary px-2.5 py-1 text-xs font-bold !text-white'>
          <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  )
}

export default LinkComponent
