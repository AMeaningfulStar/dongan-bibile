'use client'

import Link from 'next/link'

import { LoginPageLayout } from '@/components/Layout'

export type DatePiece = Date | null
export type SelectedDate = DatePiece | [DatePiece, DatePiece]

export default function Home() {
  return (
    <LoginPageLayout pageName="로그인">
      <div className="relative h-full w-full">
        {/* FIXME: 배경 이미지로 변경 */}
        <div className="h-full w-full bg-slate-400"></div>
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="mb-10 flex w-52 flex-col gap-y-3.5">
              <div className="flex items-center justify-between">
                <label htmlFor="userID" className="text-xl font-light leading-none">
                  ID
                </label>
                <input
                  id="userID"
                  className="h-7 border border-black pl-0.5 outline-none"
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="userPW" className="text-xl font-light leading-none">
                  PW
                </label>
                <input
                  id="userPW"
                  className="h-7 border border-black pl-0.5 outline-none"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>
            {/* FIXME: Link에서 버튼으로 바꾸고 Login 기능 넣어야함 */}
            <Link href={'/home'} className="mb-10 rounded-lg border border-black bg-white px-10 py-3">
              로그인
            </Link>
            <p className="mb-8 text-base font-light leading-none">버전: 4.0</p>
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2">
                <button className="h-8 w-24 rounded-lg border border-black bg-white">비밀번호 변경</button>
                <button className="h-8 w-24 rounded-lg border border-black bg-white">로그아웃</button>
              </div>
              <div className="flex gap-x-2">
                <button className="h-8 w-24 rounded-lg border border-black bg-white">이용 가이드</button>
                <button className="h-8 w-24 rounded-lg border border-black bg-white">문의하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoginPageLayout>
  )
}
