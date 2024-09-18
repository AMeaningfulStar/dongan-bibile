import { create } from 'zustand'

interface BibleTextSizeStore {
  textSize: string
  increaseTextSize: () => void
  decreaseTextSize: () => void
}

const textSizeOptions = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl']

const useBibleTextSize = create<BibleTextSizeStore>((set, get) => ({
  textSize: 'text-sm',

  increaseTextSize: () => {
    const { textSize } = get()

    const nextIndex = textSizeOptions.indexOf(textSize) + 1

    if (nextIndex < textSizeOptions.length)
      set((state: BibleTextSizeStore) => ({
        ...state,
        textSize: textSizeOptions[nextIndex],
      }))
  },

  decreaseTextSize: () => {
    const { textSize } = get()

    const prevIndex = textSizeOptions.indexOf(textSize) - 1

    if (prevIndex >= 0)
      set((state: BibleTextSizeStore) => ({
        ...state,
        textSize: textSizeOptions[prevIndex],
      }))
  },
}))

export default useBibleTextSize
