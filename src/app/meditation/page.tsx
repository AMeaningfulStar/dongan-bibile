'use client'
import { ko } from 'date-fns/locale'
import moment from 'moment'
import Image from 'next/image'
import { forwardRef, KeyboardEvent, useState } from 'react'
import DatePicker from 'react-datepicker'

import { DashboardLayout } from '@/components/Layout'

import useBibleInfo from '@/stores/BibleInfo'

import KEYWORD_ADD_ICON from '@icon/keyword_add_icon.svg'
import LIGHTUP_SMALL_ICON from '@icon/lightup_small_icon.svg'
import SPEECH_BUBBLE_ICON from '@icon/speech_bubble_icon.svg'

export default function Meditation() {
  const [inputValue, setInputValue] = useState<string>('')
  const { datePick } = useBibleInfo()

  const PickerCustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button className="h-full flex-grow" onClick={onClick} ref={ref}>
      {value}
    </button>
  ))

  const activeEnter = (event: KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return
    }
    if (event.key === 'Enter') {
      return createKeyword()
    }
  }

  const createKeyword = async () => {
    console.log(inputValue)
  }

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
        />
      </div>
      <div className="flex w-full flex-col gap-y-1 p-4">
        <div className="flex gap-x-1">
          <Image alt="icon" src={SPEECH_BUBBLE_ICON} />
          <span className="text-lg leading-none">오늘의 묵상 키워드</span>
        </div>
        <div>나에게 와닿는 키워드를 눌러 공감을 표현해보세요!</div>
      </div>
      <div className="mb-7 flex h-36 w-full flex-wrap gap-2 overflow-y-scroll px-4">
        {/* <div className="flex h-[1.875rem] items-center gap-x-px rounded-full bg-slate-400 px-3">
          <span># 희생하는사랑</span>
          <span>(4)</span>
        </div> */}
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
          <Image alt="lightup icon" src={LIGHTUP_SMALL_ICON} />
          <span className="font-light">오늘의 묵상 키워드를 추가해보세요</span>
        </div>
      </div>
      <div className="mb-5 flex w-full items-end gap-x-2 px-4 py-5">
        <div className="h-[1.875rem] w-full border-b border-[#222]">
          <input
            type="text"
            maxLength={10}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => activeEnter(event)}
            className="h-full w-full p-2 outline-none"
            placeholder="나만의 키워드를 추가해보세요"
          />
        </div>
        <button className="" onClick={() => createKeyword()}>
          <Image alt="add button" src={KEYWORD_ADD_ICON} />
        </button>
      </div>
      <div className="flex w-full justify-center">
        <span>오늘 나에게 와닿은 키워드로 10초 동안 기도해보세요</span>
      </div>
      <div className="flex w-full justify-center py-5">
        <button className="h-9 w-40 rounded-full border border-[#0276F9] bg-[#0276F9] text-white">기도했습니다</button>
      </div>
    </DashboardLayout>
  )
}
