import { ReactNode, useState, useEffect } from 'react'
import { ChevronRight, FlaskConical, GraduationCap, Info as InfoIcon, Settings2, Star } from 'lucide-react'

import { Sidebar } from '..'
import { useEvent } from '/src/hooks'

import { Wrapper, Panel, Heading, CloseButton } from './sidepanelStyle'
import { TestingLab, Info, Options, Templates, Modules } from './Panels'
import { SidebarButton } from '/src/components/Sidebar/Sidebar'
import { stopTemplateInsert } from './Panels/Templates/Templates'

import { useTemplateStore, useToolStore, useSteppingStore, useProjectStore } from '/src/stores'

import { dispatchCustomEvent } from '/src/util/events'

type PanelItem = {
  label: string
  value: string
  icon: ReactNode
  element: ReactNode
}

const panels: PanelItem[] = [
  {
    label: 'Testing Lab',
    value: 'test',
    icon: <FlaskConical />,
    element: <TestingLab />
  },
  /*
  {
    label: 'Stepping Lab',
    value: 'step',
    icon: <Pause />,
    element: <SteppingLab />
  },
  */
  {
    label: 'About Your Automaton',
    value: 'about',
    icon: <InfoIcon />,
    element: <Info />
  },
  {
    label: 'File Options',
    value: 'options',
    icon: <Settings2 />,
    element: <Options />
  },
  {
    label: 'Templates',
    value: 'templates',
    icon: <Star />,
    element: <Templates />
  },
  {
    label: 'Modules',
    value: 'modules',
    icon: <GraduationCap/>,
    element: <Modules />
  }
]

const Sidepanel = ({ onToggle }) => {
  const [activePanel, setActivePanel] = useState<PanelItem | undefined>()
  const setTemplate = useTemplateStore((s) => s.setTemplate)
  const setTool = useToolStore((s) => s.setTool)
  const setSteppedStates = useSteppingStore((s) => s.setSteppedStates)
  const projectType = useProjectStore((s) => s.project.config.type)

  const cleanupPanel = () => {
    stopTemplateInsert(setTemplate, setTool)
    setSteppedStates([])
    dispatchCustomEvent('bottomPanel:close', null)
    dispatchCustomEvent('stackVisualiser:toggle', { state: false })
  }

  const handleToggle = (panel: PanelItem) => {
    const isSamePanel = activePanel?.value === panel.value

    // Cleanup the previous panel regardless of the state
    cleanupPanel()

    if (isSamePanel) {
      // If the same panel is clicked, close it
      setActivePanel(undefined)
      onToggle(false) // Close side panel
    } else {
      // If a different panel is clicked, open it
      setActivePanel(panel)
      onToggle(true) // Open side panel
    }
  }

  useEvent('sidepanel:open', (e) => {
    const panel = panels.find((p) => p.value === e.detail.panel)
    handleToggle(panel)
  }, [activePanel])

  useEffect(() => {
    if (projectType === 'TM' && activePanel?.value === 'test') {
      dispatchCustomEvent('bottomPanel:open', { panel: 'tmTape' })
    } else {
      dispatchCustomEvent('bottomPanel:close', null)
    }
  }, [activePanel])

  const handleClose = () => {
    cleanupPanel()
    setActivePanel(undefined)
    onToggle() // Ensure this is correctly toggling the state
  }

  useEffect(() => {
    if (projectType === 'PDA' && activePanel?.value === 'test') {
      dispatchCustomEvent('stackVisualiser:toggle', { state: true })
    } else {
      dispatchCustomEvent('stackVisualiser:toggle', { state: false })
    }
  }, [activePanel])

  return (
    <Wrapper>
      {activePanel && (
        <>
          <CloseButton onClick={handleClose}>
            <ChevronRight />
          </CloseButton>
          <Panel>
            <div>
              <Heading>{activePanel?.label}</Heading>
              {activePanel?.element}
            </div>
          </Panel>
        </>
      )}

      <Sidebar>
        {panels.map((panel) => (
          <SidebarButton
            key={panel.value}
            onClick={() => handleToggle(panel)}
            $active={activePanel?.value === panel.value}
            title={panel.label}
          >
            {panel.icon}
          </SidebarButton>
        ))}
      </Sidebar>
    </Wrapper>
  )
}

export default Sidepanel
