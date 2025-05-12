import { isWithinInterval, parseISO } from 'date-fns'
import { create } from 'zustand'

import { Season } from '@/types'

interface SeasonStore {
  seasons: Season[]
  selectedSeason: Season | null
  setSeasons: (seasons: Season[]) => void
  selectSeason: (seasonId: string) => void
  resetSeasons: () => void
}

export const useSeasonStore = create<SeasonStore>((set, get) => ({
  seasons: [],
  selectedSeason: null,

  setSeasons: (seasons) => {
    const today = new Date()

    // 오늘 날짜가 포함된 시즌을 기본 선택
    const defaultSeason = seasons.find((season) =>
      isWithinInterval(today, {
        start: parseISO(season.startDate),
        end: parseISO(season.endDate),
      }),
    )

    set({
      seasons,
      selectedSeason: defaultSeason || null,
    })
  },

  selectSeason: (seasonId) => {
    const { seasons } = get()
    const found = seasons.find((s) => s.id === seasonId) || null
    set({ selectedSeason: found })
  },

  resetSeasons: () => {
    set({ seasons: [], selectedSeason: null })
  },
}))
