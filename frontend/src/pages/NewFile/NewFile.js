import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { convertJFLAPXML } from '@automatarium/jflap-translator'
import dayjs from 'dayjs'

import { Main, Button, Header, ProjectCard } from '/src/components'
import { useProjectsStore, useProjectStore } from '/src/stores'
import { useAuth } from '/src/hooks'
import { createNewProject } from '/src/stores/useProjectStore' // #HACK
import LoginPage from '/src/pages/Login/Login'
import SignupPage from '/src/pages/Signup/Signup'

import { NewProjectCard, CardList } from './components'
import { ButtonGroup, NoResultSpan, HeaderRow } from './newFileStyle'

const NewFile = () => {
  const navigate = useNavigate()
  const projects = useProjectsStore(s => s.projects)
  const setProject = useProjectStore(s => s.set)
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [signupModalVisible, setSignupModalVisible] = useState(false)
  const { user, userLoading } = useAuth()

  const handleNewFile = projectType => {
    setProject(createNewProject(projectType))
    navigate('/editor')
  }

  const handleLoadProject = project => {
    setProject(project)
    navigate('/editor')
  }

  const importProject = () => {
    // Prompt user for file input
    let input = document.createElement('input')
    input.type = 'file'
    input.onchange = () => {
      // Read file data
      const reader = new FileReader()
      reader.onloadend = () => {
        const fileToOpen = input.files[0]
        // JFLAP file load - handle conversion
        if (fileToOpen.name.toLowerCase().endsWith('.jff')) {
          const project = {
            ...createNewProject(),
            ...convertJFLAPXML(reader.result),
          }
          setProject({
            ...project,
            meta: {
              ...project.meta,
              name: input.files[0]?.name.split('.').slice(0, -1).join('.')
            }
          })
          navigate('/editor')
        } else if (fileToOpen.name.toLowerCase().endsWith('.json')) {
          // Set project (file) in project store
          const project = {
            ...createNewProject(),
            ...JSON.parse(reader.result),
          }
          setProject({
            ...project,
            meta: {
              ...project.meta,
              name: input.files[0]?.name.split('.').slice(0, -1).join('.')
            }
          })
          navigate('/editor')
        } else {
          window.alert('The file format provided is not valid. Please only open Automatarium .json or JFLAP .jff file formats.')
        }

      }
      reader.readAsText(input.files[0])
    }
    input.click()
  }

  return <Main wide>
    <HeaderRow>
      <Header linkTo="/" />
      <ButtonGroup>
        {!userLoading && !user && <>
          <Button secondary onClick={() => setLoginModalVisible(true)}>Log In</Button>
          <Button onClick={() => setSignupModalVisible(true)}>Sign Up</Button>
        </>}
        {user && <Button secondary onClick={() => navigate('/logout')}>Logout</Button>}
      </ButtonGroup>
    </HeaderRow>

    <CardList title="New Project"
      button={<Button onClick={importProject}>Import...</Button>}
    >
      <NewProjectCard
        title="Finite State Automaton"
        description="Create a deterministic or non-deterministic automaton with finite states. Capable of representing regular grammars."
        onClick={() => handleNewFile('FSA')} />
      <NewProjectCard
        disabled
        title="Push Down Automaton"
        description="Create an automaton with a push-down stack capable of representing context-free grammars." />
      <NewProjectCard
        disabled
        title="Turing Machine"
        description="Create a turing machine capable of representing recursively enumerable grammars." />
    </CardList>

    <CardList
      title="Your Projects"
    >
      {projects.sort((a, b) => b.meta.dateEdited - a.meta.dateEdited).map(p =>
        <ProjectCard
          key={p._id}
          name={p?.meta?.name ?? '<Untitled>'}
          type={p?.config?.type ?? '???'}
          date={dayjs(p?.meta?.dateEdited)}
          onClick={() => handleLoadProject(p)}
        />
      )}
      {projects.length === 0 && <NoResultSpan>No projects yet</NoResultSpan>}
    </CardList>

    <LoginPage.Modal isOpen={loginModalVisible} onClose={() => setLoginModalVisible(false)} />
    <SignupPage.Modal isOpen={signupModalVisible} onClose={() => setSignupModalVisible(false)} />
  </Main>
}

export default NewFile
