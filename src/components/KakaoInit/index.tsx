'use client' // 클라이언트 컴포넌트로 설정

import Script from 'next/script'
import { useEffect } from 'react'

export default function KakaoInit() {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY)
    }
  }, [])

  return (
    <Script
      src="https://developers.kakao.com/sdk/js/kakao.js"
      strategy="beforeInteractive"
      onLoad={() => {
        if (window.Kakao) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY)
        }
      }}
    />
  )
}
