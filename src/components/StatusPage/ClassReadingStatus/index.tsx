'use client'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { firestore } from '@/libs/firebase'

interface ClassReadingRequest {
  classNum: number
  gradeNum: number
  datePick: string
}

export function ClassReadingStatus({ gradeNum, classNum, datePick }: ClassReadingRequest) {
  const [userReadingStatus, setUserReadingStatus] = useState<Array<{ name: string; reading: boolean }>>([])

  const fetchData = useCallback(async () => {
    const baseQuery = query(
      collection(firestore, 'users'),
      where('class', '==', classNum),
      where('grade', '==', gradeNum),
    )
    const snapshot = await getDocs(baseQuery)

    const newUserReadingStatus = snapshot.docs
      .map((doc) => {
        const userData = doc.data()
        return {
          name: userData.name,
          reading: userData.bibleReadingDates?.includes(datePick) || false,
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'))

    setUserReadingStatus(newUserReadingStatus)
  }, [classNum, gradeNum, datePick])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const readCount = useMemo(() => userReadingStatus.filter((user) => user.reading).length, [userReadingStatus])

  return (
    <div className="mb-6 flex w-full flex-col gap-y-4">
      <div className="flex justify-between bg-gl-green-opacity-30 px-5 py-2.5 text-caption-15-m">
        <span>
          {gradeNum === 4 && classNum === 4
            ? '청소년부 교사'
            : gradeNum === 5 && classNum === 5
              ? '그 외'
              : `${gradeNum}-${classNum}`}
        </span>
        <span>
          ({readCount}/{userReadingStatus.length})
        </span>
      </div>
      <div className="grid grid-cols-4 gap-x-1.5 gap-y-2.5 px-[18px] text-caption-14-l">
        {userReadingStatus.map((item, idx) => (
          <div
            key={idx}
            className={twMerge(
              'flex items-center justify-center rounded-lg px-5 py-2',
              item.reading ? 'bg-gl-green-opacity-50' : 'bg-gl-grayscale-base',
            )}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}
