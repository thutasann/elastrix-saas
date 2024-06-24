import { EditorElement } from '@/providers/editor/editor-types'
import React from 'react'

interface IContainer {
  element: EditorElement
}

function Container({ element }: IContainer) {
  return <div>Container</div>
}

export default Container
