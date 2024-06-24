import React from 'react'
import { EditorElement } from '@/providers/editor/editor-types'

interface ITextComponent {
  element: EditorElement
}

function TextComponent({ element }: ITextComponent) {
  return <div>TextComponent</div>
}

export default TextComponent
