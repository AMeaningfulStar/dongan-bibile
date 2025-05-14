'use client'

import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

import CLOSE_ICON from '@icon/close_icon.png'
import NEXT_ARROW_ICON from '@icon/next_arrow_icon.png'
import PREV_ARROW_ICON from '@icon/prev_arrow_icon.png'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useProgress } from '@/hooks/useProgress'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSeasonStore } from '@/stores/useSeasonStore'

interface DatePickProps {
  path: string
  setIsShow: (value: boolean) => void
}

export function DatePick({ path, setIsShow }: DatePickProps) {
  const { user } = useAuthStore()
  const { seasons, selectSeason, selectedSeason } = useSeasonStore()
  const { progress } = useProgress({
    uid: user?.uid || '',
    churchId: user?.church?.id ?? null,
    communityId: user?.community?.id ?? null,
    seasonId: selectedSeason?.id ?? null,
  })

  const router = useRouter()

  const NextIcon = () => {
    return <Image alt="icon" src={NEXT_ARROW_ICON} height={16} width={12} style={{ width: 'auto', height: 'auto' }} />
  }

  const PrevIcon = () => {
    return <Image alt="icon" src={PREV_ARROW_ICON} height={16} width={12} style={{ width: 'auto', height: 'auto' }} />
  }

  return (
    <div
      className="fixed left-0 top-0 z-10 flex h-screen w-full items-center justify-center bg-gl-black-opacity-30"
      onClick={() => setIsShow(false)}
    >
      <div
        className="relative mx-1.5 flex flex-col w-full items-center justify-center rounded-xl bg-gl-white-base pb-6 pt-10"
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation()
        }}
      >
        <button onClick={() => setIsShow(false)} className="absolute right-4 top-4">
          <Image alt="icon" src={CLOSE_ICON} width={25} height={25} style={{ width: 'auto', height: 'auto' }} />
        </button>
         {seasons.length > 0 && (
        <div className="my-3 w-full px-4">
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
      )}
        <Calendar
          locale="ko"
          formatDay={(locale, data) => moment(data).format('DD')}
          nextLabel={<NextIcon />}
          prevLabel={<PrevIcon />}
          maxDetail="month"
          minDetail="month"
          calendarType="gregory"
          showNeighboringMonth={false}
          className="mx-auto w-full text-sm"
          prev2Label={null}
          next2Label={null}
          view="month"
          onChange={(event: any) => {
            const datePick = moment(event).format('YYYY-MM-DD')
            const churchId = user?.church?.id ? `&churchId=${user.church.id}` : ''
            const communityId = user?.community?.id ? `&communityId=${user.community.id}` : ''
            router.push(`/${path}?datePick=${datePick}${churchId}${communityId}`, { scroll: false })
            setIsShow(false)
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
    </div>
  )
}
