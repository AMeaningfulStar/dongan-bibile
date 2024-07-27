import { create } from 'zustand'

interface LoginStoreType {
  loginValue: LoginState
  initLoginValue: () => void
  setUseEmail: (inputValue: string) => void
  setUsePassword: (inputValue: string) => void
  validateLoginValue: () => { isError: boolean; errorMessage: string }
}

interface LoginState {
  email: string
  password: string
}

const useLoginStore = create<LoginStoreType>()((set, get) => ({
  loginValue: {
    email: '',
    password: '',
  },

  //  입력값 초기화
  initLoginValue: () =>
    set((state: LoginStoreType) => ({
      loginValue: {
        ...state.loginValue,
        email: '',
        password: '',
      },
    })),

  //  email set
  setUseEmail: (inputValue) =>
    set((state: LoginStoreType) => ({
      loginValue: {
        ...state.loginValue,
        email: inputValue,
      },
    })),

  // password set
  setUsePassword: (inputValue) =>
    set((state: LoginStoreType) => ({
      loginValue: {
        ...state.loginValue,
        password: inputValue,
      },
    })),

  validateLoginValue: () => {
    const { email, password } = get().loginValue
    if (!validateString(email)) return { isError: true, errorMessage: 'email 입력해주세요' }
    if (!validateString(password)) return { isError: true, errorMessage: '비밀번호 입력해주세요' }

    return { isError: false, errorMessage: '' }
  },
}))

const validateString = (string: string) => {
  if (string.trim().length === 0) return false
  return true
}

export default useLoginStore
