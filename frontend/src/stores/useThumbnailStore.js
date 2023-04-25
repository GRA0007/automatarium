import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThumbnailStore = create()(persist(set => ({
  thumbnails: {},

  setThumbnail: (id, thumbnail) => set(state => ({
    thumbnails: { ...state.thumbnails, [id]: thumbnail }
  })),
  removeThumbnail: id => set(state => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: removed, ...thumbnails } = state.thumbnails
    return { thumbnails }
  }),
  clearThumbnails: () => set({ thumbnails: {} })
}), {
  name: 'automatarium-thumbnails'
}))

export default useThumbnailStore
