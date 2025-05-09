import { create } from 'zustand'

import { UserType } from '@/types'

type AuthState = {
  user: UserType | null
  setUser: (user: UserType | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
