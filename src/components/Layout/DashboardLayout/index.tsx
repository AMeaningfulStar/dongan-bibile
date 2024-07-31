'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Title } from '@/components/Text'

import useFirebaseStore from '@/stores/FirebaseStore'

import BIBLE_ICON from '@icon/bible_icon.svg'
import CALENDAR_ICON from '@icon/calendar_icon.svg'
import EVENT_ICON from '@icon/event_icon.svg'
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
    <div className="flex min-h-screen w-full flex-col items-center py-24">
      <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white pb-3 pt-12">
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
    <div className="flex min-h-screen w-full flex-col items-center py-24">
      <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white pb-3 pt-12">
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

function NavigationBar() {
  return (
    <div className="fixed bottom-0 left-0 flex w-full justify-between border-t bg-white pb-9">
      <Link href={'/main'} className="px-6 py-3">
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
  )
}
