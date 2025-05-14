import { useAuthStore } from '@stores/useAuthStore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export const useLogin = () => {
  const auth = getAuth()
  const setIsLoading = useAuthStore((state) => state.setIsLoading)

  const login = async ({ id, password }: { id: string; password: string }) => {
    try {
      setIsLoading(true)
      const email = `${id}@dongan.com` // 아이디를 이메일 형식으로 변환 (예시)
      await signInWithEmailAndPassword(auth, email, password)
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
