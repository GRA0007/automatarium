import { useEffect, useState } from 'react'

import { useProjectsStore, useProjectStore } from '/src/stores'
import dayjs from 'dayjs'

const SAVE_INTERVAL = 5 * 1000
const SAVE_DIALOG_MIN_TIME = 1.5 * 1000

/**
 * Use this to save the project on an interval. The project will only save if there are changes
 * and there are items in the project
 * @see SAVE_INTERVAL
 */
const useAutosaveProject = () => {
  const upsertProject = useProjectsStore(s => s.upsertProject)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)
  const lastSaveDate = useProjectStore(s => s.lastSaveDate)
  const setLastSaveDate = useProjectStore(s => s.setLastSaveDate)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const currP = useProjectStore.getState().project
      const totalItems = currP.comments.length + currP.states.length + currP.transitions.length
      // Only save if there has been a change and there is something in the project
      if ((!lastSaveDate || dayjs(lastChangeDate).isAfter(lastSaveDate)) && totalItems > 0) {
        setIsSaving(true)
        const toSave = { ...currP, meta: { ...currP.meta, dateEdited: new Date().getTime() } }
        upsertProject(toSave)
        setLastSaveDate(new Date().getTime())
        // Hide "Saving..." dialog after a short delay
        setTimeout(() => {
          setIsSaving(false)
        }, SAVE_DIALOG_MIN_TIME)
      }
    }, SAVE_INTERVAL)

    return () => clearInterval(timer)
  }, [lastChangeDate, lastSaveDate, upsertProject, setLastSaveDate])

  return isSaving
}

export default useAutosaveProject
