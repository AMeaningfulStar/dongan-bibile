'use client'

import Image from 'next/image'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import useSignUpStore from '@/stores/SignUpStore'

import ARROWUP_ICON from '@icon/arrowup_icon.svg'
import SIGNUP_BACKGROUND from '@image/Signup_Background.svg'

export default function SignUp() {
  const {
    signUpValue,
    setUseName,
    setUseEmail,
    setUsePassword,
    setUseVerifyPassword,
    setUsePhoneNum,
    setUsePosition,
    setUseAffiliation,
  } = useSignUpStore()
  const [isShowDrop, setIsShowDrop] = useState<boolean>(false)

  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center bg-black">
      <Image alt="backbround image" src={SIGNUP_BACKGROUND} className="mb-2.5" />
      <div className="absolute h-full w-full px-3 pb-9 pt-12">
        <div className="flex h-full w-full flex-col items-center rounded-xl bg-white bg-opacity-50 p-2">
          <div className="px-5 py-2">
            <span className="text-2xl font-semibold leading-none text-white">회원가입</span>
          </div>
          <div className="flex w-full flex-grow flex-col gap-y-4 overflow-scroll rounded-xl bg-white bg-opacity-70 p-2">
            <div className="flex flex-col gap-y-1">
              <label htmlFor="name" className="ml-1 text-base font-light">
                이름
              </label>
              <input
                id="name"
                type="text"
                placeholder="이름 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUseName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="email" className="ml-1 text-base font-light">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="이메일 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUseEmail(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="password" className="ml-1 text-base font-light">
                비밀번호 (최소 8자 이상)
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUsePassword(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="verify_password" className="ml-1 text-base font-light">
                비밀번호 확인
              </label>
              <input
                id="verify_password"
                type="password"
                placeholder="비밀번호 확인 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUseVerifyPassword(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="phoneNum" className="ml-1 text-base font-light">
                전화번호
              </label>
              <input
                id="phoneNum"
                type="number"
                placeholder="전화번호 입력해주세요"
                className="p-1 text-base outline-none"
                onChange={(event) => setUsePhoneNum(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="position" className="ml-1 text-base font-light">
                직분
              </label>
              <div className="flex flex-grow justify-between gap-x-4">
                <button
                  className={twMerge(
                    'flex-grow rounded-lg border-2 border-transparent bg-white py-2',
                    signUpValue.usePosition === 'teacher' && 'border-2 border-blue-500 bg-blue-100',
                  )}
                  onClick={() => setUsePosition('teacher')}
                >
                  교사
                </button>
                <button
                  className={twMerge(
                    'flex-grow rounded-lg border-2 border-transparent bg-white py-2',
                    signUpValue.usePosition === 'student' && 'border-2 border-blue-500 bg-blue-100',
                  )}
                  onClick={() => setUsePosition('student')}
                >
                  학생
                </button>
              </div>
            </div>
            <div className="relative flex flex-col gap-y-1">
              <label htmlFor="affiliation" className="ml-1 text-base font-light">
                소속
              </label>
              <button
                className={twMerge(
                  'flex items-center justify-between rounded-lg px-5 py-2 text-center text-sm font-medium',
                  isShowDrop ? 'bg-blue-100' : 'bg-white',
                )}
                type="button"
                id="affiliation"
                onClick={() => setIsShowDrop(!isShowDrop)}
              >
                {signUpValue.useAffiliation === '' ? '소속을 선택해주세요' : signUpValue.useAffiliation}{' '}
                <Image alt="icon" src={ARROWUP_ICON} />
              </button>
              <div
                id="dropdown"
                className={twMerge(
                  isShowDrop
                    ? 'absolute bottom-10 z-10 w-full divide-y divide-gray-100 rounded-lg bg-white shadow'
                    : 'hidden',
                )}
              >
                <ul className="z-30 py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                  <li>
                    <button className="block px-4 py-2">1학년 1반</button>
                  </li>
                  <li>
                    <button className="block px-4 py-2">Settings</button>
                  </li>
                  <li>
                    <button className="block px-4 py-2">Earnings</button>
                  </li>
                  <li>
                    <button className="block px-4 py-2">Sign out</button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="my-4 flex items-center justify-center">
              <button className="h-8 w-32 rounded-lg bg-white active:bg-gray-400 active:text-white">
                <span className="text-sm font-normal leading-none">회원가입하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
