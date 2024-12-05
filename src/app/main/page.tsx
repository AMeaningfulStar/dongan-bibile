'use client'

import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

import { auth, firestore } from '@/libs/firebase'
import useFirebaseStore from '@/stores/FirebaseStore'

import { DashboardLayout } from '@/components/Layout'
import { ConsecutiveDays } from '@/components/MainPage'

import { ChallengeProgressBar, MyProgressBar } from '@/components/Progress'
import { Label, Version } from '@/components/Text'
import BIBLE_ICON from '@icon/bible.svg'

interface ProgressParams {
  readingDates?: string[]
  startDate: string
  endDate: string
}

interface ProgressResult {
  progress: number
  chapters: number
}

const TOTAL_CHAPTERS = 260 // 신약 성경 총 장수
const CHAPTERS_PER_DAY = 2 // 하루 읽어야 할 장수

export default function Main() {
  const { firebaseInfo, setFirebaseUid, setFirebaseInfo, initFirebaseInfo } = useFirebaseStore()
  const router = useRouter()

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        initFirebaseInfo()
        useFirebaseStore.persist.clearStorage()
        router.push('/', { scroll: false })
      })
      .catch((error) => {
        console.error('Error checking for duplicate email:', error)
      })
  }

  const goToBibleReading = async (datePick: string) => {
    const datePickRef = doc(firestore, 'biblePlan', datePick)
    const datePickSnapshot = await getDoc(datePickRef)

    if (datePickSnapshot.exists()) {
      if (datePickSnapshot.data().bibleInfo.length === 0) {
        router.push('/bible/no-data', { scroll: false })
      } else {
        router.push(`/bible?datePick=${datePick}`, { scroll: false })
      }
    } else {
      router.push('/bible/no-data', { scroll: false })
    }
  }

  const calculateProgress = ({ readingDates, startDate, endDate }: ProgressParams): ProgressResult => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const today = new Date().getTime()

    // readingDates가 있는 경우 (개인 진행률)
    if (readingDates) {
      if (readingDates.length === 0) {
        return {
          progress: 0,
          chapters: 0,
        }
      }
      const validDates = readingDates.filter((date) => {
        const currentDate = new Date(date).getTime()
        return currentDate >= start && currentDate <= end
      })
      const readChapters = validDates.length * CHAPTERS_PER_DAY
      return {
        progress: Math.round((readChapters / TOTAL_CHAPTERS) * 100),
        chapters: readChapters,
      }
    }

    // readingDates가 없는 경우 (전체 챌린지 진행률)
    const elapsedDays = (today - start) / (1000 * 60 * 60 * 24) + 1
    const expectedChapters = Math.min(Math.floor(elapsedDays) * CHAPTERS_PER_DAY, TOTAL_CHAPTERS)
    return {
      progress: Math.round((expectedChapters / TOTAL_CHAPTERS) * 100),
      chapters: expectedChapters,
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
      <ConsecutiveDays />
      {/* 캘린더 */}
      <div className="mb-10 flex w-full flex-col items-center px-4">
        <div className="w-full py-5">
          <Label label="나의 말씀 읽기" imageSrc={BIBLE_ICON} imageAlt="icon" />
        </div>
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
          tileClassName={({ date }) => {
            if (firebaseInfo.bibleReadingDates?.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
              return 'react-calendar__tile--read'
            }
          }}
        />
      </div>
      {/* 청신호 진행률 */}
      <ChallengeProgressBar
        progressResult={calculateProgress({
          startDate: '2024-08-11',
          endDate: '2024-12-21',
        })}
      />
      {/* 나의 진행률 */}
      <MyProgressBar
        progressResult={calculateProgress({
          readingDates: firebaseInfo.bibleReadingDates ? firebaseInfo.bibleReadingDates : [],
          startDate: '2024-08-11',
          endDate: '2024-12-21',
        })}
      />
      {/* 버전 */}
      <Version marginBottom="mb-6" textColor="text-black" />
      {/* 버튼 2개 */}
      {firebaseInfo.useAdmin && (
        <Link
          href={'/admin'}
          className="mb-4 flex h-8 w-32 items-center justify-center rounded-lg border border-black bg-white"
        >
          관리자 페이지
        </Link>
      )}
      {firebaseInfo.uid && (
        <div className="mb-6 flex gap-x-4">
          <button className="h-8 w-32 rounded-lg border border-black bg-white" onClick={() => handleSignOut()}>
            <span className="text-sm font-normal leading-none">로그아웃</span>
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}
