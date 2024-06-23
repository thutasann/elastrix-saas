import { Editor, EditorAction, EditorElement, EditorState } from './editor-types'

/** add element */
export const addAnElement = (editorArray: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== 'ADD_ELEMENT') {
    throw Error('You sent the wrong action type to the Add Element editor State')
  }
  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      }
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      }
    }
    return item
  })
}

/** editor reducer */
export const editorReducer = (state: EditorState, action: EditorAction) => {
  switch (action.type) {
    case 'ADD_ELEMENT':
      return state
    default:
      return state
  }
}
