'use client'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import useBibleInfo from '@/stores/BibleInfo'

import { firestore } from '@/libs/firebase'

export function GlobalReadingStatus() {
  const [readCount, setReadCount] = useState<number>(0)
  const { datePick } = useBibleInfo()

  useEffect(() => {
    const fetchData = async () => {
      const userCountQuery = query(
        collection(firestore, 'users'),
        where('bibleReadingDates', 'array-contains', datePick),
      )
      const useCountShapshot = await getDocs(userCountQuery)

      if (!useCountShapshot.empty) {
        setReadCount(useCountShapshot.size)
      }
    }

    fetchData()
  }, [datePick])

  return (
    <div className="flex flex-grow gap-x-2.5">
      <div className="text-base">오늘 읽은 사람</div>
      <div className="flex flex-grow items-center justify-center rounded-md border border-black">
        <span>{readCount}명</span>
      </div>
    </div>
  )
}
