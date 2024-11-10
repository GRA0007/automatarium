import { useState } from 'react'
import { useEvent } from '/src/hooks'
import { Button, Modal, Input, TextArea } from '/src/components'
import { useProjectStore, useModuleStore } from '/src/stores'
import { ProjectType } from '/src/types/ProjectTypes'
import { createNewModule, createNewModuleProject, ModuleProject } from 'src/stores/useModuleStore'
import { useNavigate } from 'react-router-dom'
import { ColourName } from '/src/config'

const CreateModule = () => {
  const navigate = useNavigate()
  const setProject = useProjectStore(s => s.set)
  const setModule = useModuleStore(s => s.setModule)
  const addModuleProject = useModuleStore(s => s.upsertProject)
  const getModuleProject = useModuleStore(s => s.getProject)
  const addQuestion = useModuleStore(s => s.upsertQuestion)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)
  const currentProject = useProjectStore(s => s.project)
  // const addModule = useModulesStore(s => s.upsertModule)
  const [isModalOpen, setModalOpen] = useState(false)
  const [newModuleType, setModuleType] = useState<ProjectType>('FSA')
  const [moduleName, setModuleName] = useState('')
  const [moduleDescription, setModuleDescription] = useState('')
  const [project, setProjectforModule] = useState(false)

  useEvent('modal:createModule', e => {
    setModalOpen(true)
    setModuleType('FSA')
    setModuleName('')
    setModuleDescription('')
    setProjectforModule(e.detail.project)
  })

  const handleNewModuleFile = (project: ModuleProject) => {
    // Create a new module and module project
    const newModule = createNewModule()
    const newModuleProject = project ? JSON.parse(JSON.stringify(project)) : createNewModuleProject(newModuleType, moduleName)

    const pink: ColourName = 'pink'

    newModuleProject._id = crypto.randomUUID()
    newModuleProject.config.color = pink

    if (moduleName === '') {
      newModule.meta.name = 'Untitled Module'
      newModuleProject.meta.name = 'Untitled Module'
    } else {
      newModule.meta.name = moduleName
      newModuleProject.meta.name = moduleName
    }

    newModule.description = moduleDescription

    // Set the new module and module project
    setModule(newModule)
    addModuleProject(newModuleProject)

    // Add question to module
    addQuestion(newModuleProject._id, '')

    // Set module project for editor
    setProject(getModuleProject(0))

    // Show module window when navigating to editor
    if (showModuleWindow === false) {
      setShowModuleWindow(true)
    }
    setModalOpen(false)
    // Go to the editor
    navigate('/editor')
  }

  return <>
  <Modal
    title='Create New Module'
    isOpen={isModalOpen}
    onClose= {() => setModalOpen(false)}
    actions={
      <>
      <Button secondary onClick= {() => setModalOpen(false)}>Cancel</Button>
      <Button
            onClick={() => {
              if (!project) {
                handleNewModuleFile(null)
              } else {
                handleNewModuleFile(currentProject)
              }
            }}
          > Create </Button>
      </>
    }
    >
        {!project &&
        <>
          Select automata type for your first question:
          <Input type="select" value={newModuleType} onChange={(e) => setModuleType(e.target.value as ProjectType)}>
            <option value='FSA'>Finite State Automaton</option>
            <option value='PDA'>Push Down Automaton</option>
            <option value='TM'>Turing Machine</option>
          </Input>
        </>
        }
        Module Name:
        <Input
          type='text'
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder='Enter project name'
        />
        Description:
        <TextArea
          value={moduleDescription}
          onChange={(e) => setModuleDescription(e.target.value)}
          placeholder='Enter project description'
        />
  </Modal>
  </>
}

export default CreateModule
