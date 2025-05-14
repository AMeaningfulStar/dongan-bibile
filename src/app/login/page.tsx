'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useLogin } from '@/hooks'

interface LoginType {
  id: string
  password: string
}

export default function Login() {
  // 입력 값 state
  const [loginValue, setLoginValue] = useState<LoginType>({
    id: '',
    password: '',
  })

  const { login } = useLogin()

  // 에러 메세지 관리 state
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  const handleOnSunbmit = async () => {
    try {
      await login({ id: loginValue.id, password: loginValue.password })
      router.push('/', { scroll: false })
    } catch (e: any) {
      setErrorMessage(e.message)
    }
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
            className="w-full rounded border border-gl-grayscale-base p-2 outline-none focus:border-gl-grayscale-200"
            onChange={(event) => setLoginValue((prev: LoginType) => ({ ...prev, id: event.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="password" className="">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded border border-gl-grayscale-base p-2 outline-none focus:border-gl-grayscale-200"
            onChange={(event) => setLoginValue((prev: LoginType) => ({ ...prev, password: event.target.value }))}
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
