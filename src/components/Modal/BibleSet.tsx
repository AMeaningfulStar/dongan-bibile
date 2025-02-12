'use client'

import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { BibleTextSize, BibleType } from '@/utils/enum'

import { userInfoStore } from '@/stores'

import CLOSE_ICON from '@icon/close_icon.png'

interface BibleSetProps {
  setIsShow: (value: boolean) => void
}

export function BibleSet({ setIsShow }: BibleSetProps) {
  const textSizeOptions = [BibleTextSize.XS, BibleTextSize.SM, BibleTextSize.BASE, BibleTextSize.LG, BibleTextSize.XL]
  const sizeMap: Record<BibleTextSize, number> = {
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
    'text-lg': 18,
    'text-xl': 20,
  }

  const { userInfo, setBibleType, setBibleTextSize } = userInfoStore()
  const [textSizeIdx, setTextSizeIdx] = useState<number>(
    textSizeOptions.indexOf(userInfo ? userInfo.bibleTextSize : BibleTextSize.BASE),
  )

  const updateBibleType = async (bibleType: BibleType) => {
    if (!userInfo) {
      alert('로그인 후 가능합니다')
      return
    }
    try {
      const response = await axios.post(`/api/user/bible-type/${userInfo?.uid}/${bibleType}`)

      if (response.status) {
        setBibleType(bibleType)
      }
    } catch (error) {
      console.error('Error updating bibleType:', error)
      alert('성경 번역 변경 중 오류가 발생했습니다.')
    }
  }

  const updateBibleTextSize = async (bibleTextSize: BibleTextSize) => {
    try {
      const response = await axios.post(`/api/user/bible-text-size/${userInfo?.uid}/${bibleTextSize}`)

      if (response.status) {
        setBibleTextSize(bibleTextSize)
      }
    } catch (error) {
      console.error('Error updating bibleType:', error)
      alert('성경 번역 변경 중 오류가 발생했습니다.')
    }
  }

  const increaseTextSize = async () => {
    const nextIndex = textSizeIdx + 1

    if (!userInfo) {
      alert('로그인 후 가능합니다')
      return
    }

    if (nextIndex < textSizeOptions.length) {
      await updateBibleTextSize(textSizeOptions[nextIndex])
      setTextSizeIdx(nextIndex)
    }
  }

  const decreaseTextSize = async () => {
    const prevIndex = textSizeIdx - 1

    if (!userInfo) {
      alert('로그인 후 가능합니다')
      return
    }

    if (prevIndex >= 0) {
      await updateBibleTextSize(textSizeOptions[prevIndex])
      setTextSizeIdx(prevIndex)
    }
  }

  return (
    <div
      className="fixed left-0 top-0 z-10 flex h-screen w-full items-center justify-center bg-gl-black-opacity-30"
      onClick={() => setIsShow(false)}
    >
      <div
        className="relative mx-1.5 flex w-full flex-col items-center justify-center gap-y-5 rounded-xl bg-gl-white-base px-5 py-9"
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation()
        }}
      >
        <button onClick={() => setIsShow(false)} className="absolute right-4 top-4">
          <Image alt="icon" src={CLOSE_ICON} width={25} height={25} style={{ width: 'auto', height: 'auto' }} />
        </button>
        <div className="w-full text-caption-16-b">설정</div>
        <div className="flex w-full items-center justify-between">
          <div className="text-caption-16-l">폰트 크기</div>
          <div className="flex gap-x-1.5">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-gl-black-base"
              onClick={async () => await decreaseTextSize()}
            >
              -
            </button>
            <div className="flex h-9 w-20 items-center justify-center rounded-[10px] border border-gl-black-base">
              {sizeMap[userInfo ? userInfo.bibleTextSize : BibleTextSize.BASE]}
            </div>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-gl-black-base"
              onClick={async () => await increaseTextSize()}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="text-caption-16-l">역본 선택</div>
          <div className="flex gap-x-1.5">
            <button
              className={twMerge(
                'flex h-9 w-20 items-center justify-center rounded-[10px] border',
                userInfo?.bibleType === BibleType.REVISED
                  ? 'border-gl-green-base bg-gl-green-opacity-30 text-gl-green-base'
                  : 'border-gl-black-base ',
              )}
              onClick={async () => await updateBibleType(BibleType.REVISED)}
            >
              개역개정
            </button>
            <button
              className={twMerge(
                'flex h-9 w-20 items-center justify-center rounded-[10px] border',
                userInfo?.bibleType === BibleType.EASY
                  ? 'border-gl-green-base bg-gl-green-opacity-30 text-gl-green-base'
                  : 'border-gl-black-base ',
              )}
              onClick={async () => await updateBibleType(BibleType.EASY)}
            >
              쉬운성경
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
