import React, { useState, useEffect, useRef } from 'react'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'
import {
  ModuleWindowWrapper,
  TextArea,
  PaginationWrapper,
  ResizeHandle,
  CloseButton,
  TitleWrapper,
  Title,
  Content,
  ButtonContainer,
  EditButton
} from './moduleWindowStyling'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { MarkdownRender, Button } from '/src/components'

const ModuleWindow = ({ onPanelWidthChange }) => {
  const currentModule = useModuleStore(s => s.module)
  const updateQuestion = useModuleStore(s => s.upsertQuestion)
  const updateProject = useModuleStore(s => s.upsertProject)
  const questions = currentModule.questions
  const totalQuestions = Object.keys(questions).length
  const currentProject = useProjectStore(s => s.project)
  const currentQuestionIndex = currentModule.projects.findIndex(project => project._id === currentProject._id)
  const updateModule = useModulesStore(s => s.upsertModule)
  const setProject = useProjectStore(s => s.set)
  const currentQuestion = questions[currentProject._id]
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)

  const [panelWidth, setPanelWidth] = useState('300px')
  const panelRef = useRef<HTMLDivElement | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [question, setQuestion] = useState(currentQuestion || '')

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startWidth = panelRef.current ? panelRef.current.offsetWidth : 300

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth + (moveEvent.clientX - startX)
      if (newWidth > 650) newWidth = 650
      if (newWidth < 300) newWidth = 300
      setPanelWidth(`${newWidth}px`)
      onPanelWidthChange(newWidth)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleClose = () => {
    setShowModuleWindow(false) // Close the module panel
  }

  useEffect(() => {
    // Ensure that the question is updated when the current question or module changes
    if (currentModule && currentProject._id) {
      setQuestion(questions[currentProject._id] || '')
    }
  }, [currentModule, currentProject._id])

  const saveModule = () => {
    const project = useProjectStore.getState().project
    updateProject({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    updateModule(currentModule)
  }

  const handleEditClick = () => {
    if (isEditing) {
      const currentQuestionId = Object.keys(questions)[currentQuestionIndex]
      updateQuestion(currentQuestionId, question)
      updateModule(currentModule)
    }
    setIsEditing(!isEditing)
  }

  const handlePageChange = (index: number) => {
    saveModule()
    setProject(currentModule.projects[index])
  }

  // If there are no questions or module data yet, show a loading or fallback message
  if (!questions || totalQuestions === 0 || !currentModule) {
    return <ModuleWindowWrapper width={panelWidth}>Loading module instructions...</ModuleWindowWrapper>
  }

  // Cancel editing and reset the input fields to the stored values
  const handleCancelClick = () => {
    if (currentModule) {
      setQuestion(currentQuestion || '') // Reset description input
    }
    setIsEditing(false) // Exit edit mode without saving
  }

  return (
    <ModuleWindowWrapper ref={panelRef} width={panelWidth}>
      <TitleWrapper>
        <Title>Question {currentQuestionIndex + 1}</Title>
        {isEditing
          ? (
          <ButtonContainer>
            <Button onClick={handleCancelClick}>Cancel</Button>
            <Button onClick={handleEditClick}>Save</Button>
          </ButtonContainer>
            )
          : (
          <EditButton>
            <Button onClick={handleEditClick}>Edit</Button>
          </EditButton>
            )}
      </TitleWrapper>
      <CloseButton onClick={handleClose}><X /></CloseButton>

      <div>
        <hr />
        <Content>
          {isEditing
            ? (
            <TextArea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Edit module instructions here"
              rows={39}
            />
              )
            : (
            <MarkdownRender props={question} />
              )}
        </Content>
      </div>

      <PaginationWrapper>
        {currentQuestionIndex !== 0
          ? (<Button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                const newIndex = currentQuestionIndex - 1
                handlePageChange(newIndex)
              }
            }}
            disabled={currentQuestionIndex === 0}
            style={{
              backgroundColor: currentQuestionIndex > 0 ? 'var(--primary)' : 'transparent',
              margin: '0 2px',
              flex: 0
            }}
          >
            <ChevronLeft />
          </Button>
            )
          : null}

        {currentQuestionIndex > 0
          ? (
          <Button
            onClick={() => handlePageChange(currentQuestionIndex - 1)}
            style={{
              backgroundColor: 'var(--primary)',
              margin: '0 2px',
              flex: 0
            }}
          >
            {currentQuestionIndex}
          </Button>
            )
          : (
          <div style={{ flex: 0 }}></div> // Empty space when no previous question
            )}

        <Button
          style={{
            backgroundColor: 'gray',
            margin: '0 2px',
            flex: 0
          }}
        >
          {currentQuestionIndex + 1}
        </Button>

        {currentQuestionIndex < totalQuestions - 1
          ? (<Button
            onClick={() => handlePageChange(currentQuestionIndex + 1)}
            style={{
              backgroundColor: 'var(--primary)',
              margin: '0 2px',
              flex: 0
            }}
          >
            {currentQuestionIndex + 2}
          </Button>
            )
          : (
          <div style={{ flex: 0 }}></div> // Empty space when no next question
            )}

        {currentQuestionIndex !== totalQuestions - 1
          ? (
          <Button
            onClick={() => {
              if (currentQuestionIndex < totalQuestions - 1) {
                const newIndex = currentQuestionIndex + 1
                handlePageChange(newIndex)
              }
            }}
            style={{
              backgroundColor: currentQuestionIndex < totalQuestions - 1 ? 'var(--primary)' : 'transparent',
              margin: '0 2px',
              flex: 0
            }}
          >
            <ChevronRight />
          </Button>
            )
          : null}
      </PaginationWrapper>

      <ResizeHandle onMouseDown={handleMouseDown} />
    </ModuleWindowWrapper>
  )
}

export default ModuleWindow
