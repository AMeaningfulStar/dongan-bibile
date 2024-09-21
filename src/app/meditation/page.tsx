'use client'

import { ko } from 'date-fns/locale'
import moment from 'moment'
import Image from 'next/image'
import { forwardRef } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import useBibleInfo from '@/stores/BibleInfo'

import { PrayerConfirmationButton } from '@/components/Button'
import { KeywordField } from '@/components/InputField'
import { DashboardLayout } from '@/components/Layout'
import { Keywords } from '@/components/MeditationPage'

import SPEECH_BUBBLE_ICON from '@icon/speech_bubble_icon.svg'

export default function Meditation() {
  const { datePick, setDatePick } = useBibleInfo()

  const PickerCustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button className="h-full flex-grow" onClick={onClick} ref={ref}>
      {value}
    </button>
  ))

  return (
    <DashboardLayout pageName="묵상노트">
      <div className="meditation-datepicker flex h-12 w-full items-center gap-x-2.5 px-4 py-3">
        <span className="text-base leading-none">날짜</span>
        <DatePicker
          dateFormat={'MM월 dd일'}
          locale={ko}
          shouldCloseOnSelect
          customInput={<PickerCustomInput />}
          minDate={new Date('2024-07-01')}
          selected={
            moment(datePick, 'YYYY-MM-DD', true).isValid() ? moment(datePick, 'YYYY-MM-DD').toDate() : new Date()
          }
          onChange={(date) => setDatePick(moment(date).format('YYYY-MM-DD'))}
        />
      </div>
      <div className="flex w-full flex-col gap-y-1 p-4">
        <div className="flex gap-x-1">
          <Image alt="icon" src={SPEECH_BUBBLE_ICON} />
          <span className="text-lg leading-none">오늘의 묵상 키워드</span>
        </div>
        <div>나에게 와닿는 키워드를 눌러 공감을 표현해보세요!</div>
      </div>
      <Keywords />
      <KeywordField />
      <div className="flex w-full justify-center">
        <span>오늘 나에게 와닿은 키워드로 10초 동안 기도해보세요</span>
      </div>
      <PrayerConfirmationButton />
    </DashboardLayout>
  )
}
