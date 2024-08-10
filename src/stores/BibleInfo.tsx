import { create } from 'zustand'

import { BibleType } from '@/libs/bibleType'

interface BibleStore {
  datePick: string
  bibleType: BibleType
  setDatePick: (newDatePick: string) => void
  setBibleType: (newBibleType: BibleType) => void
}

const useBibleInfo = create<BibleStore>((set) => ({
  datePick: '',

  bibleType: BibleType.EASY,

  setDatePick: (newDatePick: string) =>
    set((state: BibleStore) => ({
      ...state,
      datePick: newDatePick,
    })),

  setBibleType: (newBibleType: BibleType) =>
    set((state: BibleStore) => ({
      ...state,
      bibleType: newBibleType,
    })),
}))

export default useBibleInfo
