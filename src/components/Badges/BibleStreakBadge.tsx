'use client'

import Image from 'next/image'

import { userCommuniteStore, userInfoStore } from '@/stores'

import FIRE_ICON from '@icon/fire_icon.png'
import WATER_ICON from '@icon/water_icon.png'

export function BibleStreakBadge() {
  const { userCommunite } = userCommuniteStore()
  const { userInfo } = userInfoStore()

  if (!userInfo) {
    return (
      <div className="absolute right-5 top-3 flex items-center gap-x-0.5 rounded-full bg-gl-grayscale-base px-3 py-1">
        <Image alt="icon" src={WATER_ICON} width={16} height={16} style={{ width: 'auto', height: 'auto' }} />
        <span className="text-caption-13-l">로그인 상태가 아니예요</span>
      </div>
    )
  }

  if (userCommunite && userCommunite.bibleReadingDates.length <= 0) {
    return (
      <div className="absolute right-5 top-3 flex items-center gap-x-0.5 rounded-full bg-gl-grayscale-base px-3 py-1">
        <Image alt="icon" src={WATER_ICON} width={16} height={16} style={{ width: 'auto', height: 'auto' }} />
        <span className="text-caption-13-l">청신호를 켜볼까요?</span>
      </div>
    )
  }

  return (
    <div className="absolute right-5 top-3 flex items-center gap-x-0.5 rounded-full bg-gl-green-opacity-30 px-3 py-1">
      <Image alt="icon" src={FIRE_ICON} width={16} height={16} style={{ width: 'auto', height: 'auto' }} />
      <span className="text-caption-13-l">연속{userCommunite?.bibleReadingDates.length}일째 성공</span>
    </div>
  )
}
