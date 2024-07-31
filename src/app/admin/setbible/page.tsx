'use client'
import moment from 'moment'
import Link from 'next/link'
import { useState } from 'react'
import Calendar from 'react-calendar'

import { DashboardLayout } from '@/components/Layout'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function SetBible() {
  const [value, onChange] = useState<Value>(new Date())
  return (
    <DashboardLayout pageName="관리자 페이지">
      <div className="flex flex-col items-center gap-y-6 py-2.5">
        <Calendar
          locale="ko"
          formatDay={(locale, data) => moment(data).format('DD')}
          maxDetail="month"
          minDetail="month"
          calendarType="gregory"
          showNeighboringMonth={false}
          className="mx-auto w-full text-sm"
          prev2Label={null}
          next2Label={null}
          view="month"
          onChange={onChange}
          value={value}
        />
        <Link
          href={'/admin'}
          className="flex h-8 w-36 items-center justify-center rounded-lg border border-black bg-white"
        >
          <span className="text-sm font-normal leading-none">뒤로가기</span>
        </Link>
      </div>
    </DashboardLayout>
  )
}
