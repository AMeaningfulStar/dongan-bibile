'use client'

import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { userInfoStore } from '@/stores'

type UserProgressResponse = {
  totalChaptersUntilMy: number
  totalChapters: number
  progressPercentage: number
}

export function MyTotalChallenge() {
  const { userInfo } = userInfoStore()
  const [progress, setProgress] = useState<UserProgressResponse>({
    totalChaptersUntilMy: 0,
    totalChapters: 0,
    progressPercentage: 0,
  })

  // API 요청을 useCallback으로 메모화
  const fetchProgress = useCallback(async () => {
    if (!userInfo?.uid) return

    try {
      const response = await axios.get(`/api/user/progress/${userInfo.uid}`)
      setProgress(response.data.data ?? response.data)
    } catch (error) {
      console.error('❌ fetchProgress error:', error)
    }
  }, [userInfo?.uid])

  // userInfo?.uid가 바뀔 때마다 fetchProgress 실행
  useEffect(() => {
    fetchProgress()
  }, [userInfo?.uid])

  // 렌더링에 필요한 데이터를 useMemo로 계산
  const progressDisplay = useMemo(() => {
    const percentage = progress.totalChapters > 0 ? progress.progressPercentage : 0
    return {
      chaptersText: `(${progress.totalChaptersUntilMy}장 / ${progress.totalChapters}장)`,
      percentageText: `${percentage}%`,
      barWidth: `${percentage}%`,
    }
  }, [progress])

  return (
    <div className="mb-10 flex w-full flex-col gap-y-2.5 px-4">
      <div className="ml-1 flex items-center gap-x-2">
        <div className="flex items-center gap-x-1">
          <span className="text-caption-15-l">나의 진행률</span>
        </div>
        <span className="text-caption-13-l">{progressDisplay.chaptersText}</span>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="relative h-2.5 flex-grow rounded-full bg-gl-green-opacity-30">
          <div
            className="absolute h-full rounded-full bg-gl-green-opacity-50"
            style={{ width: progressDisplay.barWidth }}
          ></div>
        </div>
        <div className="flex w-10 items-center justify-center">{progressDisplay.percentageText}</div>
      </div>
    </div>
  )
}
