'use client'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { firestore } from '@/libs/firebase'

export function GlobalReadingStatus({ datePick }: { datePick: string }) {
  const [readCount, setReadCount] = useState<number>(0)

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
    <div className="text-caption-16-l">
      오늘 청신호가 <span className="text-caption-18-sb text-gl-green-base">{readCount}개</span> 켜졌어요
    </div>
  )
}
