import React from 'react'
import { EditorElement } from '@/providers/editor/editor-types'

interface ILinkComponent {
  element: EditorElement
}

function LinkComponent({ element }: ILinkComponent) {
  return <div>LinkComponent</div>
}

export default LinkComponent
