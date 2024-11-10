import { useEffect, useState } from 'react'
import { useEvent } from '/src/hooks'

import { useModuleStore } from '/src/stores'

import { Copy } from 'lucide-react'
import { Button, Input, Modal } from '/src/components'

import { CopyRowWrapper, CopySuccessDiv } from './shareUrlModuleStyle'
import { encodeModule } from '/src/util/encoding'

const ShareUrlModule = () => {
  const module = useModuleStore(s => s.module)

  const [base64Project, setBase64Project] = useState('')

  const shareRawLink = `${window.location.origin}/share/module/${base64Project}`

  const [exportUrlOpen, setExportUrlOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [dataCopySuccess, setDataCopySuccess] = useState(false)

  useEffect(() => {
    if (exportUrlOpen) {
      encodeModule(module).then(setBase64Project)
    }
  }, [exportUrlOpen])

  const handleClose = () => {
    setExportUrlOpen(false)
    setCopySuccess(false)
    setDataCopySuccess(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setCopySuccess(false), 3000)
    return () => clearTimeout(timeout)
  }, [copySuccess])

  useEffect(() => {
    const timeout = setTimeout(() => setDataCopySuccess(false), 3000)
    return () => clearTimeout(timeout)
  }, [dataCopySuccess])

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareRawLink)
    setCopySuccess(true)
  }

  const handleCopyEncoding = () => {
    navigator.clipboard.writeText(base64Project)
    setDataCopySuccess(true)
  }

  useEvent('showModuleSharing', () => setExportUrlOpen(true))

  return <>
    <Modal
      title='Export Module as URL'
      isOpen={exportUrlOpen}
      onClose={handleClose}
      actions={<Button secondary onClick={handleClose}>Close</Button>}
    >
      You can copy and paste as the raw data
      <CopyRowWrapper>
        <Input
          readOnly
          value={base64Project}
        />
        <Button onClick={handleCopyEncoding} style={{ height: '100%' }}>
          <Copy size='18px' />
        </Button>
      </CopyRowWrapper>
      {dataCopySuccess ? <CopySuccessDiv>Copied to clipboard!</CopySuccessDiv> : <></>}
      URL
      <CopyRowWrapper>
        <Input
          readOnly
          value={shareRawLink}
        />
        <Button onClick={handleCopyUrl} style={{ height: '100%' }}>
          <Copy size='18px' />
        </Button>
      </CopyRowWrapper>
      {copySuccess ? <CopySuccessDiv>Copied to clipboard!</CopySuccessDiv> : <></>}
      <hr />
    </Modal>
  </>
}

export default ShareUrlModule
