import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content, EditorContent } from './editorStyle'
import { BottomPanel, EditorPanel, Menubar, Sidepanel, Toolbar, ExportImage, ImportDialog, ShareUrl, ShortcutGuide, FinalStatePopup } from '/src/components'
import { useActions, useEvent } from '/src/hooks'
import { useExportStore, useProjectStore, useToolStore, useViewStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'

import PDAStackVisualiser from '../../components/PDAStackVisualiser/stackVisualiser'
import { useAutosaveProject } from '../../hooks'
import TemplateDelConfDialog from './components/TemplateDelConfDialog/TemplateDelConfDialog'
import { Tool } from '/src/stores/useToolStore'
import EditorPageTour from '../Tutorials/guidedTour/EditorPageTour'

const Editor = () => {
  const navigate = useNavigate()
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState<Tool>()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const resetExportSettings = useExportStore(s => s.reset)
  const setViewPositionAndScale = useViewStore(s => s.setViewPositionAndScale)
  const project = useProjectStore(s => s.project)
  const [showTour, setShowTour] = useState(false)
  const closeTour = () => {
    setShowTour(false)
  }

  useEffect(() => {
    const tourShown = localStorage.getItem('tourEditorShown')
    if (!tourShown) {
    // Set showTour to true after a delay (for demonstration purposes)
      const timeoutId = setTimeout(() => {
        setShowTour(true)
      }, 1000) // Adjust the delay as needed
      localStorage.setItem('tourEditorShown', 'true')
      // Clean up the timeout on component unmount
      return () => clearTimeout(timeoutId)
    }
  }, [])

  // Check the user has selected a project, navigate to creation page if not
  if (!project) {
    navigate('/new')
    return null
  }
  const projectType = project.config.type

  // Auto save project as its edited
  const isSaving = useAutosaveProject()

  // Register action hotkey
  useActions(true)

  // Project must be set
  useEffect(() => {
    resetExportSettings()
    setViewPositionAndScale({ x: 0, y: 0 }, 1)
  }, [])
  // Change tool when holding certain keys
  useEvent('keydown', e => {
    // Hotkeys are disabled if an input is focused
    if (haveInputFocused(e)) return

    if (!priorTool && e.code === 'Space') {
      setPriorTool(tool)
      setTool('hand')
    }
    if (e.code === 'Space') {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [tool, priorTool])

  useEvent('keyup', e => {
    // Hotkeys are disabled if an input is focused
    if (haveInputFocused(e)) return

    if (priorTool && e.code === 'Space') {
      setTool(priorTool)
      setPriorTool(undefined)
    }
    if (e.code === 'Space') {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [tool, priorTool])

  // Middle mouse pan
  useEvent('svg:mousedown', e => {
    if (!priorTool && e.detail.originalEvent.button === 1) {
      setPriorTool(tool)
      setTool('hand')
    }
  }, [tool, priorTool])

  useEvent('svg:mouseup', e => {
    if (priorTool && e.detail.originalEvent.button === 1) {
      setTool(priorTool)
      setPriorTool(undefined)
    }
  }, [tool, priorTool])

  return (
    <>
      <Menubar isSaving={isSaving} />
      <Content>
        <Toolbar />
        <EditorContent>
          <EditorPanel />
          <BottomPanel />
        </EditorContent>
        {(projectType === 'PDA') &&
          <PDAStackVisualiser />
        }
        <Sidepanel />

      </Content>

      <ShortcutGuide />

      <FinalStatePopup />

      <ExportImage />
      <ShareUrl />

      <TemplateDelConfDialog
        isOpen={confirmDialogOpen}
        setOpen={() => setConfirmDialogOpen(true)}
        setClose={() => setConfirmDialogOpen(false)}
      />

      <ImportDialog navigateFunction={navigate} />
      {showTour && <EditorPageTour onClose={closeTour}/>}
    </>
  )
}

export default Editor
