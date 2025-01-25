'use client'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { firestore } from '@/libs/firebase'

interface ClassReadingRequest {
  classNum: number
  gradeNum: number
  datePick: string
}

export function ClassReadingStatus({ gradeNum, classNum, datePick }: ClassReadingRequest) {
  const [readCount, setReadCount] = useState<number>(0)
  const [userReadingStatus, setUserReadingStatus] = useState<Array<{ name: string; reading: boolean }>>([])

  useEffect(() => {
    const fetchData = async () => {
      const baseQuery = query(
        collection(firestore, 'users'),
        where('class', '==', classNum),
        where('grade', '==', gradeNum),
      )
      const snapshot = await getDocs(baseQuery)

      const newUserReadingStatus = snapshot.docs.map((doc) => {
        const userData = doc.data()

        return {
          name: userData.name,
          reading: userData.bibleReadingDates?.includes(datePick) || false,
        }
      })

      // 읽은 사람 수 계산
      const readersCount = newUserReadingStatus.filter((user) => user.reading).length

      setReadCount(readersCount)
      setUserReadingStatus(newUserReadingStatus)
    }

    fetchData()
  }, [classNum, gradeNum, datePick])

  return (
    <div className="mb-6 flex w-full flex-col gap-y-4">
      <div className="text-caption-15-m flex justify-between bg-gl-green-opacity-30 px-5 py-2.5">
        <span>{gradeNum === 4 && classNum === 4 ? '청소년부 교사' : `${gradeNum}-${classNum}`}</span>
        <span>
          ({readCount}/{userReadingStatus.length})
        </span>
      </div>
      <div className="text-caption-14-l grid grid-cols-4 gap-x-1.5 gap-y-2.5 px-[18px]">
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
