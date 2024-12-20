'use client'

import { ko } from 'date-fns/locale'
import { doc, getDoc } from 'firebase/firestore'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { twMerge } from 'tailwind-merge'

import 'react-datepicker/dist/react-datepicker.css'

import { BibleType } from '@/libs/bibleType'
import { firestore } from '@/libs/firebase'
import { useBibleData } from '@/libs/swr/useBibleData'
import useBibleInfo from '@/stores/BibleInfo'

import { BibleReadingBtn, KakaoShareBtn, TextSizeAdjuster, URLCopyBtn } from '@/components/Button'
import { DashboardLayout, ErrorLayout, LoadingLayout } from '@/components/Layout'

import useBibleTextSize from '@/stores/BibleTextSizeStore'

interface BiblePageProps {
  searchParams: {
    datePick?: string
  }
}

export default function Bible({ searchParams }: BiblePageProps) {
  const datePick = searchParams.datePick
  const { bibleType, setBibleType } = useBibleInfo()
  const { textSize } = useBibleTextSize()
  const { bibleData, isLoading, isError } = useBibleData(datePick as string, bibleType)
  const [isShowDrop, setIsShowDrop] = useState<boolean>(false)
  const route = useRouter()

  const PickerCustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button className="h-full flex-grow" onClick={onClick} ref={ref}>
      {value}
    </button>
  ))

  const handleDatePick = async (datePick: string) => {
    const datePickRef = doc(firestore, 'biblePlan', datePick)
    const datePickSnapshot = await getDoc(datePickRef)

    if (datePickSnapshot.exists()) {
      // datePick이 유효한지 확인
      const isValidDate = moment(datePick, 'YYYY-MM-DD', true).isValid()

      if (isValidDate) {
        if (datePickSnapshot.data().bibleInfo.length === 0) {
          route.push('/bible/no-data', { scroll: false })
        } else {
          route.push(`/bible?datePick=${datePick}`, { scroll: false })
        }
      } else {
        console.error('Invalid date selected:', datePick)
        // 유효하지 않은 날짜 처리
      }
    } else {
      route.push('/bible/no-data', { scroll: false })
    }
  }

  const handleDropdown = (type: BibleType) => {
    setBibleType(type)
    setIsShowDrop(false)
  }

  if (isLoading) {
    return <LoadingLayout></LoadingLayout> // 로딩 중일 때 표시할 내용
  }

  if (isError) {
    return <ErrorLayout></ErrorLayout> // 에러 발생 시 표시할 내용
  }

  return (
    <DashboardLayout pageName="말씀읽기">
      {/* 오늘의 말씀 */}
      <div className="w-full border-l-4 border-[#0276F9] bg-[#ECF0FB] py-2.5 pl-2.5">
        <span className="text-base font-semibold leading-none">
          오늘의 말씀: {bibleData?.data[0].title} {bibleData?.data[0].chapter}장 - {bibleData?.data.at(-1)?.title}{' '}
          {bibleData?.data.at(-1)?.chapter}장
        </span>
      </div>
      {/* 세팅 및 공유 */}
      <div className="flex w-full justify-between gap-x-3 px-4 py-3">
        <div className="flex flex-grow gap-x-2.5">
          <div className="text-base">날짜</div>
          <DatePicker
            dateFormat="MM월 dd일" // 날짜 형태
            locale={ko}
            shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
            customInput={<PickerCustomInput />}
            minDate={new Date('2024-07-01')} // minDate 이전 날짜 선택 불가
            selected={
              moment(datePick, 'YYYY-MM-DD', true).isValid() ? moment(datePick, 'YYYY-MM-DD').toDate() : new Date()
            }
            onChange={(date) => handleDatePick(moment(date).format('YYYY-MM-DD'))}
          />
        </div>
        <div className="relative flex flex-grow gap-x-2.5">
          <div className="text-base">성경</div>
          <button className="flex-grow rounded-md border border-black" onClick={() => setIsShowDrop(!isShowDrop)}>
            {bibleType === 'revised_korean' ? '개역개정' : '쉬운성경'}
          </button>
          <div
            id="dropdown"
            className={twMerge(
              isShowDrop
                ? 'absolute left-9 top-7 z-10 w-full divide-y divide-gray-100 rounded-lg border bg-white'
                : 'hidden',
            )}
          >
            <ul className="z-30 py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
              <li>
                <button className="block w-full px-4 py-2 text-start" onClick={() => handleDropdown(BibleType.REVISED)}>
                  개역개정
                </button>
              </li>
              <li>
                <button className="block w-full px-4 py-2 text-start" onClick={() => handleDropdown(BibleType.EASY)}>
                  쉬운성경
                </button>
              </li>
            </ul>
          </div>
        </div>
        <KakaoShareBtn
          startBible={bibleData?.data[0] as { title: string; chapter: number }}
          endBible={bibleData?.data.at(-1) as { title: string; chapter: number }}
        />
        <URLCopyBtn />
      </div>
      {/* 말씀 타이틀 */}
      {bibleData?.data.map((item, idx) => (
        <div key={idx}>
          <div className="flex w-full justify-center py-7">
            <span className="text-xl font-medium leading-none">
              {item.title} {item.chapter}장
            </span>
          </div>

          {item.verses.map((item, idx) => (
            <div key={idx} className={twMerge('flex w-full gap-x-2 whitespace-pre-line px-4 leading-normal', textSize)}>
              <span>{item.verse}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      ))}
      <BibleReadingBtn datePick={datePick as string} />
      <TextSizeAdjuster />
    </DashboardLayout>
  )
}
