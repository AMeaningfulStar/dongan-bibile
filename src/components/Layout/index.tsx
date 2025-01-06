'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import TRAFFIC_LIGHT_ICON from '@icon/traffic_light_icon.png'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isShow, setIsShow] = useState<boolean>(false)
  const pathName = usePathname()

  const pageName = () => {
    switch (pathName) {
      case '/main':
        return '청신호'
      case '/bible':
        return '말씀읽기'
      case '/keyword':
        return '나의 묵상키워드'
      case '/status':
        return '읽기현황'
      default:
        return '알 수 없는 페이지'
    }
  }

  if (pathName === '/') {
    return <body>{children}</body>
  }

  return (
    <body>
      <div className="flex min-h-screen w-full flex-col items-center pt-16">
        <div className="fixed left-0 top-0 z-10 w-full border-b border-gl-grayscale-base bg-gl-white-base py-4">
          <div className="flex w-full items-center justify-center">
            <span className="text-layout-20-l">{pageName()}</span>
          </div>
        </div>
        <button
          className="fixed left-3.5 top-3.5 z-30 flex h-[30px] w-[30px] items-center justify-center"
          onClick={() => setIsShow(!isShow)}
        >
          <div className={twMerge('absolute -left-[15px] -top-[15px]', !isShow && 'hidden')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
              <g filter="url(#filter0_f_666_2601)">
                <circle cx="30" cy="30" r="15" fill="#0D9800" fillOpacity="0.3" />
              </g>
              <defs>
                <filter
                  id="filter0_f_666_2601"
                  x="0"
                  y="0"
                  width="60"
                  height="60"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="7.5" result="effect1_foregroundBlur_666_2601" />
                </filter>
              </defs>
            </svg>
          </div>

          <svg width="21" height="11" viewBox="0 0 21 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.22266 10.9688C1.02083 10.9688 0.848307 10.8971 0.705078 10.7539C0.561849 10.6042 0.490234 10.4251 0.490234 10.2168C0.490234 10.015 0.561849 9.84245 0.705078 9.69922C0.848307 9.55599 1.02083 9.48438 1.22266 9.48438H19.5039C19.7057 9.48438 19.8783 9.55599 20.0215 9.69922C20.1712 9.84245 20.2461 10.015 20.2461 10.2168C20.2461 10.4251 20.1712 10.6042 20.0215 10.7539C19.8783 10.8971 19.7057 10.9688 19.5039 10.9688H1.22266ZM1.22266 6.70117C1.02083 6.70117 0.848307 6.62956 0.705078 6.48633C0.561849 6.3431 0.490234 6.17057 0.490234 5.96875C0.490234 5.76042 0.561849 5.58464 0.705078 5.44141C0.848307 5.29167 1.02083 5.2168 1.22266 5.2168H19.5039C19.7057 5.2168 19.8783 5.29167 20.0215 5.44141C20.1712 5.58464 20.2461 5.76042 20.2461 5.96875C20.2461 6.17057 20.1712 6.3431 20.0215 6.48633C19.8783 6.62956 19.7057 6.70117 19.5039 6.70117H1.22266ZM1.22266 2.44336C1.02083 2.44336 0.848307 2.37174 0.705078 2.22852C0.561849 2.08529 0.490234 1.91276 0.490234 1.71094C0.490234 1.5026 0.561849 1.32682 0.705078 1.18359C0.848307 1.04036 1.02083 0.96875 1.22266 0.96875H19.5039C19.7057 0.96875 19.8783 1.04036 20.0215 1.18359C20.1712 1.32682 20.2461 1.5026 20.2461 1.71094C20.2461 1.91276 20.1712 2.08529 20.0215 2.22852C19.8783 2.37174 19.7057 2.44336 19.5039 2.44336H1.22266Z"
              fill="#222222"
            />
          </svg>
        </button>
        {isShow && <SideBar />}
        {children}
      </div>
    </body>
  )
}

export function SideBar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 z-20 flex h-screen w-80 min-w-72 flex-col bg-gl-white-base pt-[60px] shadow-primary">
      <div className="mb-2.5 flex items-center gap-x-1 pl-6">
        <span>김민성님, 오늘도 청신호 켜기!</span>
        <Image alt="icon" src={TRAFFIC_LIGHT_ICON} width={16} height={16} />
      </div>
      <div className="mx-2.5 h-px bg-gl-grayscale-base" />
      <div className="mt-8 flex flex-grow flex-col items-center justify-between px-6">
        <div className="flex w-full flex-col gap-y-7">
          <Link href={'/main'} className={twMerge(pathname === '/main' ? 'text-gl-black-base' : 'text-gl-grayscale-1')}>
            홈
          </Link>
          <Link
            href={'/meditation'}
            className={twMerge(pathname === '/meditation' ? 'text-gl-black-base' : 'text-gl-grayscale-1')}
          >
            나의 묵상 키워드
          </Link>
          <Link
            href={'/status'}
            className={twMerge(pathname === '/status' ? 'text-gl-black-base' : 'text-gl-grayscale-1')}
          >
            읽기 현황
          </Link>
        </div>
        <div className="text-navigation-14-l text-gl-grayscale-1 mb-7 flex flex-col gap-y-7">
          <span>ver 3.0.0</span>
          <span className="underline">로그아웃</span>
        </div>
      </div>
    </div>
  )
}
