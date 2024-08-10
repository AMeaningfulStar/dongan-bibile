import { create } from 'zustand'

interface SignupStoreType {
  signUpValue: SignupState
  errorMessage: string
  initSignUpValue: () => void
  setUseName: (inputValue: string) => void
  setUseEmail: (inputValue: string) => void
  setUsePassword: (inputValue: string) => void
  setUseVerifyPassword: (inputValue: string) => void
  setUsePhoneNum: (inputValue: string) => void
  setUsePosition: (inputValue: string) => void
  setUseGrade: (inputValue: number) => void
  setUseClass: (inputValue: number) => void
  setErrorMessage: (newErrorMessage: string) => void
  checkPasswordsLength: () => boolean
  checkPasswordsMatch: () => boolean
  validateSignUpValue: () => { isError: boolean; errorMessage: string }
}

interface SignupState {
  useName: string
  useEmail: string
  usePassword: string
  useVerifyPassword: string
  usePhoneNum: string
  usePosition: string
  useGrade: number
  useClass: number
}

const useSignUpStore = create<SignupStoreType>()((set, get) => ({
  signUpValue: {
    useName: '',
    useEmail: '',
    usePassword: '',
    useVerifyPassword: '',
    usePhoneNum: '',
    usePosition: '',
    useGrade: 0,
    useClass: 0,
  },

  errorMessage: '',

  // 회원가입 입력 정보 초기화
  initSignUpValue: () =>
    set((state: SignupStoreType) => ({
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
    set((state: SignupStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useName: inputValue,
      },
    })),

  // 사용자 Email set
  setUseEmail: (inputValue) =>
    set((state: SignupStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useEmail: inputValue,
      },
    })),

  // 사용자 비밀번호 set
  setUsePassword: (inputValue) =>
    set((state: SignupStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        usePassword: inputValue,
      },
    })),

  // 사용자 비밀번호 set
  setUseVerifyPassword: (inputValue) =>
    set((state: SignupStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useVerifyPassword: inputValue,
      },
    })),

  // 사용자 전화번호 set
  setUsePhoneNum: (inputValue) =>
    set((state: SignupStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        usePhoneNum: inputValue,
      },
    })),

  // 사용자 직분 set
  setUsePosition: (inputValue) =>
    set((state: SignupStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        usePosition: inputValue,
      },
    })),

  // 사용자 학년 set
  setUseGrade: (inputValue) =>
    set((state: SignupStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useGrade: inputValue,
      },
    })),

  // 사용자 반 set
  setUseClass: (inputValue) =>
    set((state: SignupStoreType) => ({
      signUpValue: {
        ...state.signUpValue,
        useClass: inputValue,
      },
    })),

  setErrorMessage: (newErrorMessage) =>
    set((state: SignupStoreType) => ({
      ...state,
      errorMessage: newErrorMessage,
    })),

  checkPasswordsLength: () => {
    const { usePassword } = get().signUpValue

    if (usePassword.length >= 6) return true

    return false
  },

  checkPasswordsMatch: () => {
    const { usePassword, useVerifyPassword } = get().signUpValue
    if (usePassword === useVerifyPassword) return true

    return false
  },

  validateSignUpValue: () => {
    const { useName, useEmail, usePassword, useVerifyPassword, usePhoneNum, usePosition, useGrade, useClass } =
      get().signUpValue

    // 모든 정보를 입력했는지 확인
    if (
      !validateString(useName) ||
      !validateString(useEmail) ||
      !validateString(usePassword) ||
      !validateString(useVerifyPassword) ||
      !validateString(usePhoneNum) ||
      !validateString(usePosition) ||
      !validateNumber(useGrade) ||
      !validateNumber(useClass)
    )
      return { isError: true, errorMessage: '모든 정보를 입력바랍니다' }

    return { isError: false, errorMessage: '' }
  },
}))

const validateString = (string: string) => {
  if (string.trim().length === 0) return false
  return true
}

const validateNumber = (number: number) => {
  if (number === 0) return false

  return true
}

export default useSignUpStore
