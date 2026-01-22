'use client'

import { useMemo } from 'react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

import { getTotalChaptersByBooks, getTotalChaptersByTestament } from '@/features/admin/courses/lib/bible-chapters'
import { computeCoursePreview } from '@/features/admin/courses/lib/compute-course-preview'

export type CourseFormValues = {
  title: string
  startDate: Date
  daysOfWeek: number[] // 0=일 ~ 6=토
  scopeType: 'testament' | 'books'
  testament?: { old: boolean; new: boolean }
  books?: string[]
  periodType: 'days'
  periodDays: number
  status?: 'draft' | 'active'
}

function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !isNaN(d.getTime())
}

export function CoursePreview({ control }: { control: Control<CourseFormValues> }) {
  const [startDate, periodDays, daysOfWeek, scopeType, testament, books] = useWatch({
    control,
    name: ['startDate', 'periodDays', 'daysOfWeek', 'scopeType', 'testament', 'books'],
  })

  const totalChapters = useMemo(() => {
    if (scopeType === 'testament' && testament) {
      return getTotalChaptersByTestament(testament)
    }
    if (scopeType === 'books' && Array.isArray(books)) {
      return getTotalChaptersByBooks(books)
    }
    return 0
  }, [scopeType, testament, books])

  const preview = useMemo(() => {
    if (!isValidDate(startDate)) return null
    if (typeof periodDays !== 'number' || periodDays <= 0) return null
    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) return null
    if (totalChapters <= 0) return null

    return computeCoursePreview({
      startDate,
      periodDays,
      daysOfWeek,
      totalChapters,
    })
  }, [startDate, periodDays, daysOfWeek, totalChapters])

  if (!preview) {
    return (
      <div className="mt-6 rounded-lg border p-4 text-sm text-muted-foreground">
        분량/요일/기간/시작일을 입력하면 완독 계산이 표시됩니다.
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">미리보기</div>

      <div className="mt-2 text-base font-medium">{preview.summaryText}</div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>기간: {preview.durationDays}일</div>
        <div>읽는 날 수: {preview.readingDays}일</div>
        <div>완료일: {preview.endDate.toLocaleDateString()}</div>
        <div>하루 분량: 약 {preview.chaptersPerReadingDay}장</div>
      </div>
    </div>
  )
}
