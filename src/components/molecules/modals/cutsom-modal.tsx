'use client'

import React from 'react'
import { useModal } from '@/providers/modal-provider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog'

interface ICustomModal {
  title: string
  subheading: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function CustomModal({ children, defaultOpen, subheading, title }: ICustomModal) {
  const { isOpen, setClose } = useModal()

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className='h-screen overflow-auto bg-card md:h-fit md:max-h-[700px]'>
        <DialogHeader className='pt-8 text-left'>
          <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal
