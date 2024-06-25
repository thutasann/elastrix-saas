'use client'

import React from 'react'
import { EditorBtns } from '@/dto/types/globals'
import { TypeIcon } from 'lucide-react'

function TextPlaceholder() {
  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        handleDragState(e, 'text')
      }}
      className='flex h-12 w-12 cursor-grab items-center justify-center rounded-lg bg-muted'
    >
      <TypeIcon size={30} className='text-muted-foreground' />
    </div>
  )
}

export default TextPlaceholder
