'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Calendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import BIBLE_ICON from '@icon/bible_icon.svg'
import CALENDAR_ICON from '@icon/calendar_icon.svg'
import EVENT_ICON from '@icon/event_icon.svg'
import MEDITATION_ICON from '@icon/meditation_icon.svg'
import STATUS_ICON from '@icon/status_icon.svg'

export type DatePiece = Date | null
export type SelectedDate = DatePiece | [DatePiece, DatePiece]

export default function Main() {
  // FIXME: 임시 작업
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(new Date())

  useEffect(() => {
    console.log('🚀 ~ Home ~ selectedDate:', selectedDate)
  }, [selectedDate])

  return (
    <div className="flex min-h-screen w-full flex-col items-center py-20">
      <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white pb-3 pt-10">
        <span className="text-xl font-light leading-none">홈</span>
      </div>
      {/* 청신호 연속 읽은 날짜 텍스트 */}
      <div className="w-full px-4 py-2.5">
        <div className="rounded-full bg-[#E8EEFF] py-2.5 pl-5">
          <div className="text-lg font-light leading-none">
            청신호 연속 <span className="font-medium text-[#0276F9]">000</span> 일째
          </div>
        </div>
      </div>
      {/* 캘린더 */}
      <div className="mb-10 flex w-full flex-col items-center px-4">
        <div className="w-full py-5 text-lg font-light leading-none">나의 말씀 읽기</div>
        {/* FIXME: 캘린더는 수정이 필요 */}
        <Calendar
          locale="ko"
          calendarType="gregory"
          showNeighboringMonth={false}
          prev2Label={null}
          next2Label={null}
          view="month"
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </div>
      {/* 청신호 진행률 */}
      <div className="mb-3 flex w-full flex-col gap-y-3 px-4">
        <div className="pt-5 text-lg font-light leading-none">청신호 진행률</div>
        <div className="flex items-center gap-x-2">
          <div className="h-2 flex-grow bg-[#E8EEFF]"></div>
          <div>000 %</div>
        </div>
      </div>
      {/* 나의 진행률 */}
      <div className="mb-16 flex w-full flex-col gap-y-3 px-4">
        <div className="pt-5 text-lg font-light leading-none">나의 진행률</div>
        <div className="flex items-center gap-x-2">
          <div className="h-2 flex-grow bg-[#E8EEFF]"></div>
          <div>000 %</div>
        </div>
      </div>
      {/* 버전 */}
      <p className="mb-6 text-base font-normal leading-none">버전: 1.0</p>
      {/* 버튼 4개 */}
      <div className="mb-6 flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <button className="h-8 w-32 rounded-lg border border-black bg-white">
            <span className="text-sm font-normal leading-none">비밀번호 찾기</span>
          </button>
          <button className="h-8 w-32 rounded-lg border border-black bg-white">
            <span className="text-sm font-normal leading-none">회원가입</span>
          </button>
        </div>
        <div className="flex gap-x-4">
          <button className="h-8 w-32 rounded-lg border border-black bg-white">
            <span className="text-sm font-normal leading-none">이용 가이드</span>
          </button>
          <button className="h-8 w-32 rounded-lg border border-black bg-white">
            <span className="text-sm font-normal leading-none">문의하기</span>
          </button>
        </div>
      </div>
      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 flex w-full justify-between border-y border-b-white bg-white pb-9">
        <Link href={'/home'} className="px-6 py-3">
          <Image alt="button" src={CALENDAR_ICON} />
        </Link>
        <Link href={'/meditation'} className="px-6 py-3">
          <Image alt="button" src={MEDITATION_ICON} />
        </Link>
        <Link href={'/home'} className="px-6 py-3">
          <Image alt="button" src={BIBLE_ICON} />
        </Link>
        <Link href={'/home'} className="px-6 py-3">
          <Image alt="button" src={STATUS_ICON} />
        </Link>
        <Link href={'/home'} className="px-6 py-3">
          <Image alt="button" src={EVENT_ICON} />
        </Link>
      </div>
    </div>
  )
}
