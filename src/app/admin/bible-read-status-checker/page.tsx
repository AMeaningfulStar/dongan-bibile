'use client'

import moment from 'moment'
import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'

import { DashboardLayout } from '@/components/Layout'
import { firestore } from '@/libs/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function BibleReadStatusChecker() {
  const [datePick, setDatePick] = useState<string>(moment(new Date()).format('YYYY-MM-DD'))
  const [readStatusCount, setReadStatuscount] = useState<number>(0)

  const getBibleReadUserCount = async () => {
    try {
      const userCountQuery = query(
        collection(firestore, 'users'),
        where('bibleReadingDates', 'array-contains', datePick),
      )
      const useCountShapshot = await getDocs(userCountQuery)

      if (!useCountShapshot.empty) {
        setReadStatuscount(useCountShapshot.size)
      }
    } catch (error) {
      console.error('Error checking for bible information:', error)
    }
  }

  useEffect(() => {
    getBibleReadUserCount()
  }, [datePick])

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
          onChange={(date: any) => setDatePick(moment(date).format('YYYY-MM-DD'))}
          value={new Date(datePick)}
        />
        <div className="w-full">
          <span className="text-lg font-normal leading-none">
            {moment(datePick).format('YYYY-MM-DD')} 말씀 읽은 사람 = {readStatusCount} 명
          </span>
        </div>
      </div>
    </DashboardLayout>
  )
}
