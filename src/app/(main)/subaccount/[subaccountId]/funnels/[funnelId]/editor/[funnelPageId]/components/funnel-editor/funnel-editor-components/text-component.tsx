'use client'

import React from 'react'
import { EditorElement } from '@/providers/editor/editor-types'
import { useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'

interface ITextComponent {
  element: EditorElement
}

function TextComponent({ element }: ITextComponent) {
  const { dispatch, state } = useEditor()
  const styles = element.styles

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: element },
    })
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

  return (
    <div
      style={styles}
      className={clsx('relative m-[5px] w-full border p-[2px] text-[16px] transition-all', {
        '!border-blue-500': state.editor.selectedElement.id === element.id,

        '!border-solid': state.editor.selectedElement.id === element.id,
        'border-[1px] border-dashed border-slate-300': !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <Badge className='absolute -left-[-1px] -top-[23px] rounded-none rounded-t-lg'>
          {state.editor.selectedElement.name}
        </Badge>
      )}
      <span
        className='text-primary-foreground'
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
      >
        {!Array.isArray(element.content) && element.content.innerText}
      </span>
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className='absolute -right-[1px] -top-[25px] rounded-none rounded-t-lg bg-primary px-2.5 py-1 text-xs font-bold !text-white'>
          <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  )
}

export default TextComponent
