'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Title } from '@/components/Text'

import useFirebaseStore from '@/stores/FirebaseStore'

import BIBLE_ICON from '@icon/bible_icon.svg'
import CALENDAR_ICON from '@icon/calendar_icon.svg'
import EVENT_ICON from '@icon/event_icon.svg'
import MEDITATION_ICON from '@icon/meditation_icon.svg'
import STATUS_ICON from '@icon/status_icon.svg'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
