'use client'

import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

import { userCommuniteStore } from '@/stores'
import { useAuthStore } from '@/stores/useAuthStore'

import LIGHT_ICON from '@icon/light_icon.png'
import LINK_ARROW_ICON from '@icon/link_arrow_icon.png'
import NEXT_ARROW_ICON from '@icon/next_arrow_icon.png'
import PREV_ARROW_ICON from '@icon/prev_arrow_icon.png'

import { BibleStreakBadge } from '@/components/Badges'
import { firestore } from '@/libs/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
// import { MyTotalChallenge, TotalChallenge } from '@/components/Progress'

interface BibleSeason {
  id: string
  name: string
  startDate: string
  endDate: string
}

export default function Main() {
  const { userCommunite } = userCommuniteStore()
  const { user } = useAuthStore()
  const router = useRouter()

  const [seasons, setSeasons] = useState<BibleSeason[]>([])
  const [selectedSeason, setSelectedSeason] = useState<BibleSeason | null>(null)

  useEffect(() => {
    fetchSeasons()
  }, [user])

  const fetchSeasons = async () => {
    if (!user?.church?.id || !user?.community?.id) {
      // 교회 ID 또는 공동체 ID가 없으면 데이터를 가져올 수 없음
      return
    }
    try {
      const snapshot = await getDocs(
        collection(
          firestore,
          'churches',
          user?.church?.id as string,
          'communities',
          user?.community?.id as string,
          'bibleSeasons',
        ),
      )

      const data: BibleSeason[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<BibleSeason, 'id'>),
      }))

      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.startDate)
        const dateB = new Date(b.startDate)
        return dateA.getTime() - dateB.getTime()
      })

      setSeasons(sortedData)

      const today = new Date()

      // 오늘 날짜가 포함된 시즌 찾기
      const current = seasons.find((season) => {
        const start = new Date(season.startDate)
        const end = new Date(season.endDate)
        return today >= start && today <= end
      })

      if (current) {
        setSelectedSeason(current)
      } else if (seasons.length > 0) {
        setSelectedSeason(seasons[0]) // 기본값: 첫 시즌
      }
    } catch (error) {}
  }

  const getFilteredReadDates = (bibleReadingDates: string[] = [], startDate: string | Date, endDate: string | Date) => {
    if (!startDate || !endDate) return []

    const start = moment(startDate).startOf('day')
    const end = moment(endDate).endOf('day')

    return bibleReadingDates.filter((dateStr) => {
      const m = moment(dateStr)
      return m.isBetween(start, end, undefined, '[]') // []: 양쪽 경계 포함
    })
  }

  const filteredReadingDates = useMemo(() => {
    return getFilteredReadDates(
      userCommunite?.bibleReadingDates,
      selectedSeason?.startDate as string,
      selectedSeason?.endDate as string,
    )
  }, [userCommunite?.bibleReadingDates, selectedSeason])

  const NextIcon = () => {
    return <Image alt="icon" src={NEXT_ARROW_ICON} height={16} width={12} style={{ width: 'auto', height: 'auto' }} />
  }

  const PrevIcon = () => {
    return <Image alt="icon" src={PREV_ARROW_ICON} height={16} width={12} style={{ width: 'auto', height: 'auto' }} />
  }

  return (
    <div className="flex flex-grow flex-col items-center pt-1.5">
      <div className="relative mb-[30px] flex w-full items-center justify-center">
        {/* 청신호 연속 읽은 날짜 텍스트 */}
        <BibleStreakBadge />
        {/* 캘린더 */}
        <Calendar
          locale="ko"
          formatDay={(locale, data) => moment(data).format('DD')}
          nextLabel={<NextIcon />}
          prevLabel={<PrevIcon />}
          maxDetail="month"
          minDetail="month"
          calendarType="gregory"
          showNeighboringMonth={false}
          prev2Label={null}
          next2Label={null}
          view="month"
          onChange={(event: any) =>
            router.push(`/bible?datePick=${moment(event).format('YYYY-MM-DD')}`, { scroll: false })
          }
          tileClassName={({ date }) => {
            if (!selectedSeason) return null

            const isRead = filteredReadingDates.includes(moment(date).format('YYYY-MM-DD'))

            return isRead ? 'react-calendar__tile--read' : null
          }}
          tileDisabled={({ date }) => {
            if (selectedSeason && moment(date).isBetween(selectedSeason.startDate, selectedSeason.endDate, 'day', '[]'))
              return false

            return true
          }}
        />
      </div>
      <div className="mb-4 w-full px-4">
        <div className="w-full rounded-lg border px-2">
          <select
            value={selectedSeason?.id || ''}
            onChange={(e) => {
              const selected = seasons.find((s) => s.id === e.target.value) || null
              setSelectedSeason(selected)
            }}
            className="w-full py-2 outline-none"
          >
            <option value="">시즌을 선택하세요</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 공지사항 */}
      <div className="mb-[37px] w-full px-4">
        <div className="flex items-center gap-x-2.5 rounded-[10px] bg-gl-grayscale-base px-3 py-4">
          <Image alt="icon" src={LIGHT_ICON} width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
          <div className="flex-grow">[News!] 청신호 시즌 2: 4월 21일 ~ 6월 11일</div>
          <Link href={'#'}>
            <Image alt="icon" src={LINK_ARROW_ICON} width={11} height={15} style={{ width: 'auto' }} />
          </Link>
        </div>
      </div>

      {/* 청신호 진행률 */}
      {/* <TotalChallenge /> */}
      {/* 나의 진행률 */}
      {/* <MyTotalChallenge /> */}
    </div>
  )
}
