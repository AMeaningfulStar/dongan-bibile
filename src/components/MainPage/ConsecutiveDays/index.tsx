'use client'

import { doc, getDoc } from 'firebase/firestore'
import moment from 'moment'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { auth, firestore } from '@/libs/firebase'

import FIRE_ICON from '@icon/fire_icon.svg'
import { onAuthStateChanged } from 'firebase/auth'

export function ConsecutiveDays() {
  const [consecutiveDays, setConsecutiveDays] = useState<number>(0)

  const calculateConsecutiveDays = (bibleReadingDates: Array<string>) => {
    // bibleReadingDates가 빈 배열 혹은 하나의 값만 가지고 있는 배열이라면 배열의 크기로 반환
    if (bibleReadingDates.length <= 1) return setConsecutiveDays(bibleReadingDates.length)

    // 날짜 배열을 날짜 객체로 변환하고 내림차순으로 정렬
    const sortedDates = bibleReadingDates.map((date) => moment(date, 'YYYY-MM-DD')).sort((a, b) => b.diff(a))

    // 연속된 날을 계산한 값
    let currentConsecutiveDays = 1

    // 정렬된 날짜 배열을 순회
    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i] // 현재 날짜
      const previousDate = i + 1 !== sortedDates.length ? sortedDates[i + 1] : null // 다음 날짜

      if (previousDate && date.diff(previousDate, 'days') === 1) {
        currentConsecutiveDays++
      } else {
        break
      }
    }

    setConsecutiveDays(currentConsecutiveDays)
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          calculateConsecutiveDays(docSnap.data().bibleReadingDates as Array<string>)
        } else {
          console.log('No such user consecutiveDays')
        }
      }
    })
  }, [])

  return (
    <div className="w-full px-4 py-2.5">
      <div className="item-center flex gap-x-1 rounded-full bg-[#E8EEFF] py-2.5 pl-5">
        <div className="text-lg font-light leading-none">
          청신호 연속 <span className="font-medium text-[#0276F9]">{consecutiveDays}</span> 일째
        </div>
        <Image alt="icon" src={FIRE_ICON} />
      </div>
    </div>
  )
}
