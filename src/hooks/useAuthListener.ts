import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { useEffect } from 'react'

import { auth, firestore } from '@/libs/firebase'

import { useAuthStore } from '@/stores/useAuthStore'
import { useSeasonStore } from '@/stores/useSeasonStore'

import { Season, UserType } from '@/types'

export const useAuthListener = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const setIsLoading = useAuthStore((state) => state.setIsLoading)
  const setSeasons = useSeasonStore((state) => state.setSeasons)

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
            readingDates: baseUser?.bibleReadingDates ?? [],
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
          userData.bible.readingDates = communityUser?.bibleReadingDates ?? []

          const seasonSnapshot = await getDocs(
            collection(firestore, 'churches', churchId, 'communities', communityId, 'bibleSeasons'),
          )

          const seasonList: Season[] = seasonSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Season, 'id'>),
          }))

          setSeasons(seasonList)
        }

        setUser(userData)
      } else {
        setUser(null)
        setSeasons([])
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setIsLoading, setSeasons])
}
