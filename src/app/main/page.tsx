'use client'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

import { auth, firestore } from '@/libs/firebase'
import useFirebaseStore from '@/stores/FirebaseStore'

import { DashboardLayout } from '@/components/Layout'

import useBibleInfo from '@/stores/BibleInfo'
import AIRPLANE_ICON from '@icon/airplane_icon.svg'
import FIRE_ICON from '@icon/fire_icon.svg'
import TRAFFICLIGHT_ICON from '@icon/trafficLight_icon.svg'

export default function Main() {
  const { firebaseInfo, setFirebaseUid, setFirebaseInfo, initFirebaseInfo } = useFirebaseStore()
  const { setDatePick } = useBibleInfo()
  const route = useRouter()

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        initFirebaseInfo()
        useFirebaseStore.persist.clearStorage()
        route.push('/', { scroll: false })
      })
      .catch((error) => {
        console.error('Error checking for duplicate email:', error)
      })
  }

  // 청신호 진행률 계산
  const calculateChallengeProgress = () => {
    const start = new Date('2024-08-11').getTime()
    const end = new Date('2024-12-21').getTime()
    const today = new Date().getTime()

    const totalDuration = (end - start) / (1000 * 60 * 60 * 24) // 전체 기간 (일 단위)
    const elapsedDuration = (today - start) / (1000 * 60 * 60 * 24) // 경과한 기간 (일 단위)

    if (today < start) {
      return 0
    }

    const progress = (elapsedDuration / totalDuration) * 100

    return Math.round(progress)
  }

  // 나의 진행률 계산
  const calculateMyProgress = () => {
    const start = new Date('2024-08-11').getTime()
    const end = new Date('2024-12-21').getTime()
    const totalDuration = (end - start) / (1000 * 60 * 60 * 24) + 1

    if (firebaseInfo.bibleReadingDates?.length) {
      // start와 end 사이의 날짜만 필터링
      const validDates = firebaseInfo.bibleReadingDates.filter((date) => {
        const currentDate = new Date(date).getTime()
        return currentDate >= start && currentDate <= end
      })

      const result = (validDates.length / totalDuration) * 100

      return Math.round(result)
    }

    return 0
  }

  const goToBibleReading = async (datePick: string) => {
    const datePickRef = doc(firestore, 'biblePlan', datePick)
    const datePickSnapshot = await getDoc(datePickRef)

    if (datePickSnapshot.exists()) {
      setDatePick(datePick)
      route.push('/bible', { scroll: false })
    } else {
      route.push('/bible/no-data', { scroll: false })
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setFirebaseUid(user.uid)
          setFirebaseInfo(docSnap.data())
        } else {
          console.log('No such document!')
        }
      }
    })
  }, [])

  return (
    <DashboardLayout pageName="홈">
      {/* 청신호 연속 읽은 날짜 텍스트 */}
      <div className="w-full px-4 py-2.5">
        <div className="item-center flex gap-x-1 rounded-full bg-[#E8EEFF] py-2.5 pl-5">
          <div className="text-lg font-light leading-none">
            청신호 연속 <span className="font-medium text-[#0276F9]">{firebaseInfo.challengeStreakCount}</span> 일째
          </div>
          <Image alt="icon" src={FIRE_ICON} />
        </div>
      </div>
      {/* 캘린더 */}
      <div className="mb-10 flex w-full flex-col items-center px-4">
        <div className="w-full py-5 text-lg font-light leading-none">나의 말씀 읽기</div>
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
          onChange={(event: any) => goToBibleReading(moment(event).format('YYYY-MM-DD'))}
          tileClassName={({ date, view }) => {
            if (firebaseInfo.bibleReadingDates?.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
              return 'react-calendar__tile--read'
            }
          }}
        />
      </div>
      {/* 청신호 진행률 */}
      <div className="mb-3 flex w-full flex-col gap-y-3 px-4">
        <div className="flex items-center gap-x-1 pt-5">
          <Image alt="icon" src={TRAFFICLIGHT_ICON} />
          <span className="text-lg font-light leading-none">청신호 진행률</span>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="relative h-2 flex-grow bg-[#E8EEFF]">
            <div className="absolute h-full bg-[#0276F9]" style={{ width: `${calculateChallengeProgress()}%` }}></div>
          </div>
          <div>{calculateChallengeProgress()}%</div>
        </div>
      </div>
      {/* 나의 진행률 */}
      <div className="mb-16 flex w-full flex-col gap-y-3 px-4">
        <div className="flex items-center gap-x-1 pt-5">
          <Image alt="icon" src={AIRPLANE_ICON} />
          <span className="text-lg font-light leading-none">나의 진행률</span>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="relative h-2 flex-grow bg-[#E8EEFF]">
            <div className="absolute h-full bg-[#0276F9]" style={{ width: `${calculateMyProgress()}%` }}></div>
          </div>
          <div>{calculateMyProgress()}%</div>
        </div>
      </div>
      {/* 버전 */}
      <p className="mb-6 text-base font-normal leading-none">버전: 1.0.0</p>
      {/* 버튼 2개 */}
      {firebaseInfo.useAdmin && (
        <Link
          href={'/admin'}
          className="mb-4 flex h-8 w-32 items-center justify-center rounded-lg border border-black bg-white"
        >
          관리자 페이지
        </Link>
      )}
      <div className="mb-6 flex gap-x-4">
        <button className="h-8 w-32 rounded-lg border border-black bg-white">
          <span className="text-sm font-normal leading-none">비밀번호 변경</span>
        </button>
        <button className="h-8 w-32 rounded-lg border border-black bg-white" onClick={() => handleSignOut()}>
          <span className="text-sm font-normal leading-none">로그아웃</span>
        </button>
      </div>
    </DashboardLayout>
  )
}
