import React, { useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { EditorBtns } from '@/dto/types/globals'
import TextPlaceholder from './text-placeholder'
import ContainerPlaceholder from './container-placeholder'
import TwoColumnPlaceholder from './two-columns-placeholder'
import VideoPlaceholder from './video-placeholder'
import ContactFormPlaceHolder from './contact-form-placeholder'
import CheckoutPlaceholder from './checkout-placeholder'
import LinkPlaceholder from './link-placeholder'

type ElementProps = {
  Component: React.ReactNode
  label: string
  id: EditorBtns
  group: 'layout' | 'elements'
}

function ComponentsTab() {
  const elements = useMemo<ElementProps[]>(() => {
    return [
      {
        Component: <TextPlaceholder />,
        label: 'Text',
        id: 'text',
        group: 'elements',
      },
      {
        Component: <ContainerPlaceholder />,
        label: 'Container',
        id: 'container',
        group: 'layout',
      },
      {
        Component: <TwoColumnPlaceholder />,
        label: '2 Columns',
        id: '2Col',
        group: 'layout',
      },
      {
        Component: <VideoPlaceholder />,
        label: 'Video',
        id: 'video',
        group: 'elements',
      },
      {
        Component: <ContactFormPlaceHolder />,
        label: 'Contact',
        id: 'contactForm',
        group: 'elements',
      },
      {
        Component: <CheckoutPlaceholder />,
        label: 'Checkout',
        id: 'paymentForm',
        group: 'elements',
      },
      {
        Component: <LinkPlaceholder />,
        label: 'Link',
        id: 'link',
        group: 'elements',
      },
    ]
  }, [])

  return (
    <Accordion type='multiple' className='w-full' defaultValue={['Layout', 'Elements']}>
      <AccordionItem value='Layout' className='border-y-[1px] px-6 py-0'>
        <AccordionTrigger className='!no-underline'>Layout</AccordionTrigger>
        <AccordionContent className='flex flex-wrap gap-2'>
          {elements
            .filter((element) => element.group === 'layout')
            .map((element) => (
              <div key={element.id} className='flex flex-col items-center justify-center'>
                {element.Component}
                <span className='text-muted-foreground'>{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Elements' className='px-6 py-0'>
        <AccordionTrigger className='!no-underline'>Elements</AccordionTrigger>
        <AccordionContent className='flex flex-wrap gap-2'>
          {elements
            .filter((element) => element.group === 'elements')
            .map((element) => (
              <div key={element.id} className='flex flex-col items-center justify-center'>
                {element.Component}
                <span className='text-muted-foreground'>{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ComponentsTab
