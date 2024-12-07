'use client'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { firestore } from '@/libs/firebase'

import useBibleInfo from '@/stores/BibleInfo'
import useFirebaseStore from '@/stores/FirebaseStore'

export function PrayerConfirmationButton() {
  const { firebaseInfo } = useFirebaseStore()
  const { datePick } = useBibleInfo()

  const [isPrayerBtnDisabled, setIsPrayerBtnDisabled] = useState(true)

  // 비동기 함수 내부에서 호출
  const checkDisabledState = async () => {
    try {
      if (!firebaseInfo.uid) return

      const bibleReadRef = doc(firestore, 'users', firebaseInfo.uid as string)
      const bibleReadSnap = await getDoc(bibleReadRef)

      if (bibleReadSnap.exists()) {
        const today = new Date().setHours(0, 0, 0, 0) // 오늘 날짜
        const selectedDate = new Date(datePick).setHours(0, 0, 0, 0) // 선택한 날짜

        if (selectedDate > today) {
          setIsPrayerBtnDisabled(true)
          return
        }

        const prayerDates = bibleReadSnap.data().prayerDates as Array<string>

        if (prayerDates.includes(datePick)) {
          setIsPrayerBtnDisabled(true)
          return
        }
      }

      setIsPrayerBtnDisabled(false)
    } catch (error) {
      console.error('Error checking for prayer:', error)
      setIsPrayerBtnDisabled(true) // 오류 발생 시 버튼 비활성화
    }
  }

  const handlePrayerButtonClick = async () => {
    try {
      const bibleReadRef = doc(firestore, 'users', firebaseInfo.uid as string)
      const bibleReadSnap = await getDoc(bibleReadRef)

      if (bibleReadSnap.exists()) {
        // 현재 날짜와 datePick 비교
        const today = new Date().setHours(0, 0, 0, 0) // 오늘 날짜를 기준으로 시간 초기화
        const selectedDate = new Date(datePick).setHours(0, 0, 0, 0) // 선택한 날짜의 시간 초기화

        if (selectedDate > today) {
          alert('해당 날짜에 다시 시도하세요')
          return
        }

        if (!firebaseInfo.bibleReadingDates?.includes(datePick)) {
          alert('먼저 말씀을 읽어주세요')
          return
        }

        await updateDoc(bibleReadRef, {
          prayerDates: arrayUnion(datePick),
        }).then(() => checkDisabledState())
      }
    } catch (error) {
      console.error('Error checking for prayer:', error)
    }
  }

  useEffect(() => {
    checkDisabledState()
  }, [datePick, firebaseInfo.uid])

  return (
    <div className="flex w-full justify-center py-5">
      <button
        className={twMerge(
          'h-9 w-40 rounded-full border',
          isPrayerBtnDisabled ? 'border-[#AAA] bg-[#EEE] text-[#AAA]' : 'border-[#0276F9] bg-[#0276F9] text-white',
        )}
        onClick={() => handlePrayerButtonClick()}
        disabled={isPrayerBtnDisabled}
      >
        기도했습니다
      </button>
    </div>
  )
}
