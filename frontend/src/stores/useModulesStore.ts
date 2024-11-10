import { create, SetState } from 'zustand'
import { persist } from 'zustand/middleware'
import { StoredModule } from './useModuleStore'

interface ModulesStore {
    modules: StoredModule[],
    setModules: (modules: StoredModule[]) => void,
    clearModules: () => void,
    upsertModule: (module: StoredModule) => void,
    deleteModule: (pid: string) => void,
  }

const useModulesStore = create<ModulesStore>()(persist((set: SetState<ModulesStore>) => ({
  modules: [] as StoredModule[],
  setModules: (modules: StoredModule[]) => set({ modules }),
  clearModules: () => set({ modules: [] }),
  upsertModule: (module: StoredModule) => set((state) => ({
    modules: state.modules.find(l => l._id === module._id)
      ? state.modules.map(l => l._id === module._id ? module : l)
      : [...state.modules, module]
  })),
  deleteModule: (id: string) => set((state) => ({ modules: state.modules.filter(l => l._id !== id) }))
}), {
  name: 'automatarium-modules'
}))

export default useModulesStore
