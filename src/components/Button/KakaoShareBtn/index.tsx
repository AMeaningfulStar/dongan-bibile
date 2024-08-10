'use client'

import Image from 'next/image'

import KAKAO_ICON from '@icon/kakao_icon.svg'

interface KakaoContent {
  title: string
  chapter: number
}

export function KakaoShareBtn({ startBible, endBible }: { startBible: KakaoContent; endBible: KakaoContent }) {
  const shareOnKakao = () => {
    if (window.Kakao && window.location) {
      const { Kakao, location } = window

      Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '2024 청신호',
          description: `오늘의 말씀은 ${startBible.title} ${startBible.chapter}장-${endBible.title} ${endBible.chapter}장 입니다`,
          imageUrl: '/1024.png',
          link: {
            mobileWebUrl: location.href,
            webUrl: location.href,
          },
        },
        buttons: [
          {
            title: '말씀 읽으러 고우!',
            link: {
              mobileWebUrl: location.href,
              webUrl: location.href,
            },
          },
        ],
      })
    }
  }

  return (
    <button className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFEB3B]" onClick={shareOnKakao}>
      <Image alt="icon" src={KAKAO_ICON} className="w-4" />
    </button>
  )
}
