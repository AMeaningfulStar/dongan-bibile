import Image from 'next/image'
import Link from 'next/link'

import { Title } from '@/components/Text'

import CALENDAR_ICON from '@icon/calendar_icon.svg'
import EVENT_ICON from '@icon/event_icon.svg'
import LIGHTUP_ICON from '@icon/lightup_icon.svg'
import MEDITATION_ICON from '@icon/meditation_icon.svg'
import STATUS_ICON from '@icon/status_icon.svg'

export default function Status() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center py-14">
      <div className="fixed left-0 top-0 z-30 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white py-4">
        <Title textColor="">이벤트</Title>
      </div>
      {/* 이벤트 페이지 empty */}
      <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
        <Image alt="image" src={LIGHTUP_ICON} />
        <div className="text-xl leading-none">이벤트가 없습니다</div>
        <Link
          href={'/main'}
          className="my-5 rounded-full border-2 border-[#0276F9] px-10 py-3 font-semibold text-[#0276F9]"
        >
          홈으로 이동하기
        </Link>
      </div>
      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 flex w-full justify-between border-t bg-white pb-4">
        <Link href={'/main'} className="px-6 py-3">
          <Image alt="button" src={CALENDAR_ICON} />
        </Link>
        <Link href={'/meditation'} className="px-6 py-3">
          <Image alt="button" src={MEDITATION_ICON} />
        </Link>
        <Link href={'/status'} className="px-6 py-3">
          <Image alt="button" src={STATUS_ICON} />
        </Link>
        <Link href={'/event'} className="px-6 py-3">
          <Image alt="button" src={EVENT_ICON} />
        </Link>
      </div>
    </div>
  )
}
