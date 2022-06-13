import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useProjectStore, useProjectsStore, useSelectionStore, useViewStore, useToolStore } from '/src/stores'
import { VIEW_MOVE_STEP, SCROLL_MAX, SCROLL_MIN } from '/src/config/interactions'
import { convertJFLAPXML } from '@automatarium/jflap-translator'
import { haveInputFocused } from '/src/util/actions'
import { dispatchCustomEvent } from '/src/util/events'
import { createNewProject } from '/src/stores/useProjectStore'

const isWindows = navigator.platform.match(/Win/)
export const formatHotkey = ({ key, meta, alt, shift, showCtrl = isWindows }) => [
  meta && (showCtrl ? (isWindows ? 'Ctrl' : '⌃') : '⌘'),
  alt && (isWindows ? 'Alt' : '⌥'),
  shift && (isWindows ? 'Shift' : '⇧'),
  key?.toUpperCase(),
].filter(Boolean)

const useActions = (registerHotkeys=false) => {
  const undo = useProjectStore(s => s.undo)
  const redo = useProjectStore(s => s.redo)
  const selectNone = useSelectionStore(s => s.selectNone)
  const selectAll = useSelectionStore(s => s.selectAll)
  const setStateInitial = useProjectStore(s => s.setStateInitial)
  const toggleStatesFinal = useProjectStore(s => s.toggleStatesFinal)
  const flipTransitions = useProjectStore(s => s.flipTransitions)
  const removeStates = useProjectStore(s => s.removeStates)
  const removeComments = useProjectStore(s => s.removeComments)
  const removeTransitions = useProjectStore(s => s.removeTransitions)
  const commit = useProjectStore(s => s.commit)
  const setProject = useProjectStore(s => s.set)
  const setLastSaveDate = useProjectStore(s => s.setLastSaveDate)
  const upsertProject = useProjectsStore(s => s.upsertProject)
  const moveView = useViewStore(s => s.moveViewPosition)
  const createComment = useProjectStore(s => s.createComment)
  const createState = useProjectStore(s => s.createState)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const setTool = useToolStore(s => s.setTool)

  const navigate = useNavigate()

  // TODO: memoize
  const actions = {
    NEW_FILE: {
      handler: () => navigate('/new'),
    },
    IMPORT_AUTOMATARIUM_PROJECT: {
      hotkey: { key: 'i', meta: true },
      handler: async () => {
        if (window.confirm('Importing will override your current project. Continue anyway?'))
          promptLoadFile(JSON.parse, setProject, 'Failed to open automatarium project')
     },
    },
    IMPORT_JFLAP_PROJECT: {
      hotkey: { key: 'i', meta: true, shift: true },
      handler: async () => {
        if (window.confirm('Importing will override your current project. Continue anyway?'))
          promptLoadFile(convertJFLAPXML, setProject, 'Failed to open JFLAP project')
     },
    },
    SAVE_FILE: {
      hotkey: { key: 's', meta: true },
      handler: () => {
        const project = useProjectStore.getState().project
        const toSave = {...project, meta: { ...project.meta, dateEdited: new Date() }}
        upsertProject(toSave)
        setLastSaveDate(new Date())
      },
    },
    SAVE_FILE_AS: {
      hotkey: { key: 's', shift: true, meta: true },
      handler: () => {
        // Pull project state
        const { project } = useProjectStore.getState()

        // Create a download link and use it
        const a = document.createElement('a')
        const file = new Blob([JSON.stringify(project, null, 2)], {type: 'application/json'})
        a.href = URL.createObjectURL(file)
        a.download = project.meta.name.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '') // TODO: prompt file location - might not be possible?
        a.click()
      },
    },
    EXPORT_AS_PNG: {
      hotkey: { key: 'e', shift: true, meta: true, showCtrl: true },
      handler: () => dispatchCustomEvent('exportImage', { type: 'png' }),
    },
    EXPORT_AS_SVG: {
      hotkey: { key: 'e', shift: true, alt: true, meta: true},
      handler: () => dispatchCustomEvent('exportImage', { type: 'svg' }),
    },
    EXPORT_AS_JPG: {
      handler: () => dispatchCustomEvent('exportImage', { type: 'jpg' }),
    },
    EXPORT_AS_JFLAP: {
      //handler: () => console.log('Export JFLAP'),
    },
    OPEN_PREFERENCES: {
      hotkey: { key: ',', meta: true },
      handler: () => dispatchCustomEvent('modal:preferences'),
    },
    UNDO: {
      hotkey: { key: 'z', meta: true },
      handler: undo,
    },
    REDO: {
      hotkey: { key: 'y', meta: true },
      handler: redo,
    },
    COPY: {
      hotkey: { key: 'c', meta: true },
      //handler: () => console.log('Copy'),
    },
    PASTE: {
      hotkey: { key: 'v', meta: true },
      //handler: () => console.log('Paste'),
    },
    SELECT_ALL: {
      hotkey: { key: 'a', meta: true },
      handler: selectAll,
    },
    SELECT_NONE: {
      hotkey: { key: 'd', meta: true },
      handler: selectNone,
    },
    DELETE: {
      hotkey: [{ key: 'Delete' }, { key: 'Backspace' }],
      handler: () => {
        const selectionState = useSelectionStore.getState()
        const selectedStateIDs = selectionState.selectedStates
        const selectedTransitionIDs = selectionState.selectedTransitions
        const selectedCommentIDs = selectionState.selectedComments
        if (selectedStateIDs.length > 0 || selectedTransitionIDs.length > 0 || selectedCommentIDs.length > 0) {
          removeStates(selectedStateIDs)
          removeTransitions(selectedTransitionIDs)
          removeComments(selectedCommentIDs)
          selectNone()
          commit()
        }
      },
    },
    ZOOM_IN: {
      hotkey: { key: '=', meta: true },
      handler: () => zoomViewTo(useViewStore.getState().scale - .1),
    },
    ZOOM_OUT: {
      hotkey: { key: '-', meta: true },
      handler: () => zoomViewTo(useViewStore.getState().scale + .1),
    },
    ZOOM_100: {
      hotkey: { key: '0', meta: true },
      handler: () => { zoomViewTo(1) },
    },
    ZOOM_FIT: {
      hotkey: { key: 'f', shift: true },
      handler: () => {
        // Get state
        const view = useViewStore.getState()

        // Padding around view
        const border = 20

        // Get the bounding box of the SVG group
        const b = document.getElementById('automatarium-graph').getBBox()
        const [x, y, width, height] = [b.x - border, b.y - border, b.width + border*2, b.height + border*2]

        // Calculate fit region
        const desiredScale = Math.max(
          width / view.size.width,
          height / view.size.height
        )
        view.setViewScale(desiredScale)
        // Calculate x and y to centre graph
        view.setViewPosition({
          x: x - (view.size.width - width / desiredScale)/2,
          y: y - (view.size.height - height / desiredScale)/2,
        })
      },
    },
    FULLSCREEN: {
      handler: () => document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen(),
    },
    TESTING_LAB: {
      hotkey: { key: '1', shift: true },
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'test' }),
    },
    FILE_INFO: {
      hotkey: { key: '2', shift: true },
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'about' }),
    },
    FILE_OPTIONS: {
      hotkey: { key: '3', shift: true },
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'options' }),
    },
    CONVERT_TO_DFA: {
      //handler: () => console.log('Convert to DFA'),
    },
    MINIMIZE_DFA: {
      //handler: () => console.log('Minimize DFA'),
    },
    AUTO_LAYOUT: {
      //handler: () => console.log('Auto Layout'),
    },
    OPEN_DOCS: {
      handler: () => window.open('https://github.com/automatarium/automatarium/wiki', '_blank'),
    },
    KEYBOARD_SHORTCUTS: {
      hotkey: { key: '/', meta: true },
      handler: () => dispatchCustomEvent('modal:shortcuts'),
    },
    PRIVACY_POLICY: {
      handler: () => window.open('/privacy', '_blank'),
    },
    OPEN_ABOUT: {
      handler: () => window.open('/about', '_blank'),
    },
    MOVE_VIEW_LEFT: {
      hotkey: { key: 'ArrowLeft' },
      handler: () => moveView({ x: -VIEW_MOVE_STEP })
    },
    MOVE_VIEW_RIGHT: {
      hotkey: { key: 'ArrowRight' },
      handler: () => moveView({ x: VIEW_MOVE_STEP })
    },
    MOVE_VIEW_UP: {
      hotkey: { key: 'ArrowUp' },
      handler: () => moveView({ y: -VIEW_MOVE_STEP })
    },
    MOVE_VIEW_DOWN: {
      hotkey: { key: 'ArrowDown' },
      handler: () => moveView({ y: VIEW_MOVE_STEP })
    },
    SET_STATE_INITIAL: {
      disabled: () => useSelectionStore.getState()?.selectedStates?.length !== 1,
      handler: () => {
        const selectedState = useSelectionStore.getState().selectedStates?.[0]
        if (selectedState !== undefined) {
          setStateInitial(selectedState)
          commit()
        }
      }
    },
    TOGGLE_STATES_FINAL: {
      handler: () => {
        const selectedStateIDs = useSelectionStore.getState().selectedStates
        if (selectedStateIDs.length > 0) {
          toggleStatesFinal(selectedStateIDs)
          commit()
        }
      }
    },
    EDIT_COMMENT: {
      disabled: () => useSelectionStore.getState()?.selectedComments?.length !== 1,
      handler: () => {
        const selectedCommentID = useSelectionStore.getState().selectedComments?.[0]
        const selectedComment = useProjectStore.getState().project?.comments.find(cm => cm.id === selectedCommentID)
        if (selectedCommentID === undefined || selectedComment === undefined) return
        const text = window.prompt('New text for comment?', selectedComment.text)
        if (/^\s*$/.test(text)) return
        useProjectStore.getState().updateComment({ ...selectedComment, text })
        commit()
      }
    },
    EDIT_TRANSITION: {
      disabled: () => useSelectionStore.getState()?.selectedTransitions?.length !== 1,
      handler: () => {
        const selectedTransition = useSelectionStore.getState().selectedTransitions?.[0]
        if (selectedTransition === undefined) return
        window.setTimeout(() => dispatchCustomEvent('editTransition', { id: selectedTransition }), 100)
      }
    },
    FLIP_TRANSITION: {
      handler: () => {
        const selectedTransitions = useSelectionStore.getState().selectedTransitions
        if (selectedTransitions === undefined || selectedTransitions?.length === 0) return
        flipTransitions(selectedTransitions)
        commit()
      }
    },
    CREATE_COMMENT: {
      handler: e => {
        const text = window.prompt('Text of comment?')
        if (/^\s*$/.test(text)) return
        const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
        createComment({ x: viewX, y: viewY, text })
        commit()
      }
    },
    CREATE_STATE: {
      handler: e => {
        const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
        createState({ x: viewX, y: viewY })
        commit()
      }
    },
    ALIGN_STATES_HORIZONTAL: {
      disabled: () => useSelectionStore.getState()?.selectedStates?.length <= 1,
      handler: () => {
        const selected = useSelectionStore.getState().selectedStates
        const storeState = useProjectStore.getState()
        const states = storeState?.project?.states?.filter(s => selected.includes(s.id))
        if (states && states.length > 1) {
          const meanY = states.map(state => state.y).reduce((a, b) => a + b) / states.length
          states.forEach(state => storeState.updateState({ ...state, y: meanY }))
          commit()
        }
      }
    },
    ALIGN_STATES_VERTICAL: {
      disabled: () => useSelectionStore.getState()?.selectedStates?.length <= 1,
      handler: () => {
        const selected = useSelectionStore.getState().selectedStates
        const storeState = useProjectStore.getState()
        const states = storeState?.project?.states?.filter(s => selected.includes(s.id))
        if (states && states.length > 1) {
          const meanX = states.map(state => state.x).reduce((a, b) => a + b) / states.length
          states.forEach(state => storeState.updateState({ ...state, x: meanX }))
          commit()
        }
      }
    },
    TOOL_CURSOR: {
      hotkey: { key: 'V' },
      handler: () => setTool('cursor'),
    },
    TOOL_HAND: {
      hotkey: { key: 'H' },
      handler: () => setTool('hand'),
    },
    TOOL_STATE: {
      hotkey: { key: 'S' },
      handler: () => setTool('state'),
    },
    TOOL_TRANSITION: {
      hotkey: { key: 'T' },
      handler: () => setTool('transition'),
    },
    TOOL_COMMENT: {
      hotkey: { key: 'C' },
      handler: () => setTool('comment'),
    },
  }

  // Register action hotkeys
  useEffect(() => {
    if (registerHotkeys) {
      const handleKeyDown = e => {
        // Hotkeys are disabled if an input is focused
        if (haveInputFocused(e)) return

        // Check hotkeys
        for (let action of Object.values(actions)) {
          // Skip if no hotkey
          if (!action.hotkey)
            continue

          // Skip if disabled
          if (action.disabled && action.disabled())
            continue

          const hotkeys = Array.isArray(action.hotkey) ? action.hotkey : [action.hotkey]
          const activeHotkey = hotkeys.find(hotkey => {
            // Guard against other keys
            const letterMatch = e.code === `Key${hotkey.key.toUpperCase()}`
            const digitMatch = e.code === `Digit${hotkey.key}`
            const keyMatch = e.key === hotkey.key
            if (!(letterMatch || digitMatch || keyMatch))
                return false

            // Check augmenting keys
            if ((hotkey.meta || false) !== (e.metaKey || e.ctrlKey))
              return false
            if ((hotkey.alt || false) !== e.altKey)
              return false
            if ((hotkey.shift || false) !== e.shiftKey)
              return false

            return true
          })

          // Prevent default and exec callback
          if (activeHotkey) {
            e.preventDefault()
            e.stopPropagation()
            action.handler(e)
            break
          }
        }
      }

      // Add listener
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [actions])

  // Add formatted hotkeys to actions
  const actionsWithLabels = useMemo(() => Object.fromEntries(Object.entries(actions).map(([key, action]) => ([key, {
    ...action,
    label: action.hotkey ? formatHotkey(Array.isArray(action.hotkey) ? action.hotkey[0] : action.hotkey).join(isWindows ? '+' : ' ') : null
  }]))), [actions])

  return actionsWithLabels
}

const zoomViewTo = to => {
  const view = useViewStore.getState()
  if (view.scale === to)
    return
  const newScale = Math.min(SCROLL_MAX, Math.max(SCROLL_MIN, to))
  const scrollAmount = newScale - view.scale
  if (Math.abs(scrollAmount) < 1e-3) {
    view.setViewScale(to < 1 ? SCROLL_MIN : SCROLL_MAX)
    return
  } else {
    view.setViewPosition({
      x: view.position.x - view.size.width/2 * scrollAmount,
      y: view.position.y - view.size.height/2 * scrollAmount,
    })
    view.setViewScale(newScale)
  }
}


const promptLoadFile = (parse, onData, errorMessage='Failed to parse file') => {
  // Prompt user for file input
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = () => {
    // Read file data
    const reader = new FileReader()
    reader.onloadend = () => { 
      try {
        const fileData = parse(reader.result)
        const project = {
          ...createNewProject(),
          ...fileData,
        }
        onData({
          ...project,
          meta: {
            ...project.meta,
            name: input.files[0]?.name.split('.').slice(0, -1).join('.')
          }
        })
      } catch (error) {
        window.alert(`${errorMessage}\n${error}`)
        console.error(error)
      }
    }
    reader.readAsText(input.files[0])
  }
  input.click()
}

export default useActions
