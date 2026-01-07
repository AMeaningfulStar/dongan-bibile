import { useAuthStore } from '@stores/useAuthStore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export const useLogin = () => {
  const auth = getAuth()
  const setIsLoading = useAuthStore((state) => state.setIsLoading)

  const login = async ({ id, password }: { id: string; password: string }) => {
    try {
      setIsLoading(true)
      const email = `${id}@dongan.com` // 아이디를 이메일 형식으로 변환

      // 1) Firebase 로그인
      const cred = await signInWithEmailAndPassword(auth, email, password)

      // 2) ID 토큰 얻기
      const idToken = await cred.user.getIdToken()

      // 3) 서버 세션 발급 -> __session 쿠키 생성
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (!res.ok) {
        // 서버 세션 발급 실패 시, 로그인 상태만 남는 걸 방지하려면 로그아웃 처리도 고려 가능
        throw new Error('세션 생성에 실패했습니다. 다시 로그인해 주세요.')
      }
    } catch (error: any) {
      let message = '로그인에 실패했습니다.'
      if (error.code === 'auth/user-not-found') message = '존재하지 않는 사용자입니다.'
      if (error.code === 'auth/wrong-password') message = '비밀번호가 올바르지 않습니다.'
      if (error.code === 'auth/invalid-email') message = '아이디 형식이 올바르지 않습니다.'
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { login }
}
