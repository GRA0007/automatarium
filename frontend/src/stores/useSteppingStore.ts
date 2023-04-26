import { create } from 'zustand'
import { Node, State } from '@automatarium/simulation'
import { AutomataState } from '/src/types/ProjectTypes'

interface SteppingStore<S extends State> {
  steppedStates: Node<S>[]
  setSteppedStates: (states: Node<S>[]) => void
}

const useSteppingStore = create<SteppingStore<AutomataState>>((set) => ({
  steppedStates: [],

  /* Update graph step state */
  setSteppedStates: (steppedStates) => {
    const ids = steppedStates.map((s) => s.state.id)
    set({ steppedStates: ids })
  }
}))

export default useSteppingStore
