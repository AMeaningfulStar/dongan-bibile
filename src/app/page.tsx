'use client'

import Image from 'next/image'
import Link from 'next/link'

import LOGIN_BACKGROUND from '@image/Login_Background.svg'
import LOGIN_BOTTOM from '@image/Login_Bottom.svg'

export default function Login() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-black pb-9 pt-10">
      <Image alt="backbround image" src={LOGIN_BACKGROUND} className="mb-2.5" />
      <div className="mb-5 flex flex-col gap-y-2.5">
        <div className="flex min-w-56 items-center justify-between">
          <label htmlFor="userID" className="text-xl font-light leading-none text-white">
            ID
          </label>
          <input id="userID" className="h-7 pl-1 outline-none" placeholder="아이디를 입력하세요" />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="userPW" className="text-xl font-light leading-none text-white">
            PW
          </label>
          <input id="userPW" className="h-7 pl-1 outline-none" placeholder="비밀번호를 입력하세요" />
        </div>
      </div>
      <Link href={'/home'} className="mb-5 flex h-8 w-32 items-center justify-center rounded-lg bg-white">
        <span className="text-sm font-normal leading-none">로그인</span>
      </Link>
      <p className="mb-4 text-base font-normal leading-none text-white">버전: 1.0</p>
      <div className="mb-4 flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <button className="h-8 w-32 rounded-lg bg-white">
            <span className="text-sm font-normal leading-none">비밀번호 찾기</span>
          </button>
          <button className="h-8 w-32 rounded-lg bg-white">
            <span className="text-sm font-normal leading-none">회원가입</span>
          </button>
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
