import { useState } from 'react'
import { ChevronRight, FlaskConical, Info as InfoIcon, Settings2 } from 'lucide-react'

import { Sidebar } from '..'
import { useEvent } from '/src/hooks'

import { Wrapper, Panel, Heading, CloseButton } from './sidepanelStyle'
import { TestingLab, Info, Options, StackDisplay } from './Panels'

// import {StackDisplay} from './Panels'

const panels = [
  {
    label: 'Testing Lab',
    value: 'test',
    icon: <FlaskConical />,
    element: <TestingLab />,
  },
  {
    label: 'About Your Automaton',
    value: 'about',
    icon: <InfoIcon />,
    element: <Info />,
  },
  {
    label: 'File Options',
    value: 'options',
    icon: <Settings2 />,
    element: <Options />,
  },
  {
    label: 'Stack Visualiser',
    value: 'showstack',
    icon: <InfoIcon />,
    element: <StackDisplay />,
  },
]

const Sidepanel = () => {
  const [activePanel, setActivePanel] = useState()

  // Open panel via event
  useEvent('sidepanel:open', e => {
    const panel = panels.find(p => p.value === e.detail.panel)
    setActivePanel(activePanel?.value === panel.value ? undefined : panel)
  }, [activePanel])

  return (
    <Wrapper>
      {activePanel && (
        <>
          <CloseButton
            onClick={() => setActivePanel(undefined)}
          ><ChevronRight /></CloseButton>
          <Panel>
            <div>
              <Heading>{activePanel?.label}</Heading>
              {activePanel?.element}
            </div>
          </Panel>
        </>
      )}

      <Sidebar>
        {panels.map(panel => (
          <Sidebar.Button
            key={panel.value}
            onClick={() => setActivePanel(activePanel?.value === panel.value ? undefined : panel)}
            $active={activePanel?.value === panel.value}
            title={panel.label}
          >
            {panel.icon}
          </Sidebar.Button>
        ))}
      </Sidebar>
    </Wrapper>
  )
}

export default Sidepanel
