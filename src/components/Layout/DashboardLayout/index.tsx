'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

import { Title } from '@/components/Text'

import useFirebaseStore from '@/stores/FirebaseStore'

import CALENDAR_ICON from '@icon/calendar_icon.svg'
import EVENT_ICON from '@icon/event_icon.svg'
import FOCUS_CALENDAR_ICON from '@icon/focus_calendar_icon.svg'
import FOCUS_EVENT_ICON from '@icon/focus_event_icon.svg'
import FOCUS_MEDITATION_ICON from '@icon/focus_meditation_icon.svg'
import FOCUS_STATUS_ICON from '@icon/focus_status_icon.svg'
import LIGHTUP_ICON from '@icon/lightup_icon.svg'
import MEDITATION_ICON from '@icon/meditation_icon.svg'
import STATUS_ICON from '@icon/status_icon.svg'

interface LayoutType {
  children: React.ReactNode
  pageName: string
}

export function DashboardLayout({ children, pageName }: LayoutType) {
  const route = useRouter()
  const { firebaseInfo } = useFirebaseStore()

  useEffect(() => {
    if (!firebaseInfo.uid) {
      route.push('/', { scroll: false })
    }
  }, [])
  return (
    <div className="flex min-h-screen w-full flex-col items-center py-14">
      <div className="fixed left-0 top-0 z-30 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white py-4">
        <Title textColor="">{pageName}</Title>
      </div>
      {children}
      <NavigationBar />
    </div>
  )
}

export function LoadingScreen({ pageName }: { pageName: string }) {
  const route = useRouter()
  const { firebaseInfo } = useFirebaseStore()

  useEffect(() => {
    if (!firebaseInfo.uid) {
      route.push('/', { scroll: false })
    }
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center py-14">
      <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white py-4">
        <Title textColor="">{pageName}</Title>
      </div>
      <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
        <Image alt="image" src={LIGHTUP_ICON} />
        <div className="text-xl leading-none">페이지 준비중입니다</div>
        <Link
          href={'/main'}
          className="my-5 rounded-full border-2 border-[#0276F9] px-10 py-3 font-semibold text-[#0276F9]"
        >
          홈으로 이동하기
        </Link>
      </div>
      <NavigationBar />
    </div>
  )
}

export function NoBibleData({ pageName }: { pageName: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center py-14">
      <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white py-4">
        <Title textColor="">{pageName}</Title>
      </div>
      <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
        <Image alt="image" src={LIGHTUP_ICON} />
        <div className="text-xl leading-none">해당 날짜에 말씀을 준비중입니다</div>
        <Link
          href={'/main'}
          className="my-5 rounded-full border-2 border-[#0276F9] px-10 py-3 font-semibold text-[#0276F9]"
        >
          홈으로 이동하기
        </Link>
      </div>
      <NavigationBar />
    </div>
  )
}

export function NavigationBar() {
  const pathname = usePathname()

  const checkMainPage = () => {
    if (pathname !== '/main' && pathname !== '/bible' && pathname !== '/bible/no-data') return false

    return true
  }

  const checkMeditationPage = () => {
    if (pathname !== '/meditation') return false

    return true
  }

  const checkSatusPage = () => {
    if (pathname !== '/status') return false

    return true
  }

  const checkEventPage = () => {
    if (pathname !== '/event') return false

    return true
  }

  return (
    <div className="fixed bottom-0 left-0 flex w-full justify-between border-t bg-white pb-4">
      <Link href={'/main'} className="px-6 py-3">
        <Image alt="button" className={twMerge(checkMainPage() ? 'hidden' : '')} src={CALENDAR_ICON} />
        <Image alt="button" className={twMerge(checkMainPage() ? '' : 'hidden')} src={FOCUS_CALENDAR_ICON} />
      </Link>
      <Link href={'/meditation'} className="px-6 py-3">
        <Image alt="button" className={twMerge(checkMeditationPage() ? 'hidden' : '')} src={MEDITATION_ICON} />
        <Image alt="button" className={twMerge(checkMeditationPage() ? '' : 'hidden')} src={FOCUS_MEDITATION_ICON} />
      </Link>
      <Link href={'/status'} className="px-6 py-3">
        <Image alt="button" className={twMerge(checkSatusPage() ? 'hidden' : '')} src={STATUS_ICON} />
        <Image alt="button" className={twMerge(checkSatusPage() ? '' : 'hidden')} src={FOCUS_STATUS_ICON} />
      </Link>
      <Link href={'/event'} className="px-6 py-3">
        <Image alt="button" className={twMerge(checkEventPage() ? 'hidden' : '')} src={EVENT_ICON} />
        <Image alt="button" className={twMerge(checkEventPage() ? '' : 'hidden')} src={FOCUS_EVENT_ICON} />
      </Link>
    </div>
  )
}
