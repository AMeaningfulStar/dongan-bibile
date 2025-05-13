'use client'

import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

import { useAuthStore } from '@/stores/useAuthStore'

import LIGHT_ICON from '@icon/light_icon.png'
import LINK_ARROW_ICON from '@icon/link_arrow_icon.png'
import NEXT_ARROW_ICON from '@icon/next_arrow_icon.png'
import PREV_ARROW_ICON from '@icon/prev_arrow_icon.png'

import { BibleStreakBadge } from '@/components/Badges'
import { MyProgressBar, TotalProgressBar } from '@/components/Progress'
import { getProgress } from '@/libs/swr/getProgress'
import { useSeasonStore } from '@/stores/useSeasonStore'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Main() {
  const { user } = useAuthStore()
  const router = useRouter()

  const { seasons, selectedSeason, selectSeason } = useSeasonStore()

  const { progress } = getProgress({
    uid: user?.uid || '',
    churchId: user?.church?.id ?? null,
    communityId: user?.community?.id ?? null,
    seasonId: selectedSeason?.id ?? null,
  })

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
          onChange={(event: any) => {
            const datePick = moment(event).format('YYYY-MM-DD')
            const churchId = user?.church?.id ? `&churchId=${user.church.id}` : ''
            const communityId = user?.community?.id ? `&communityId=${user.community.id}` : ''
            router.push(`/bible?datePick=${datePick}${churchId}${communityId}`, { scroll: false })
          }}
          tileClassName={({ date }) => {
            if (!selectedSeason) return null

            const isRead = progress?.readDatesInSeason.includes(moment(date).format('YYYY-MM-DD'))

            return isRead ? 'react-calendar__tile--read' : null
          }}
          tileDisabled={({ date }) => {
            if (selectedSeason && moment(date).isBetween(selectedSeason.startDate, selectedSeason.endDate, 'day', '[]'))
              return false

            return true
          }}
        />
      </div>

      {/* 진행률 */}
      {user && user.church && user.community ? (
        <>
          {/* 공지사항 */}
          <div className="mb-4 w-full px-4">
            <div className="flex items-center gap-x-2.5 rounded-[10px] bg-gl-grayscale-base px-3 py-4">
              <Image alt="icon" src={LIGHT_ICON} width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
              <div className="flex-grow">[News!] 청신호 시즌 2: 4월 21일 ~ 6월 11일</div>
              <Link href={'#'}>
                <Image alt="icon" src={LINK_ARROW_ICON} width={11} height={15} style={{ width: 'auto' }} />
              </Link>
            </div>
          </div>

          <div className="mb-4 w-full px-4">
            <Select
              value={selectedSeason?.id || ''}
              onValueChange={(value) => {
                const selected = seasons.find((s) => s.id === value) || null
                if (selected) selectSeason(selected.id)
              }}
            >
              <SelectTrigger className="w-full outline-none">
                <SelectValue placeholder="시즌을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season.id} value={season.id}>
                    {season.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TotalProgressBar
            readDatesInYear={progress?.readDatesInYear ?? 0}
            totalPlannedDays={progress?.totalPlannedDays ?? 0}
            yearProgress={progress?.yearProgress ?? 0}
          />
          <MyProgressBar
            seasonName={selectedSeason?.name ?? ''}
            readDatesInSeason={progress?.readDatesInSeason ?? []}
            seasonProgress={progress?.seasonProgress ?? 0}
            totalSeasonDays={progress?.totalSeasonDays ?? 0}
          />
        </>
      ) : (
        <>
          <div className="mb-4 w-full px-4">
            <div className="flex items-center gap-x-2.5 rounded-[10px] bg-gl-grayscale-base px-3 py-4">
              <Image alt="icon" src={LIGHT_ICON} width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
              <div className="flex-grow">청소년을 위한 신나는 성경 통독 서비스 호우!!</div>
              <Link href={'#'}>
                <Image alt="icon" src={LINK_ARROW_ICON} width={11} height={15} style={{ width: 'auto' }} />
              </Link>
            </div>
          </div>
          <TotalProgressBar
            readDatesInYear={progress?.readDatesInYear ?? 0}
            totalPlannedDays={progress?.totalPlannedDays ?? 0}
            yearProgress={progress?.yearProgress ?? 0}
          />
        </>
      )}
    </div>
  )
}
