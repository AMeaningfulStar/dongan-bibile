import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FirebaseStoreType {
  firebaseInfo: FirebaseState
  initFirebaseInfo: () => void
  setFirebaseUid: (newFirebaseUid: string) => void
  setFirebaseInfo: (newFirebaseInfo: ReadDataType | any) => void
}

interface ReadDataType {
  admin: boolean
  class: number
  email: string
  grade: number
  name: string
  phoneNum: string
  position: string
}

interface FirebaseState {
  uid: string | null
  useName: string | null
  useEmail: string | null
  usePhoneNum: string | null
  usePosition: string | null
  useGrade: number | null
  useClass: number | null
  useAdmin: boolean | null
}

const useFirebaseStore = create(
  persist<FirebaseStoreType>(
    (set, get) => ({
      firebaseInfo: {
        uid: null,
        useName: null,
        useEmail: null,
        usePhoneNum: null,
        usePosition: null,
        useGrade: null,
        useClass: null,
        useAdmin: false,
      },

      initFirebaseInfo: () =>
        set((state: FirebaseStoreType) => ({
          ...state.firebaseInfo,
          firebaseInfo: {
            uid: null,
            useName: null,
            useEmail: null,
            usePhoneNum: null,
            usePosition: null,
            useGrade: null,
            useClass: null,
            useAdmin: false,
          },
        })),

      setFirebaseUid: (newFirebaseUid) =>
        set((state: FirebaseStoreType) => ({
          firebaseInfo: {
            ...state.firebaseInfo,
            uid: newFirebaseUid,
          },
        })),

      setFirebaseInfo: (newFirebaseInfo) =>
        set((state: FirebaseStoreType) => ({
          firebaseInfo: {
            ...state.firebaseInfo,
            useName: newFirebaseInfo.name,
            useEmail: newFirebaseInfo.email,
            usePhoneNum: newFirebaseInfo.phoneNum,
            usePosition: newFirebaseInfo.position,
            useGrade: newFirebaseInfo.grade,
            useClass: newFirebaseInfo.class,
            useAdmin: newFirebaseInfo.admin,
          },
        })),
    }),
    {
      name: 'firebase-info',
    },
  ),
)

export default useFirebaseStore
