import React from 'react'
import { EditorElement } from '@/providers/editor/editor-types'
import TextComponent from './text-component'
import Container from './container'
import VideoComponenet from './video-component'
import ContactFormComponent from './contact-form-component'
import Checkout from './checkout'
import LinkComponent from './link-component'

interface IRecursiveFunnelEditorComponents {
  element: EditorElement
}

function RecursiveFunnelEditorComponents({ element }: IRecursiveFunnelEditorComponents) {
  switch (element.type) {
    case 'text':
      return <TextComponent element={element} />
    case 'container':
      return <Container element={element} />
    case 'video':
      return <VideoComponenet element={element} />
    case 'contactForm':
      return <ContactFormComponent element={element} />
    case 'paymentForm':
      return <Checkout element={element} />
    case '2Col':
      return <Container element={element} />
    case '__body':
      return <Container element={element} />
    case 'link':
      return <LinkComponent element={element} />
    default:
      return null
  }
}

export default RecursiveFunnelEditorComponents
