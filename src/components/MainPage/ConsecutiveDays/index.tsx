'use client'

import moment from 'moment'
import Image from 'next/image'

import useFirebaseStore from '@/stores/FirebaseStore'

import FIRE_ICON from '@icon/fire_icon.svg'

export function ConsecutiveDays() {
  const { firebaseInfo } = useFirebaseStore()

  const calculateConsecutiveDays = (bibleReadingDates: Array<string> | null) => {
    // bibleReadingDates가 null이면 기본값 0 반환
    if (!bibleReadingDates) return 0
    // bibleReadingDates가 빈 배열 혹은 하나의 값만 가지고 있는 배열이라면 배열의 크기로 반환
    if (bibleReadingDates.length <= 1) return bibleReadingDates.length

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

    return currentConsecutiveDays
  }

  return (
    <div className="w-full px-4 py-2.5">
      <div className="item-center flex gap-x-1 rounded-full bg-[#E8EEFF] py-2.5 pl-5">
        <div className="text-lg font-light leading-none">
          청신호 연속{' '}
          <span className="font-medium text-[#0276F9]">
            {calculateConsecutiveDays(firebaseInfo.bibleReadingDates as Array<string>)}
          </span>{' '}
          일째
        </div>
        <Image alt="icon" src={FIRE_ICON} />
      </div>
    </div>
  )
}
