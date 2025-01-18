import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { BibleTextSize, BibleType } from '@/utils/enum'

type UserInfo = {
  uid: string
  name: string
  id: string
  phone: string
  position: string
  gradeNum: number
  classNum: number
  bibleReadingDates: Array<string>
  prayerDates: Array<string>
  bibleType: BibleType
  bibleTextSize: BibleTextSize
  challengeStreakCount?: number // FIXME: 추후 삭제할 수 있는 타입
}

type UserInfoStore = {
  userInfo: UserInfo | null
  setUserInfo: (userInfo: UserInfo) => void
  setBibleType: (type: BibleType) => void
  setBibleTextSize: (size: BibleTextSize) => void
  setBibleReadingDates: (newReadingDate: string) => void
  clearUserInfo: () => void
}

export const userInfoStore = create(
  persist<UserInfoStore>(
    (set, get) => ({
      userInfo: null,

      setUserInfo: (userInfo: UserInfo) => {
        set(() => ({
          userInfo,
        }))
      },

      setBibleType: (type: BibleType) => {
        set((state: UserInfoStore) => {
          if (!state.userInfo) {
            return {}
          }

          return {
            userInfo: {
              ...state.userInfo,
              bibleType: type,
            },
          }
        })
      },

      setBibleTextSize: (size: BibleTextSize) => {
        set((state: UserInfoStore) => {
          if (!state.userInfo) {
            return {}
          }

          return {
            userInfo: {
              ...state.userInfo,
              bibleTextSize: size,
            },
          }
        })
      },

      setBibleReadingDates: (newReadingDate: string) => {
        set((state: UserInfoStore) => {
          if (!state.userInfo) {
            return {}
          }

          return {
            userInfo: {
              ...state.userInfo,
              bibleReadingDates: [...state.userInfo.bibleReadingDates, newReadingDate],
            },
          }
        })
      },

      clearUserInfo: () =>
        set(() => ({
          userInfo: null,
        })),
    }),
    {
      name: 'user-information',
    },
  ),
)
