import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { userCommuniteStore, userInfoStore } from '@/stores'

import { auth, firestore } from '@/libs/firebase'

import { UserCommunite, UserInfo } from './type'

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

    if (userInfo.churchId && userInfo.communityId) {
      const userCommuniteDoc = await getDoc(
        doc(firestore, 'churches', userInfo.churchId, 'communities', userInfo.communityId, 'users', firebaseUser.uid),
      )
      if (userCommuniteDoc.exists()) {
        const userCommunite = userCommuniteDoc.data() as UserCommunite

        userCommuniteStore.getState().setUserCommunite(userCommunite)
      }
    }

    console.log('로그인 성공:', userInfo)
  } catch (error) {
    console.error('로그인 중 오류 발생:', error)
  }
}
