'use client'

import moment from 'moment'
import Link from 'next/link'
import { useState } from 'react'

import { DatePick } from '@/components/Modal'
import { ClassReadingStatus, GlobalReadingStatus } from '@/components/StatusPage'

import { useAuthStore } from '@/stores/useAuthStore'

interface StatusPageProps {
  searchParams: {
    datePick?: string
  }
}

export default function Status({ searchParams }: StatusPageProps) {
  const datePick = searchParams.datePick || moment(new Date()).format('YYYY-MM-DD')

  const { user } = useAuthStore()
  const [isModal, setIsModal] = useState<boolean>(false)

  const PickerButton = () => {
    const formatDate = (date: string | null) => {
      if (!date) return '00월 00일'

      const match = date.match(/^\d{4}-(\d{2})-(\d{2})$/)
      return match ? `${match[1]}월 ${match[2]}일` : '00월 00일'
    }

    return (
      <button
        onClick={() => setIsModal(true)}
        className="rounded-[10px] border border-gl-black-base px-4 py-1.5 text-caption-16-sb"
      >
        {formatDate(datePick as string)}
      </button>
    )
  }

  if (!user) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center px-4">
        <div className="mb-2 text-caption-15-l">로그인 후 확인 가능합니다</div>
        <div className="mb-10 text-caption-15-l">로그인 페이지로 이동하시겠습니까?</div>
        <Link
          href={'/login'}
          className="flex h-8 w-full max-w-60 items-center justify-center rounded-lg bg-gl-green-opacity-30 active:bg-gl-green-opacity-50"
        >
          <span className="text-sm font-normal leading-none">로그인</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-4">
      <div className="mb-4 flex items-center gap-x-2.5 px-5">
        <PickerButton />
        <GlobalReadingStatus datePick={datePick} />
      </div>
      {/* 반 리스트 및 명단 */}
      <ClassReadingStatus datePick={datePick} gradeNum={1} classNum={1} />
      <ClassReadingStatus datePick={datePick} gradeNum={1} classNum={2} />
      <ClassReadingStatus datePick={datePick} gradeNum={1} classNum={3} />
      <ClassReadingStatus datePick={datePick} gradeNum={1} classNum={4} />
      <ClassReadingStatus datePick={datePick} gradeNum={1} classNum={5} />
      <ClassReadingStatus datePick={datePick} gradeNum={2} classNum={1} />
      <ClassReadingStatus datePick={datePick} gradeNum={2} classNum={2} />
      <ClassReadingStatus datePick={datePick} gradeNum={2} classNum={3} />
      <ClassReadingStatus datePick={datePick} gradeNum={2} classNum={4} />
      <ClassReadingStatus datePick={datePick} gradeNum={3} classNum={1} />
      <ClassReadingStatus datePick={datePick} gradeNum={3} classNum={2} />
      <ClassReadingStatus datePick={datePick} gradeNum={3} classNum={3} />
      <ClassReadingStatus datePick={datePick} gradeNum={3} classNum={4} />
      <ClassReadingStatus datePick={datePick} gradeNum={3} classNum={5} />
      <ClassReadingStatus datePick={datePick} gradeNum={5} classNum={5} />
      <ClassReadingStatus datePick={datePick} gradeNum={4} classNum={4} />
      {isModal && <DatePick path="status" setIsShow={setIsModal} />}
    </div>
  )
}
