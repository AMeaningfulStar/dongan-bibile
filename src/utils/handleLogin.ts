import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { userInfoStore } from '@/stores/userInfoStore'

import { auth, firestore } from '@/libs/firebase'

import { BibleTextSize, BibleType } from './enum'

export const handleLogin = async (useId: string, loginPassword: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, useId, loginPassword)

    if (userCredential.user) {
      const { uid } = userCredential.user

      // Firestore에서 사용자 정보 가져오기
      const userDocRef = doc(firestore, 'users', uid)
      const userSnapshot = await getDoc(userDocRef)

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data()

        // Zustand 스토어에 userInfo 저장
        userInfoStore.setState({
          userInfo: {
            uid: uid,
            name: userData.name as string,
            id: userData.id as string,
            phone: userData.phone as string,
            position: userData.position as string,
            gradeNum: userData.grade as number,
            classNum: userData.class as number,
            bibleType: userData.bibleType as BibleType,
            bibleTextSize: userData.bibleTextSize as BibleTextSize,
            bibleReadingDates: userData.bibleReadingDates as Array<string>,
            prayerDates: userData.prayerDates as Array<string>,
          },
        })
      } else {
        console.error('사용자 문서가 존재하지 않습니다.')
      }
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error)
  }
}
