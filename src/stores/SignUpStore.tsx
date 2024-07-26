import { create } from 'zustand'

interface SignUpStoreType {
  signUpValue: SignUpState
  initSignUpValue: () => void
  setUseName: (inputValue: string) => void
  setUseEmail: (inputValue: string) => void
  setUsePassword: (inputValue: string) => void
  setUseVerifyPassword: (inputValue: string) => void
  setUsePhoneNum: (inputValue: string) => void
  setUsePosition: (inputValue: string) => void
  setUseAffiliation: (inputValue: string) => void
  validateSignUpValue: () => { isError: boolean; errorMessage: string }
}

interface SignUpState {
  useName: string
  useEmail: string
  usePassword: string
  useVerifyPassword: string
  usePhoneNum: string
  usePosition: string
  useAffiliation: string
}

const useSignUpStore = create<SignUpStoreType>()((set, get) => ({
  signUpValue: {
    useName: '',
    useEmail: '',
    usePassword: '',
    useVerifyPassword: '',
    usePhoneNum: '',
    usePosition: '',
    useAffiliation: '',
  },

  // 회원가입 입력 정보 초기화
  initSignUpValue: () =>
    set((state: SignUpStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useName: '',
        useEmail: '',
        usePassword: '',
        useVerifyPassword: '',
        usePhoneNum: '',
        usePosition: '',
        useAffiliation: '',
      },
    })),

  // 사용자 이름 set
  setUseName: (inputValue) =>
    set((state: SignUpStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useName: inputValue,
      },
    })),

  // 사용자 Email set
  setUseEmail: (inputValue) =>
    set((state: SignUpStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useEmail: inputValue,
      },
    })),

  // 사용자 비밀번호 set
  setUsePassword: (inputValue) =>
    set((state: SignUpStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        usePassword: inputValue,
      },
    })),

  // 사용자 비밀번호 set
  setUseVerifyPassword: (inputValue) =>
    set((state: SignUpStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useVerifyPassword: inputValue,
      },
    })),

  // 사용자 전화번호 set
  setUsePhoneNum: (inputValue) =>
    set((state: SignUpStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        usePhoneNum: inputValue,
      },
    })),

  // 사용자 직분 set
  setUsePosition: (inputValue) =>
    set((state: SignUpStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        usePosition: inputValue,
      },
    })),

  // 사용자 소속 set
  setUseAffiliation: (inputValue) =>
    set((state: SignUpStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useAffiliation: inputValue,
      },
    })),

  validateSignUpValue: () => {
    const { useName, useEmail, usePassword, useVerifyPassword, usePhoneNum, usePosition, useAffiliation } =
      get().signUpValue

    // 모든 정보를 입력했는지 확인
    if (
      !validateString(useName) ||
      !validateString(useEmail) ||
      !validateString(usePassword) ||
      !validateString(useVerifyPassword) ||
      !validateString(usePhoneNum) ||
      !validateString(usePosition) ||
      !validateString(useAffiliation)
    )
      return { isError: true, errorMessage: '모든 정보를 입력바랍니다' }

    // 비밀번호 확인이 맞는지 확인
    if (checkPasswordsMatch(usePassword, useVerifyPassword))
      return { isError: true, errorMessage: '입력하신 비밀번호가 다릅니다' }

    return { isError: false, errorMessage: '' }
  },
}))

const validateString = (string: string) => {
  if (string.trim().length === 0) return false
  return true
}

const checkPasswordsMatch = (password: string, verify_password: string) => {
  if (password === verify_password) return true

  return false
}

export default useSignUpStore
