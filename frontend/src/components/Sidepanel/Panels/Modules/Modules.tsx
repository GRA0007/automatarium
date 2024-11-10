import { SectionLabel, Preference, Switch, Button, Input, Modal } from '/src/components'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'
import { createNewModuleProject, ModuleProject } from 'src/stores/useModuleStore'
import { Wrapper, RemoveButton, EditButton, TextArea, Table, TitleSection, ButtonContainer, FieldWrapper, DescriptionText } from './modulesStyle'
import { exportModuleFile } from '/src/hooks/useActions'
import { dispatchCustomEvent } from '/src/util/events'
import { Plus } from 'lucide-react'

const Modules = () => {
  const setModuleProjects = useModuleStore(s => s.setProjects)
  const setModuleDescription = useModuleStore(s => s.setModuleDescription)
  const setModuleName = useModuleStore(s => s.setName)
  const deleteQuestionFromModule = useModuleStore(s => s.deleteQuestion)
  const addQuestionToModule = useModuleStore(s => s.upsertQuestion)
  const deleteProjectFromModule = useModuleStore(s => s.deleteProject)
  const updateProjectToModule = useModuleStore(s => s.upsertProject)
  const currentModule = useModuleStore(s => s.module)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)
  const updateModule = useModulesStore(s => s.upsertModule)
  const setProject = useProjectStore(s => s.set)
  const currentProject = useProjectStore(s => s.project)
  const setAllProjectNames = useModuleStore(s => s.setAllProjectNames)
  const setProjectName = useProjectStore(s => s.setName)

  // Current assessment description and title
  const [isTitleEditing, setTitleIsEditing] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [titleDescription, setTitleDescription] = useState('')

  // enum for Project Types
  enum ProjectType {
    FSA = 'FSA',
    PDA = 'PDA',
    TM = 'TM',
  }

  // Modal-related state management
  const [isModalOpen, setIsModalOpen] = useState(false) // Controls modal visibility

  // Load module values into local state when module changes
  useEffect(() => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '') // Populate title input
      setTitleDescription(currentModule.description || '') // Populate description input
    }
  }, [currentModule])

  // Open edit mode and reset the input fields
  const handleEditClick = () => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '') // Reset title input
      setTitleDescription(currentModule.description || '') // Reset description input
    }
    setTitleIsEditing(true) // Enable edit mode
  }

  // Save the new title and description to the store
  const handleEditSaveClick = () => {
    setModuleName(titleInput)
    setModuleDescription(titleDescription)
    setProjectName(titleInput) // Save title to current project
    setAllProjectNames(titleInput) // Save title to all projects stored in module
    setTitleIsEditing(false) // Exit edit mode after saving
    saveModule()
  }

  // Cancel editing and reset the input fields to the stored values
  const handleCancelClick = () => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '') // Reset title input
      setTitleDescription(currentModule.description || '') // Reset description input
    }
    setTitleIsEditing(false) // Exit edit mode without saving
  }

  // Save changes to module
  const saveModule = () => {
    const project = useProjectStore.getState().project
    updateProjectToModule({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    updateModule(currentModule)
  }

  // Function to open the modal
  const handleAddQuestionClick = () => {
    setIsModalOpen(true)
  }

  // Form handling using react-hook-form
  const { register, handleSubmit } = useForm({ defaultValues: { questionType: ProjectType.FSA } })

  const handleAddQuestion = (data) => {
    const newModuleProject = createNewModuleProject(data.questionType, currentModule.meta.name)
    updateProjectToModule(newModuleProject) // Save new project with selected type
    addQuestionToModule(newModuleProject._id, '') // Add new question
    setProject(newModuleProject) // Set the project for editing
    setIsModalOpen(false) // Close the modal
  }

  const handleEditQuestion = (_project: ModuleProject) => {
    // Save current changes before moving to another question
    saveModule()
    // Set the project for the editor
    setProject(_project)
    // Open module window
    if (showModuleWindow === false) {
      setShowModuleWindow(true)
    }
  }

  const handleOpenQuestion = (_project: ModuleProject) => {
    // Save current changes before moving to another question
    saveModule()
    // Set the project for the editor
    setProject(_project)
  }

  const handleDeleteQuestion = (_project: ModuleProject) => {
    // Delete project from current module
    deleteProjectFromModule(_project._id)
    // Delete question from current module
    deleteQuestionFromModule(_project._id)
    if (_project._id === currentProject._id) {
      const remainingProjects = currentModule.projects.filter((proj) => proj._id !== _project._id)
      setProject(remainingProjects[0]) // Set the first remaining project as the current project
    }
  }

  // Drag and drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null) // Track the index of the dragged item

  const handleDragStart = (index: number) => {
    setDraggedIndex(index) // Store the index of the dragged question
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return // Avoid rearranging if the index hasn't changed

    const updatedProjects = [...currentModule.projects] // Clone projects array
    const [movedProject] = updatedProjects.splice(draggedIndex, 1) // Remove dragged project
    updatedProjects.splice(dropIndex, 0, movedProject) // Insert it at the drop location

    setModuleProjects(updatedProjects) // Update the project order
    setDraggedIndex(null) // Reset dragged index
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault() // Allow drop by preventing the default behavior
  }

  // Export
  const handleExportModule = () => {
    exportModuleFile()
  }

  const handleCreateModule = () => {
    dispatchCustomEvent('modal:createModule', { project: true })
  }

  return (
    <>
      <SectionLabel>Current Assessment</SectionLabel>
      {!currentModule && <>
        <Wrapper>You're not working on a module right now
        <Button icon={<Plus/>} onClick={handleCreateModule}>Modularise this project</Button>
        </Wrapper>
      </>}
      {currentModule && <>
        <Wrapper>
        {isTitleEditing
          ? (
            <>
              <TitleSection>
                <TextArea
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  rows={1}
                  placeholder="Module Title"
                  maxLength={30} // character limit on input field
                />
              </TitleSection>
              <TextArea
                value={titleDescription}
                onChange={(e) => setTitleDescription(e.target.value)}
                rows={4}
                placeholder="Description"
              />
              <ButtonContainer>
                <Button onClick={handleCancelClick}>Cancel</Button>
                <Button onClick={handleEditSaveClick}>Save</Button>
              </ButtonContainer>
            </>
            )
          : (
            <>
              <TitleSection>
                <h2>{currentModule?.meta.name || 'Untitled Module'}</h2> {/* Display current lab title */}
              </TitleSection>
              <DescriptionText>{currentModule?.description || ''}</DescriptionText> {/* Display current lab description */}
              <Button onClick={handleEditClick}>Edit</Button> {/* Toggle edit mode */}
            </>
            )}

        </Wrapper>

        <SectionLabel>Module Settings</SectionLabel>
        <Wrapper>
          <Preference label="Open questions to the left">
            <Switch type="checkbox" checked={showModuleWindow} onChange={() => setShowModuleWindow(!showModuleWindow)} />
          </Preference>
        </Wrapper>
        <>
          <SectionLabel>Questions</SectionLabel>
          <Wrapper>
            <Table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentModule.projects.map((q, index) => (
                  <tr
                    key={q._id}
                    style={{
                      backgroundColor: currentProject && currentProject._id === q._id ? 'var(--toolbar)' : 'transparent' // Highlight if it's the current project
                    }}
                    draggable={currentProject && currentProject._id === q._id}
                    onDragStart={() => handleDragStart(index)}
                    onDrop={() => handleDrop(index)}
                    onDragOver={handleDragOver}
                  >
                    <td onClick={() => handleOpenQuestion(q)}>{`Question ${index + 1}`}</td>
                    <td>
                      <EditButton onClick={() => handleEditQuestion(q)}>Edit</EditButton>
                      <RemoveButton
                        onClick={() => handleDeleteQuestion(q)}
                        disabled={currentModule.projects.length <= 1}
                      >
                        Remove
                      </RemoveButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button onClick={handleAddQuestionClick}>+ Add question</Button>
          </Wrapper>
          <Modal
            title="Select Question Type"
            description="Choose the type of question that you would like to add."
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            actions={
              <>
                <Button secondary onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" form="question_type_form">Save</Button>
              </>
            }
            style={{ paddingInline: 0 }}
          >
            <form id="question_type_form" onSubmit={handleSubmit(handleAddQuestion)}>
              <SectionLabel>Question Type</SectionLabel>
              <FieldWrapper>
                <span>Select Type</span>
                <Input type="select" small {...register('questionType')}>
                  <option value="FSA">FSA</option>
                  <option value="PDA">PDA</option>
                  <option value="TM">TM</option>
                </Input>
              </FieldWrapper>
            </form>
          </Modal>
        </>
        <SectionLabel>Export</SectionLabel>
        <Wrapper>
          <Button onClick={handleExportModule}>Export as Automatarium module file</Button>
          <Button onClick={() => dispatchCustomEvent('showModuleSharing', null)}>Export as URL</Button>
        </Wrapper>
      </>
      }
    </>
  )
}

export default Modules
