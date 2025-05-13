import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { auth, firestore } from '@/libs/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { userCommuniteStore } from './userCommuniteStroe'

import { BibleTextSize, BibleType } from '@/utils/enum'

type UserInfoStore = {
  userInfo: any | null
  setUserInfo: (userInfo: any) => void
  setBibleType: (type: BibleType) => void
  setBibleTextSize: (size: BibleTextSize) => void
  logout: () => void
}

export const userInfoStore = create(
  persist<UserInfoStore>(
    (set, get) => ({
      userInfo: null,

      setUserInfo: (userInfo: any) => set({ userInfo }),

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

      logout: async () => {
        await signOut(auth) // Firebase Auth 로그아웃
        set({ userInfo: null }) // Zustand 상태도 초기화
        userCommuniteStore.setState({ userCommunite: null })
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
        const userData = userDoc.data() as any
        userInfoStore.getState().setUserInfo({
          ...userData,
          uid: firebaseUser.uid,
        })

        if (userData.churchId && userData.communityId) {
          const userCommuniteDoc = await getDoc(
            doc(
              firestore,
              'churches',
              userData.churchId,
              'communities',
              userData.communityId,
              'users',
              firebaseUser.uid,
            ),
          )
          if (userCommuniteDoc.exists()) {
            const userCommunite = userCommuniteDoc.data() as any

            userCommuniteStore.getState().setUserCommunite(userCommunite)
          }
        }
      }
    } else {
      userInfoStore.getState().logout()
    }
  })
}
