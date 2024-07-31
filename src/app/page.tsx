'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { auth } from '@/libs/firebase'
import useFirebaseStore from '@/stores/FirebaseStore'
import useLoginStore from '@/stores/LoginStore'

import LOGIN_BACKGROUND from '@image/Login_Background.svg'
import LOGIN_BOTTOM from '@image/Login_Bottom.svg'

export default function Login() {
  const { loginValue, setUseEmail, setUsePassword, validateLoginValue } = useLoginStore()
  const { firebaseInfo } = useFirebaseStore()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const route = useRouter()

  useEffect(() => {
    if (firebaseInfo.uid) {
      route.push('/main', { scroll: false })
    }
  }, [firebaseInfo])

  const handleOnSunbmit = async () => {
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i

    if (!emailRegEx.test(loginValue.email)) {
      setErrorMessage('올바른 이메일 형식이 아닙니다')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    if (!validateLoginValue().isError) {
      signInWithEmailAndPassword(auth, loginValue.email, loginValue.password)
        .then((userCredential) => {
          if (userCredential.user) {
            route.push('/main', { scroll: false })
          }
        })
        .catch(() => {
          setErrorMessage('로그인에 실패했습니다')
          setTimeout(() => setErrorMessage(''), 3000)
        })
    } else {
      setErrorMessage('이메일과 비밀번호를 확인해주세요')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-black pb-9 pt-10">
      <Image alt="backbround image" src={LOGIN_BACKGROUND} className="mb-2.5" />
      <div className="flex flex-col gap-y-2.5">
        <div className="flex min-w-56 items-center justify-between">
          <label htmlFor="userID" className="text-xl font-light leading-none text-white">
            Email
          </label>
          <input
            id="userID"
            type="email"
            className="h-7 pl-1 outline-none"
            placeholder="이메일 입력해주세요"
            value={loginValue.email}
            onChange={(event) => setUseEmail(event.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="userPW" className="text-xl font-light leading-none text-white">
            PW
          </label>
          <input
            id="userPW"
            type="password"
            className="h-7 pl-1 outline-none"
            placeholder="비밀번호를 입력하세요"
            value={loginValue.password}
            onChange={(event) => setUsePassword(event.target.value)}
          />
        </div>
      </div>
      <div className="h-5">
        <span className="text-red-500">{errorMessage}</span>
      </div>
      <button
        onClick={async () => handleOnSunbmit()}
        className="mb-5 flex h-8 w-32 items-center justify-center rounded-lg bg-white active:bg-gray-400"
      >
        <span className="text-sm font-normal leading-none">로그인</span>
      </button>
      <p className="mb-4 text-base font-normal leading-none text-white">버전: 1.0.0</p>
      <div className="mb-4 flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <button className="h-8 w-32 rounded-lg bg-white">
            <span className="text-sm font-normal leading-none">비밀번호 찾기</span>
          </button>
          <Link href={'/signup'} className="flex h-8 w-32 items-center justify-center rounded-lg bg-white">
            <span className="text-sm font-normal leading-none">회원가입</span>
          </Link>
        </div>
        <div className="flex gap-x-4">
          <button className="h-8 w-32 rounded-lg bg-white">
            <span className="text-sm font-normal leading-none">이용 가이드</span>
          </button>
          <button className="h-8 w-32 rounded-lg bg-white">
            <span className="text-sm font-normal leading-none">문의하기</span>
          </button>
        </div>
      </div>
      <Image alt="image" src={LOGIN_BOTTOM} />
    </div>
  )
}
