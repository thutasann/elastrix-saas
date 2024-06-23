'use client'

import React, { Dispatch, createContext, useContext, useReducer } from 'react'
import { EditorAction, EditorState } from './editor-types'
import { FunnelPage } from '@prisma/client'
import { initialState } from './editor-states'
import { editorReducer } from './editor-actions'

export const EditorContext = createContext<{
  state: EditorState
  dispatch: Dispatch<EditorAction>
  subaccountId: string
  funnelId: string
  pageDetails: FunnelPage | null
}>({
  state: initialState,
  dispatch: () => undefined,
  subaccountId: '',
  funnelId: '',
  pageDetails: null,
})

interface IEditorProvider {
  children: React.ReactNode
  subaccountId: string
  funnelId: string
  pageDetails: FunnelPage
}

function EditorProvider({ children, subaccountId, funnelId, pageDetails }: IEditorProvider) {
  const [state, dispatch] = useReducer(editorReducer, initialState)
  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        subaccountId,
        funnelId,
        pageDetails,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

/**
 * useEditor hook for  Editor Provider
 */
export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor Hook must be uesd within the editor provider')
  }
  return context
}

export default EditorProvider
