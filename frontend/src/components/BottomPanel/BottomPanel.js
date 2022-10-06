import { useState } from 'react'
import { ChevronRight, FlaskConical, Pause, Info as InfoIcon, Settings2 } from 'lucide-react'

import { Sidebar } from '..'
import { useEvent } from '/src/hooks'

import { Wrapper, Panel, Heading, CloseButton } from './bottomPanelStyle'
import { TMTapeLab } from './Panels'

const panels = [
        {
        label: 'TMTapeLab',
        value: 'tmTape',
        element: <TMTapeLab />
        }
    ]

const BottomPanel = () => {
    const [activePanel, setActivePanel] = useState()

    // Open panel via event
    useEvent('bottomPanel:open', e => {
        console.log("Opening bottom panel!")
        const panel = panels.find(p => p.value === e.detail.panel)
        setActivePanel(activePanel?.value === panel.value ? undefined : panel)
    }, [activePanel])

    useEvent('bottomPanel:close', e => {
        setActivePanel(undefined)
    }, [activePanel])

    return (
        <Wrapper>
            {activePanel && (
                <Panel>
                    <div>
                        <Heading>{activePanel?.label}</Heading>
                        {activePanel?.element}
                    </div>
                </Panel>
            )}
        </Wrapper>

    )
}

export default BottomPanel
