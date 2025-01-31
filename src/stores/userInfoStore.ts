import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { auth, firestore } from '@/libs/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

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
  logout: () => void
}

export const userInfoStore = create(
  persist<UserInfoStore>(
    (set, get) => ({
      userInfo: null,

      setUserInfo: (userInfo: UserInfo) => set({ userInfo }),

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

      logout: async () => {
        await signOut(auth) // Firebase Auth 로그아웃
        set({ userInfo: null }) // Zustand 상태도 초기화
      },
    }),
    {
      name: 'user-information',
    },
  ),
)

export const initAuthListener = () => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Firestore에서 사용자 정보 가져오기
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserInfo
        userInfoStore.getState().setUserInfo({
          ...userData,
          uid: firebaseUser.uid,
        })
      }
    } else {
      userInfoStore.getState().logout()
    }
  })
}
