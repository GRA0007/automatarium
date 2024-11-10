import { useEffect, useState } from 'react'
import { useEvent } from '/src/hooks'
import { NavigateFunction } from 'react-router-dom'

import { promptLoadModuleFile, urlLoadModuleFile } from '/src/hooks/useActions'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'

import { ErrorText, ImportButtonWrapper } from './importModuleDialogStyle'
import { Button, Input, Modal, Spinner } from '/src/components'
import { Container } from '/src/pages/Share/shareStyle'
import { StoredModule } from '/src/stores/useModuleStore'
import { encodeModule } from '/src/util/encoding'

type ImportDialogProps = {
    // This needs to be passed in from the main page
    navigateFunction: NavigateFunction
  }

const ImportModuleDialog = ({ navigateFunction }: ImportDialogProps) => {
  const navigate = navigateFunction
  const setProject = useProjectStore(s => s.set)
  const setModule = useModuleStore(s => s.setModule)
  const getModuleProject = useModuleStore(s => s.getProject)
  const upsertModule = useModulesStore(s => s.upsertModule)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)

  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [urlValue, setUrlValue] = useState('')
  const [rawValue, setRawValue] = useState('')

  const [rawError, setRawError] = useState(false)
  const [urlError, setUrlError] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setRawError(false), 3000)
    return () => clearTimeout(timeout)
  }, [rawError])

  useEffect(() => {
    const timeout = setTimeout(() => setUrlError(false), 3000)
    return () => clearTimeout(timeout)
  }, [urlError])

  useEvent('modal:importModule', () => {
    setModalOpen(true)
    setLoading(false)
    setRawError(false)
    setUrlError(false)
  })

  const resetModal = () => {
    setUrlValue('')
    setRawValue('')
    setLoading(false)
    setModalOpen(false)
    setRawError(false)
    setUrlError(false)
  }

  const onData = (module: StoredModule) => {
    setModule(module)
    upsertModule(module)
  }

  const loadModule = () => {
    setProject(getModuleProject(0))
    if (showModuleWindow === false) {
      setShowModuleWindow(true)
    }
    navigate('/editor')
  }

  return loading
    ? <Container><Spinner /></Container>
    : <Modal
      title='Import Module'
      description='Have an existing module?'
      isOpen={modalOpen}
      onClose={resetModal}
      actions={<Button secondary onClick={resetModal}>Close</Button>}
  >
    <ImportButtonWrapper>
      From your computer
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true)
          promptLoadModuleFile(
            onData,
            'The file format provided is not valid. Please only open Automatarium .aom',
            '.aom',
            () => {
              resetModal()
              loadModule()
            },
            () => {
              setLoading(false)
            }
          )
        }}
      >
        Browse...
      </Button>
    </ImportButtonWrapper>
    <hr />
      From URL (module/plaintext)
      <ImportButtonWrapper>
        <Input
          value={urlValue}
          onChange={e => setUrlValue(e.target.value)}
          placeholder={'www.example.com/paste/module/CoolFSA.aom'}
        />
        <Button
          disabled={loading}
          onClick={() => {
            if (urlValue.length > 0) {
              setLoading(true)
              urlLoadModuleFile(
                urlValue,
                onData,
                'Automatarium failed to load a module from provided URL.',
                () => {
                  resetModal()
                  navigate('/editor')
                },
                () => {
                  setLoading(false)
                }
              )
            } else {
              setUrlError(true)
            }
          }}
        >Import</Button>
      </ImportButtonWrapper>
      {urlError ? <ErrorText>No URL specified!</ErrorText> : <></>}
      <hr />
      From raw data (from the export or your module file)
      <ImportButtonWrapper>
        <Input
          value={rawValue}
          onChange={e => setRawValue(e.target.value)}
          placeholder={'Enter raw data here'}
        />
        <Button disabled={loading} onClick={() => {
          if (rawValue.length > 0) {
            const data = rawValue[0] === '{'
              // This is a json file. It might not fit on the URL
              ? encodeModule(JSON.parse(rawValue))
              : rawValue
            navigate(`/share/module/${data}`)
          } else {
            setRawError(true)
          }
        }}>Load</Button>
      </ImportButtonWrapper>
      {rawError ? <ErrorText>Can't load nothing!</ErrorText> : <></>}
  </Modal>
}

export default ImportModuleDialog
