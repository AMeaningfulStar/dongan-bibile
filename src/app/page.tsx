'use client'

import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

import { userInfoStore } from '@/stores'

import LIGHT_ICON from '@icon/light_icon.png'
import LINK_ARROW_ICON from '@icon/link_arrow_icon.png'
import NEXT_ARROW_ICON from '@icon/next_arrow_icon.png'
import PREV_ARROW_ICON from '@icon/prev_arrow_icon.png'

import { BibleStreakBadge } from '@/components/Badges'
import { MyTotalChallenge, TotalChallenge } from '@/components/Progress'

export default function Main() {
  const { userInfo } = userInfoStore()
  const router = useRouter()

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
            if (userInfo?.bibleReadingDates?.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
              return 'react-calendar__tile--read'
            }
          }}
        />
      </div>

      {/* 공지사항 */}
      <div className="mb-[37px] w-full px-4">
        <div className="flex items-center gap-x-2.5 rounded-[10px] bg-gl-grayscale-base px-3 py-4">
          <Image alt="icon" src={LIGHT_ICON} width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
          <div className="flex-grow">[News!] 청신호 시상식 : 3/16(주일)</div>
          <Link href={'#'}>
            <Image alt="icon" src={LINK_ARROW_ICON} width={11} height={15} style={{ width: 'auto' }} />
          </Link>
        </div>
      </div>

      {/* 청신호 진행률 */}
      <TotalChallenge />
      {/* 나의 진행률 */}
      <MyTotalChallenge />
    </div>
  )
}
