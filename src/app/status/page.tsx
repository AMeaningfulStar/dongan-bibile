import Image from 'next/image'
import Link from 'next/link'

import BIBLE_ICON from '@icon/bible_icon.svg'
import CALENDAR_ICON from '@icon/calendar_icon.svg'
import EVENT_ICON from '@icon/event_icon.svg'
import MEDITATION_ICON from '@icon/meditation_icon.svg'
import STATUS_ICON from '@icon/status_icon.svg'

export default function Status() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center py-20">
      <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white pb-3 pt-10">
        <span className="text-xl font-light">읽기현황</span>
      </div>
      {/* 세팅 및 정보 */}
      <div className="flex w-full justify-between gap-x-3 px-4 py-3">
        <div className="flex flex-grow gap-x-2.5">
          <div className="text-base">날짜</div>
          <button className="flex-grow rounded-md border border-black">00 / 00</button>
        </div>
        <div className="flex flex-grow gap-x-2.5">
          <div className="text-base">오늘 읽은 사람</div>
          <div className="flex flex-grow items-center justify-center rounded-md border border-black">
            <span>00명</span>
          </div>
        </div>
      </div>
      {/* 반 리스트 및 명단 */}
      <div className="flex w-full flex-col gap-y-2.5">
        <div className="w-full">
          <div className="flex justify-between bg-[#E8EEFF] px-4 py-2 text-lg leading-none">
            <span className="flex-grow text-center">1-1</span>
            <span>(#/#)</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-2.5 py-4">
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between bg-[#E8EEFF] px-4 py-2 text-lg leading-none">
            <span className="flex-grow text-center">2-4</span>
            <span>(#/#)</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-2.5 py-4">
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between bg-[#E8EEFF] px-4 py-2 text-lg leading-none">
            <span className="flex-grow text-center">교사</span>
            <span>(#/#)</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-2.5 py-4">
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
            <div className="rounded-lg bg-[#EEEEEE] px-4 py-2">김이박최</div>
          </div>
        </div>
      </div>
      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 flex w-full justify-between border-t bg-white pb-9">
        <Link href={'/home'} className="px-6 py-3">
          <Image alt="button" src={CALENDAR_ICON} />
        </Link>
        <Link href={'/meditation'} className="px-6 py-3">
          <Image alt="button" src={MEDITATION_ICON} />
        </Link>
        <Link href={'/bible'} className="px-6 py-3">
          <Image alt="button" src={BIBLE_ICON} />
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
