import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

import { firestore } from '@/libs/firebase'

import useFirebaseStore from '@/stores/FirebaseStore'

interface BibleReadingBtnProps {
  datePick: string
}

export function BibleReadingBtn({ datePick }: BibleReadingBtnProps) {
  const { firebaseInfo } = useFirebaseStore()
  const route = useRouter()

  const buttonColor = () => {
    if (firebaseInfo.bibleReadingDates?.includes(datePick as string) || !firebaseInfo.uid) {
      return 'border-[#CCC] bg-[#CCC] text-white'
    }

    return 'border-[#0276F9] bg-[#0276F9] text-white'
  }

  const handleBibleRead = async () => {
    try {
      const bibleReadRef = doc(firestore, 'users', firebaseInfo.uid as string)
      const bibleReadSnap = await getDoc(bibleReadRef)

      if (bibleReadSnap.exists()) {
        // 현재 날짜와 datePick 비교
        const today = new Date().setHours(0, 0, 0, 0) // 오늘 날짜를 기준으로 시간 초기화
        const selectedDate = new Date(datePick as string).setHours(0, 0, 0, 0) // 선택한 날짜의 시간 초기화

        if (selectedDate > today) {
          alert('미리 읽기 완료는 할 수 없습니다')
          return // 미래 날짜면 함수 종료
        }

        await updateDoc(bibleReadRef, {
          bibleReadingDates: arrayUnion(datePick),
        }).then(() => route.push('/meditation', { scroll: false }))
      }
    } catch (error) {
      console.error('Error checking for bible read:', error)
    }
  }

  return (
    <button
      className={twMerge('mb-10 mt-16 h-9 w-40 rounded-full border ', buttonColor())}
      disabled={firebaseInfo.bibleReadingDates?.includes(datePick as string) || !firebaseInfo.uid}
      onClick={handleBibleRead}
    >
      말씀을 읽었습니다
    </button>
  )
}
