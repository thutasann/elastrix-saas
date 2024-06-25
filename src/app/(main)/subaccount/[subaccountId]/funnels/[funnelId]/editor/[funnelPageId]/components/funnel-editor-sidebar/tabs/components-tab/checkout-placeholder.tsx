'use client'

import { EditorBtns } from '@/dto/types/globals'
import { Contact2Icon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function CheckoutPlaceholder() {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type == null) return
    e.dataTransfer.setData('componentType', type)
  }

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, 'paymentForm')}
      className='flex h-12 w-12 items-center justify-center rounded-lg bg-muted'
    >
      <Image src='/assets/stripelogo.png' height={30} width={30} alt='stripe logo' className='object-cover' />
    </div>
  )
}

export default CheckoutPlaceholder
