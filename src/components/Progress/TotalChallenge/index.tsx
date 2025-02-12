'use client'

import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'

type ProgressResponse = {
  totalChaptersUntilToday: number
  totalChapters: number
  progressPercentage: number
}

export function TotalChallenge() {
  const [progress, setProgress] = useState<ProgressResponse>({
    totalChaptersUntilToday: 0,
    totalChapters: 0,
    progressPercentage: 0,
  })

  // API 요청을 useEffect에서 직접 실행 (useCallback 제거)
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get('/api/bible/progress')
        setProgress(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProgress()
  }, [])

  // 진행률 데이터 가공 (useMemo 유지)
  const progressDisplay = useMemo(
    () => ({
      chaptersText: `(${progress.totalChaptersUntilToday}장 / ${progress.totalChapters}장)`,
      percentageText: `${progress.progressPercentage}%`,
      barWidth: `${progress.progressPercentage}%`,
    }),
    [progress],
  )

  return (
    <div className="mb-10 flex w-full flex-col gap-y-2.5 px-4">
      <div className="ml-1 flex items-center gap-x-2">
        <div className="flex items-center gap-x-1">
          <span className="text-caption-15-l">청신호 진행률</span>
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
