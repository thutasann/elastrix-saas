'use client'

import { EditorBtns } from '@/dto/types/globals'
import { Link2Icon } from 'lucide-react'
import React from 'react'

function LinkPlaceholder() {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, 'link')}
      className='flex h-12 w-12 items-center justify-center rounded-lg bg-muted'
    >
      <Link2Icon size={30} className='text-muted-foreground' />
    </div>
  )
}

export default LinkPlaceholder
