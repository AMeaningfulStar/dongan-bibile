'use client'
import { ko } from 'date-fns/locale'
import moment from 'moment'
import { forwardRef } from 'react'
import DatePicker from 'react-datepicker'

import { DashboardLayout } from '@/components/Layout'
import { ClassReadingStatus, GlobalReadingStatus } from '@/components/StatusPage'

import useBibleInfo from '@/stores/BibleInfo'

import 'react-datepicker/dist/react-datepicker.css'

export default function Status() {
  const { datePick, setDatePick } = useBibleInfo()

  const PickerCustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button className="h-full flex-grow" onClick={onClick} ref={ref}>
      {value}
    </button>
  ))

  return (
    <DashboardLayout pageName="읽기현황">
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
            onChange={(date) => setDatePick(moment(date).format('YYYY-MM-DD'))}
          />
        </div>
        <GlobalReadingStatus />
      </div>
      {/* 반 리스트 및 명단 */}
      <div className="flex w-full flex-col gap-y-2.5">
        <ClassReadingStatus gradeNum={1} classNum={1} title="1학년 1반" />
        <ClassReadingStatus gradeNum={1} classNum={2} title="1학년 2반" />
        <ClassReadingStatus gradeNum={1} classNum={3} title="1학년 3반" />
        <ClassReadingStatus gradeNum={1} classNum={4} title="1학년 4반" />
        <ClassReadingStatus gradeNum={1} classNum={5} title="1학년 5반" />
        <ClassReadingStatus gradeNum={2} classNum={1} title="2학년 1반" />
        <ClassReadingStatus gradeNum={2} classNum={2} title="2학년 2반" />
        <ClassReadingStatus gradeNum={2} classNum={3} title="2학년 3반" />
        <ClassReadingStatus gradeNum={2} classNum={4} title="2학년 4반" />
        <ClassReadingStatus gradeNum={3} classNum={3} title="청소년 2부 교사" />
      </div>
    </DashboardLayout>
  )
}
