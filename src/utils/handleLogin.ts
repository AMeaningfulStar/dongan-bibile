import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { userInfoStore } from '@/stores/userInfoStore'

import { auth, firestore } from '@/libs/firebase'

import { BibleTextSize, BibleType } from './enum'

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

export const handleLogin = async (useId: string, loginPassword: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, useId, loginPassword)
    const firebaseUser = userCredential.user

    // Firestore에서 사용자 정보 가져오기
    const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid))
    if (!userDoc.exists()) {
      throw new Error('사용자 문서가 존재하지 않습니다.')
    }

    const userInfo = userDoc.data() as UserInfo

    userInfoStore.getState().setUserInfo({
      ...userInfo,
      uid: firebaseUser.uid,
    })

    console.log('로그인 성공:', userInfo)
  } catch (error) {
    console.error('로그인 중 오류 발생:', error)
  }
}
