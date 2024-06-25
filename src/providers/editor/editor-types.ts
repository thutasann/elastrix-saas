import { EditorBtns } from '@/dto/types/globals'
import React from 'react'

export type DeviceTypes = 'Desktop' | 'Mobile' | 'Tablet'

/**
 * Editor Element Props
 */
export type EditorElement = {
  /** element id */
  id: string
  /** element styles */
  styles: React.CSSProperties
  /** element name */
  name: string
  /** editor buttonss */
  type: EditorBtns
  /** element content */
  content: EditorElement[] | { href?: string; innerText?: string; src?: string }
}

/**
 * Editor Type Props
 */
export type Editor = {
  liveMode: boolean
  elements: EditorElement[]
  selectedElement: EditorElement
  device: DeviceTypes
  previewMode: boolean
  funnelPageId: string
}

/**
 * History State Props
 */
export type HistoryState = {
  history: Editor[]
  currentIndex: number
}

/**
 * Editor State Props
 */
export type EditorState = {
  editor: Editor
  history: HistoryState
}

/**
 * Editor Context Data Props
 */
export type EditorcontextData = {
  device: DeviceTypes
  previewMode: boolean
  setPreviewMode: (previewMode: boolean) => void
  setDevice: (device: DeviceTypes) => void
}

/**
 * Editor Action Props
 */
export type EditorAction =
  | {
      type: 'ADD_ELEMENT'
      payload: {
        containerId: string
        elementDetails: EditorElement
      }
    }
  | {
      type: 'UPDATE_ELEMENT'
      payload: {
        elementDetails: EditorElement
      }
    }
  | {
      type: 'DELETE_ELEMENT'
      payload: {
        elementDetails: EditorElement
      }
    }
  | {
      type: 'CHANGE_CLICKED_ELEMENT'
      payload: {
        elementDetails?:
          | EditorElement
          | {
              id: ''
              content: []
              name: ''
              styles: {}
              type: null
            }
      }
    }
  | {
      type: 'CHANGE_DEVICE'
      payload: {
        device: DeviceTypes
      }
    }
  | {
      type: 'TOGGLE_PREVIEW_MODE'
    }
  | {
      type: 'TOGGLE_LIVE_MODE'
      payload?: {
        value: boolean
      }
    }
  | { type: 'REDO' }
  | { type: 'UNDO' }
  | {
      type: 'LOAD_DATA'
      payload: {
        elements: EditorElement[]
        withLive: boolean
      }
    }
  | {
      type: 'SET_FUNNELPAGE_ID'
      payload: {
        funnelPageId: string
      }
    }
