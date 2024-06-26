'use client'

import React from 'react'
import { EditorBtns } from '@/dto/types/globals'
import { Contact2Icon } from 'lucide-react'

function ContactFormPlaceHolder() {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, 'contactForm')}
      className='flex h-12 w-12 cursor-grab items-center justify-center rounded-lg bg-muted'
    >
      <Contact2Icon size={30} className='text-muted-foreground' />
    </div>
  )
}

export default ContactFormPlaceHolder
