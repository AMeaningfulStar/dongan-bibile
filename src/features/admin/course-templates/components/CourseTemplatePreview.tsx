'use client'

import { useMemo } from 'react'
import { useWatch, type Control } from 'react-hook-form'

import { getTotalChaptersByBooks, getTotalChaptersByTestament } from '@/lib/reading/bible-chapters'
import { computeCoursePreview } from '@/lib/reading/compute-course-preview'

import { Separator } from '@/components/ui/separator'

export type CourseTemplateFormValues = {
  title: string
  description?: string

  scopeType: 'testament' | 'books'
  testament?: { old: boolean; new: boolean }
  books?: string[]

  periodType: 'days' // MVP: days 고정
  periodDays: number

  defaultDaysOfWeek: number[] // 0~6
  status: 'draft' | 'active'

  isDefault?: boolean
  isArchived?: boolean
}

type Props = {
  control: Control<CourseTemplateFormValues>
}

function yyyyMmDd(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function CourseTemplatePreview({ control }: Props) {
  const values = useWatch({ control })

  const computed = useMemo(() => {
    if (!values) return null

    const scopeType = values.scopeType
    const periodDays = Number(values.periodDays ?? 0)
    const daysOfWeek = values.defaultDaysOfWeek ?? []

    if (!periodDays || periodDays <= 0) return { error: '기간(일수)을 입력해주세요.' }
    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) return { error: '읽을 요일을 1개 이상 선택해주세요.' }

    const testamentValue = {
      old: values.testament?.old ?? false,
      new: values.testament?.new ?? false,
    }

    // totalChapters
    const totalChapters =
      scopeType === 'testament'
        ? getTotalChaptersByTestament(testamentValue)
        : getTotalChaptersByBooks(values.books ?? [])

    if (!totalChapters || totalChapters <= 0) {
      return { error: '분량 설정이 올바르지 않습니다. (구약/신약 선택 또는 권 선택 확인)' }
    }

    // Template은 startDate가 없으므로 “오늘 시작 기준”으로 프론트 미리보기
    const startDate = new Date()
    const preview = computeCoursePreview({
      startDate,
      periodDays,
      daysOfWeek,
      totalChapters,
    })

    return {
      totalChapters,
      readingDays: preview.readingDays,
      endDate: preview.endDate,
      chaptersPerReadingDay: preview.chaptersPerReadingDay,
      summaryText: preview.summaryText,
    }
  }, [
    values?.scopeType,
    values?.testament?.old,
    values?.testament?.new,
    (values?.books ?? []).join('|'),
    values?.periodDays,
    (values?.defaultDaysOfWeek ?? []).join('|'),
  ])

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">계산 미리보기</h3>
        <span className="text-xs text-muted-foreground">* 오늘 시작 기준</span>
      </div>

      <Separator className="my-3" />

      {!computed ? (
        <p className="text-sm text-muted-foreground">입력값을 채우면 계산 결과가 표시됩니다.</p>
      ) : 'error' in computed ? (
        <p className="text-sm text-destructive">{computed.error}</p>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">총 장수</span>
            <span className="font-medium">{computed.totalChapters}장</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">달력 기간</span>
            <span className="font-medium">{Number(values?.periodDays ?? 0)}일</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">읽는 날 수(요일 반영)</span>
            <span className="font-medium">{computed.readingDays}일</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">완료 예상일</span>
            <span className="font-medium">{yyyyMmDd(computed.endDate)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">읽는 날 기준 하루 분량</span>
            <span className="font-medium">{computed.chaptersPerReadingDay}장/일</span>
          </div>

          <Separator className="my-2" />

          <div className="text-xs text-muted-foreground">{computed.summaryText}</div>
        </div>
      )}
    </div>
  )
}
