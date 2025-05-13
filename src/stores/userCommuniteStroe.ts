import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { userInfoStore } from './userInfoStore'

type UserCommuniteStroe = {
  userCommunite: any | null
  setUserCommunite: (userCommunite: any) => void
  setBibleReadingDates: (newReadingDate: string) => void
}

export const userCommuniteStore = create(
  persist<UserCommuniteStroe>(
    (set, get) => ({
      userCommunite: null,

      setUserCommunite: (userCommunite: any) => set({ userCommunite }),

      setBibleReadingDates: (newReadingDate: string) => {
        set((state: UserCommuniteStroe) => {
          if (!userInfoStore.getState().userInfo || !state.userCommunite) {
            return {}
          }

          return {
            userCommunite: {
              ...state.userCommunite,
              bibleReadingDates: [...state.userCommunite.bibleReadingDates, newReadingDate],
            },
          }
        })
      },
    }),
    {
      name: 'user-communite',
    },
  ),
)
