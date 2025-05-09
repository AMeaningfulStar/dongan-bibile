import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect } from 'react'

import { auth, firestore } from '@/libs/firebase'

import { useAuthStore } from '@/stores/useAuthStore'

import { UserType } from '@/types'

export const useAuthListener = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const setIsLoading = useAuthStore((state) => state.setIsLoading)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true)
      if (firebaseUser) {
        const uid = firebaseUser.uid

        // fetch base user info
        const baseUserSnap = await getDoc(doc(firestore, 'users', uid))
        const baseUser = baseUserSnap.data()

        // fetch community user info
        const churchId = baseUser?.churchId
        const communityId = baseUser?.communityId
        let communityUser: any = {}

        const userData: UserType = {
          uid,
          name: baseUser?.name || '',
          phone: baseUser?.phone || '',
          role: baseUser?.role || 'user',
          bible: {
            type: baseUser?.bibleType,
            textSize: baseUser?.bibleTextSize,
            readingDates: communityUser?.bibleReadingDates ?? [],
          },
        }

        // 교회만 있을 때
        if (churchId && !communityId) {
          userData.church = { id: churchId }
        }

        // 교회 + 공동체 있을 때
        if (churchId && communityId) {
          const communityUserSnap = await getDoc(
            doc(firestore, 'churches', churchId, 'communities', communityId, 'users', uid),
          )
          communityUser = communityUserSnap.data()

          userData.church = { id: churchId }
          userData.community = {
            id: communityId,
            gradeNum: communityUser?.gradeNum,
            classNum: communityUser?.classNum,
          }
        }

        setUser(userData)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setIsLoading])
}
