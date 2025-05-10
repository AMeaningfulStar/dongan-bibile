import { create } from 'zustand'

interface ProgressStore {
  yearlyProgress: number
  seasonalProgress: number | null
  setYearlyProgress: (value: number) => void
  setSeasonalProgress: (value: number | null) => void
}

export const useProgressStore = create<ProgressStore>()((set) => ({
  yearlyProgress: 0,
  seasonalProgress: null,
  setYearlyProgress: (value) => set({ yearlyProgress: value }),
  setSeasonalProgress: (value) => set({ seasonalProgress: value }),
}))
