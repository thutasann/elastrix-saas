import type { Editor, EditorAction, EditorElement, EditorState } from './editor-types'
import { initialState, initialEditorState } from './editor-states'

/** add element */
const addAnElement = (editorArray: EditorElement[], action: EditorAction): EditorElement[] => {
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

/** update element */
const updateAnElement = (editorArray: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== 'UPDATE_ELEMENT') {
    throw Error('You sent the wrong action type to the update Element State')
  }
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return { ...item, ...action.payload.elementDetails }
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      }
    }
    return item
  })
}

/** delete element */
const deleteAnElement = (editorArray: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== 'DELETE_ELEMENT') {
    throw Error('You sent the wrong action type to the Delete Element editor State')
  }
  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action)
    }
    return true
  })
}

/** editor reducer */
export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'ADD_ELEMENT':
      const updatedEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      }
      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState },
      ]
      const newEditorState: EditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      }
      return newEditorState

    case 'UPDATE_ELEMENT':
      const updatedElements = updateAnElement(state.editor.elements, action)

      const UpdatedElementIsSelected = state.editor.selectedElement.id === action.payload.elementDetails.id

      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: UpdatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: '',
              content: [],
              name: '',
              styles: {},
              type: null,
            },
      }

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate }, // Save a copy of the updated state
      ]

      const updatedEditor: EditorState = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      }
      return updatedEditor

    case 'DELETE_ELEMENT':
      const updatedElementsAfterDelete = deleteAnElement(state.editor.elements, action)
      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: updatedElementsAfterDelete,
      }
      const updatedHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateAfterDelete },
      ]

      const deletedState: EditorState = {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          ...state.history,
          history: updatedHistoryAfterDelete,
          currentIndex: updatedHistoryAfterDelete.length - 1,
        },
      }

      return deletedState

    case 'CHANGE_CLICKED_ELEMENT':
      const clickedState: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: '',
            content: [],
            name: '',
            styles: {},
            type: null,
          },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor }, // Save a copy of the current editor state
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      }
      return clickedState

    case 'CHANGE_DEVICE':
      const changedDeviceState: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      }
      return changedDeviceState

    case 'TOGGLE_PREVIEW_MODE':
      const toggleState: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      }
      return toggleState

    case 'TOGGLE_LIVE_MODE':
      const toggleLiveMode: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload ? action.payload.value : !state.editor.liveMode,
        },
      }
      return toggleLiveMode

    case 'REDO':
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1
        const nextEditorState = {
          ...state.history.history[nextIndex],
        }
        const redoState: EditorState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        }
        return redoState
      }
      return state

    case 'UNDO':
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1
        const prevEditorState = { ...state.history.history[prevIndex] }
        const undoState: EditorState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        }
        return undoState
      }

      return state

    case 'LOAD_DATA':
      const loadDataState: EditorState = {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
        },
      }
      return loadDataState

    case 'SET_FUNNELPAGE_ID':
      const { funnelPageId } = action.payload
      const updatedEditorStateWithFunnelPageId: Editor = {
        ...state.editor,
        funnelPageId,
      }
      const updatedHistoryStateWithFunnelPageId: Editor[] = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithFunnelPageId },
      ]

      const funnelPageIdState: EditorState = {
        ...state,
        editor: updatedEditorStateWithFunnelPageId,
        history: {
          ...state.history,
          history: updatedHistoryStateWithFunnelPageId,
          currentIndex: updatedHistoryStateWithFunnelPageId.length - 1,
        },
      }
      return funnelPageIdState

    default:
      return state
  }
}
