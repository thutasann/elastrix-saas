import { EditorState, HistoryState } from './editor-types'

/**
 * Initial Editor State
 */
export const initialEditorState: EditorState['editor'] = {
  elements: [
    {
      content: [],
      id: '__body',
      name: 'Body',
      styles: {},
      type: '__body',
    },
  ],
  selectedElement: {
    id: '',
    content: [],
    name: '',
    styles: {},
    type: null,
  },
  device: 'Desktop',
  previewMode: false,
  liveMode: false,
  funnelPageId: '',
}

/**
 * Inital History State
 */
export const initalHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
}

/**
 * Inital State for Editor Context
 */
export const initialState: EditorState = {
  editor: initialEditorState,
  history: initalHistoryState,
}
