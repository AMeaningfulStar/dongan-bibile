import { useAuthStore } from '@/stores/useAuthStore'
import { getAuth, signOut } from 'firebase/auth'

export const useLogout = () => {
  const auth = getAuth()
  const setUser = useAuthStore((state) => state.setUser)

  const logout = async () => {
    try {
      // Firebase에서 로그아웃
      await signOut(auth)

      // zustand 상태도 초기화
      setUser(null)
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error)
    }
  }

  return { logout }
}
