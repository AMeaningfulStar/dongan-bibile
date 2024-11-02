'use client'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { firestore } from '@/libs/firebase'
import useBibleInfo from '@/stores/BibleInfo'

interface ClassReadingRequest {
  title: string
  classNum: number
  gradeNum: number
}

export function ClassReadingStatus({ title, gradeNum, classNum }: ClassReadingRequest) {
  const { datePick } = useBibleInfo()

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
    <div className="w-full">
      <div className="flex justify-between bg-[#E8EEFF] px-4 py-2 text-lg leading-none">
        <span className="flex-grow text-center font-light">{title}</span>
        <span className="font-light">
          ({readCount}/{userReadingStatus.length})
        </span>
      </div>
      <div className="grid grid-cols-4 justify-center gap-x-1.5 gap-y-2.5 px-4 py-4">
        {userReadingStatus.map((item, idx) => (
          <div
            key={idx}
            className={twMerge(
              'flex  items-center justify-center rounded-lg px-4 py-2',
              item.reading ? 'bg-[#64ABFB]' : 'bg-[#EEEEEE]',
            )}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}
