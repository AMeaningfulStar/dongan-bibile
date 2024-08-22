'use client'
import { ko } from 'date-fns/locale'
import { forwardRef } from 'react'
import DatePicker from 'react-datepicker'

import { DashboardLayout } from '@/components/Layout'
import useBibleInfo from '@/stores/BibleInfo'
import moment from 'moment'

export default function Meditation() {
  const { datePick } = useBibleInfo()

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
        />
      </div>
    </DashboardLayout>
  )
}
