'use client'

import React from 'react'
import { EditorElement } from '@/providers/editor/editor-types'
import { useEditor } from '@/providers/editor/editor-provider'

interface ILinkComponent {
  element: EditorElement
}

function LinkComponent({ element }: ILinkComponent) {
  const { dispatch, state } = useEditor()
  const styles = element.styles

  return <div>LinkComponent</div>
}

export default LinkComponent
