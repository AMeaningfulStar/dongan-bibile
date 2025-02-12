'use client'

import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

import CLOSE_ICON from '@icon/close_icon.png'
import NEXT_ARROW_ICON from '@icon/next_arrow_icon.png'
import PREV_ARROW_ICON from '@icon/prev_arrow_icon.png'

interface DatePickProps {
  path: string
  setIsShow: (value: boolean) => void
}

export function DatePick({ path, setIsShow }: DatePickProps) {
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
        className="relative mx-1.5 flex w-full items-center justify-center rounded-xl bg-gl-white-base pb-6 pt-10"
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation()
        }}
      >
        <button onClick={() => setIsShow(false)} className="absolute right-4 top-4">
          <Image alt="icon" src={CLOSE_ICON} width={25} height={25} style={{ width: 'auto', height: 'auto' }} />
        </button>
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
          onChange={(event: any) => {
            router.push(`/${path}?datePick=${moment(event).format('YYYY-MM-DD')}`, { scroll: false })
            setIsShow(false)
          }}
          view="month"
        />
      </div>
    </div>
  )
}
