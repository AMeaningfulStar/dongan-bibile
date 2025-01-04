'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { auth } from '@/libs/firebase'
import useFirebaseStore from '@/stores/FirebaseStore'

interface LoginType {
  id: string
  password: string
}

interface InputErrorType {
  idError: boolean
  passwordError: boolean
}

export default function Login() {
  // 입력 값 state
  const [login, setLogin] = useState<LoginType>({
    id: '',
    password: '',
  })

  // 입력 값이 오류 일 시, error 관리 state
  const [inputError, setInputError] = useState<InputErrorType>({
    idError: false,
    passwordError: false,
  })

  // 에러 메세지 관리 state
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { firebaseInfo } = useFirebaseStore()
  const route = useRouter()

  useEffect(() => {
    if (firebaseInfo.uid) {
      route.push('/main', { scroll: false })
    }
  }, [firebaseInfo])

  const handleOnSunbmit = async () => {
    // FIXME: 추후 프로젝트의 진행 방향에 따라 수정해야함
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i
    const useId = `${login.id}@dongan.com`

    if (!emailRegEx.test(useId)) {
      setErrorMessage('올바른 아이디 형식이 아닙니다')
      setInputError((prev) => ({ ...prev, idError: true }))
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    if (login.password.length <= 5) {
      setErrorMessage('올바른 비밀번호 형식이 아닙니다')
      setInputError((prev) => ({ ...prev, passwordError: true }))
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    signInWithEmailAndPassword(auth, useId, login.password)
      .then((userCredential) => {
        if (userCredential.user) {
          route.push('/main', { scroll: false })
        }
      })
      .catch(() => {
        setErrorMessage('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요')
        setTimeout(() => setErrorMessage(''), 3000)
      })
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-y-12 px-10">
      <div className="text-2xl">청소년 말씀 통독</div>
      <div className="flex w-full flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="id" className="">
            아이디
          </label>
          <input
            id="id"
            type="text"
            className={twMerge(
              ' w-full rounded border p-2 outline-none',
              inputError.idError ? 'border-gl-red-base' : 'border-gl-grayscale-base focus:border-gl-grayscale-200',
            )}
            onChange={(event) => setLogin((prev: LoginType) => ({ ...prev, id: event.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="password" className="">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            className="border-gl-grayscale-base focus:border-gl-grayscale-200 w-full rounded border p-2 outline-none"
            onChange={(event) => setLogin((prev: LoginType) => ({ ...prev, password: event.target.value }))}
          />
        </div>
        <div className="h-5">
          <span className="text-red-500">{errorMessage}</span>
        </div>
        <button
          onClick={async () => await handleOnSunbmit()}
          className="flex h-8 w-full items-center justify-center rounded-lg bg-gl-green-opacity-30 active:bg-gl-green-opacity-50"
        >
          <span className="text-sm font-normal leading-none">로그인</span>
        </button>
      </div>
    </div>
  )
}
