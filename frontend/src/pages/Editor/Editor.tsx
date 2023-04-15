import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSyncCurrentProject, useActions, useEvent } from '/src/hooks'
import { useToolStore, useProjectStore, useExportStore, useViewStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'
import { Menubar, Sidepanel, Toolbar, EditorPanel, Spinner, BottomPanel } from '/src/components'
import { ShortcutGuide, ExportImage } from '/src/pages'
import { Content, LoadingContainer, EditorContent } from './editorStyle'

import PDAStackVisualiser from '../../components/PDAStackVisualiser/stackVisualiser'
import { useAutosaveProject } from '../../hooks'

const Editor = () => {
  const navigate = useNavigate()
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState()
  const resetExportSettings = useExportStore(s => s.reset)
  const setViewPositionAndScale = useViewStore(s => s.setViewPositionAndScale)
  const project = useProjectStore(s => s.project)
  // Check the user has selected a project, navigate to creation
  // page if not
  if (!project) {
    navigate('/new')
    return null
  }
  const projectType = project.config.type
  // Synchronize last-opened project with backend before showing it
  const loading = useSyncCurrentProject()

  // Auto save project as its edited
  useAutosaveProject()

  // Register action hotkey
  useActions(true)

  // Project must be set
  useEffect(() => {
    resetExportSettings()
    setViewPositionAndScale({ x: 0, y: 0 }, 1)
  }, [])
  // Change tool when holding certain keys
  useEvent('keydown', (e) => {
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

  if (loading) {
    return <LoadingContainer>
    <Spinner />
  </LoadingContainer>
  }

  return (
    <>
      <Menubar />
      <Content>
        <Toolbar />
        <EditorContent>
          <EditorPanel />
          {(projectType === 'TM') &&
            <BottomPanel />
          }
        </EditorContent>
        {(projectType === 'PDA') &&
            <PDAStackVisualiser/>
        }
        <Sidepanel />

      </Content>

      <ShortcutGuide />

      <ExportImage />

    </>
  )
}

export default Editor
