import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'

import { Content, EditorContent } from './editorStyle'
import { BottomPanel, EditorPanel, Menubar, Sidepanel, Toolbar, ExportImage, ImportDialog, ShareUrl, ShortcutGuide, FinalStatePopup, ShareUrlModule, CreateModule } from '/src/components'
import { useActions, useEvent } from '/src/hooks'
import { useExportStore, useModulesStore, useModuleStore, useProjectStore, useToolStore, useViewStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'

import PDAStackVisualiser from '../../components/PDAStackVisualiser/stackVisualiser'
import ModuleWindow from './components/ModuleWindow/ModuleWindow'
import { useAutosaveProject } from '../../hooks'
import TemplateDelConfDialog from './components/TemplateDelConfDialog/TemplateDelConfDialog'
import { Tool } from '/src/stores/useToolStore'
import EditorPageTour from '../Tutorials/guidedTour/EditorPageTour'
import TourButton from '/src/components/TourButton/TourButton'

const Editor = () => {
  const navigate = useNavigate()
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState<Tool>()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const resetExportSettings = useExportStore((s) => s.reset)
  const setViewPositionAndScale = useViewStore((s) => s.setViewPositionAndScale)
  const project = useProjectStore((s) => s.project)
  const [showTour, setShowTour] = useState(false)
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false)

  const closeTour = () => {
    setShowTour(false)
  }

  const showTourHandler = () => {
    setShowTour(true)
  }

  const currentModule = useModuleStore(s => s.module)
  const getProjectinModule = useModuleStore(s => s.getProjectById)
  const setModule = useModuleStore(s => s.setModule)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)
  const updateModule = useModulesStore(s => s.upsertModule)

  const [panelWidth, setPanelWidth] = useState(300) // Default panel width

  const handlePanelWidthChange = (newWidth) => {
    setPanelWidth(newWidth)
  }

  useEffect(() => {
    // Reset panel width when currentModule changes
    if (showModuleWindow) {
      setPanelWidth(300) // Reset to default width
    }
  }, [showModuleWindow])

  if (!project) {
    navigate('/new')
    return null
  }

  useEffect(() => {
    if (currentModule == null) {
      setShowModuleWindow(false)
    }
    if (currentModule && getProjectinModule(project._id) === undefined) {
      setModule(null)
      setShowModuleWindow(false)
    } else if (currentModule) {
      updateModule(currentModule)
    }
  }, [currentModule, project, getProjectinModule])

  const projectType = project.config.type
  const [buttonRight, setButtonRight] = useState('60px')

  // Adjust button position when side panel is toggled
  useEffect(() => {
    setButtonRight(isSidepanelOpen ? '410px' : '60px')
  }, [isSidepanelOpen])

  // Toggle side panel and update button position
  const handleSidepanelToggle = (isOpen) => {
    setIsSidepanelOpen(isOpen)
  }

  const isSaving = useAutosaveProject()

  useActions(true)

  useEffect(() => {
    resetExportSettings()
    setViewPositionAndScale({ x: 0, y: 0 }, 1)
  }, [])

  useEvent('keydown', (e) => {
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

  useEvent('keyup', (e) => {
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

  useEvent('svg:mousedown', (e) => {
    if (!priorTool && e.detail.originalEvent.button === 1) {
      setPriorTool(tool)
      setTool('hand')
    }
  }, [tool, priorTool])

  useEvent('svg:mouseup', (e) => {
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
        {showModuleWindow && currentModule && (
          <ModuleWindow onPanelWidthChange={handlePanelWidthChange} />
        )}
        <EditorContent>
          <EditorPanel />
          <BottomPanel />
        </EditorContent>
        {projectType === 'PDA' && <PDAStackVisualiser panelWidth={panelWidth} />}
        <Sidepanel onToggle={handleSidepanelToggle} />
      </Content>
      <ShortcutGuide />
      <FinalStatePopup />
      <ExportImage />
      <ShareUrl />
      <ShareUrlModule />

      <TemplateDelConfDialog
        isOpen={confirmDialogOpen}
        setOpen={() => setConfirmDialogOpen(true)}
        setClose={() => setConfirmDialogOpen(false)}
      />
      <TourButton
        icon={<HelpCircle />}
        onClick={showTourHandler}
        style={{ position: 'fixed', right: buttonRight, bottom: '20px' }} // Use calculated right position
      />
      <ImportDialog navigateFunction={navigate} />
      {showTour && <EditorPageTour onClose={closeTour} />}
      <CreateModule />
    </>
  )
}

export default Editor
