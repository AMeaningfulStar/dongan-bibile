'use client'

import Image from 'next/image'
import { useState } from 'react'

import LINK_ICON from '@icon/link_icon.svg'

export function URLCopyBtn() {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)

      setIsCopied(true)

      alert('복사되었습니다')
      setTimeout(() => {
        setIsCopied(false)
      }, 3000)
    } catch (err) {
      console.error('URL 복사 실패:', err)
    }
  }

  return (
    <button onClick={handleCopyClick} className="flex h-6 w-6 items-center justify-center rounded-full bg-[#AAAAAA]">
      <Image alt="icon" src={LINK_ICON} />
    </button>
  )
}
