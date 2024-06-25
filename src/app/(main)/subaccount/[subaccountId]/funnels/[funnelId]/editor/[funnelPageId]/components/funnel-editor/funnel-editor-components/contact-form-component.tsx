'use client'

import React from 'react'
import { EditorElement } from '@/providers/editor/editor-types'
import { useRouter } from 'next/navigation'
import { useEditor } from '@/providers/editor/editor-provider'
import { EditorBtns } from '@/dto/types/globals'
import { getFunnel } from '@/lib/server-actions/queries/funnel-queries'
import * as z from 'zod'
import { ContactUserFormSchema } from '@/dto/forms/agency-forms'
import { useToast } from '@/components/ui/use-toast'
import { constructNow } from 'date-fns'
import { createContact } from '@/lib/server-actions/queries/subaccount-queries'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Trash } from 'lucide-react'
import ContactForm from '@/components/organisms/forms/contact-form'

interface IContactFormComponent {
  element: EditorElement
}

function ContactFormComponent({ element }: IContactFormComponent) {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor()
  const styles = element.styles
  const { toast } = useToast()
  const router = useRouter()

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
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

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return
    const funnelPages = await getFunnel(funnelId)
    if (!funnelPages || !pageDetails) return
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.FunnelPages.find((page) => page.order === pageDetails.order + 1)
      if (!nextPage) return
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`,
      )
    }
  }

  const onSubmit = async (values: z.infer<typeof ContactUserFormSchema>) => {
    if (!state.editor.liveMode) return

    try {
      const response = await createContact({
        ...values,
        subAccountId: subaccountId,
      })
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `A New contact signed up | ${response?.name}`,
        subAccountId: subaccountId,
      })
      toast({
        title: 'Success',
        description: 'Successfully Saved your info',
      })
      await goToNextPage()
    } catch (error) {
      console.log('contact upsert error : ', error)
      toast({
        variant: 'destructive',
        title: 'Failed to Save contact',
        description: 'Could not save your information!',
      })
    }
  }

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, 'contactForm')}
      onClick={handleOnClickBody}
      className={cn('relative m-[5px] flex w-full items-center justify-center p-[2px] text-[16px] transition-all', {
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
      <ContactForm subTitle='Contact Us' title='Want a free quote? We can help you' apiCall={onSubmit} />
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className='absolute -right-[1px] -top-[25px] rounded-none rounded-t-lg bg-primary px-2.5 py-1 text-xs font-bold !text-white'>
          <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  )
}

export default ContactFormComponent
