'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { adminDb } from '@/lib/firebase-admin'
import { getTotalChaptersByBooks, getTotalChaptersByTestament } from '@/lib/reading/bible-chapters'
import { computeCoursePreview } from '@/lib/reading/compute-course-preview'

import { requireAdmin } from '@/features/admin/auth/guard'

import {
  courseTemplateCreateSchema,
  courseTemplateUpdateSchema,
  type CreateCourseTemplateInput,
  type CreateCourseTemplateOutput,
  type UpdateCourseTemplateInput,
  type UpdateCourseTemplateOutput,
} from './schema'

import type { CourseTemplateDTO } from './types'

const COURSE_TEMPLATES_COL = 'courseTemplates' as const

function toISO(ts?: Timestamp | null) {
  if (!ts) return new Date(0).toISOString()
  return ts.toDate().toISOString()
}

function toTimestamp(date: Date) {
  return Timestamp.fromDate(date)
}

/**
 * Template에서 computed를 만들기 위한 서버 계산
 * - Template 자체는 startDate가 없으므로 "생성 시점(now)" 기준으로 안내용 computed 생성
 * - 실제 실행 코스(CourseInstance)에서는 startDate가 확정되므로 그쪽 computed가 정답
 */
function computeTemplateDerived(params: {
  totalChapters: number
  periodDays: number
  defaultDaysOfWeek: number[]
  // Template엔 startDate가 없지만, 계산을 위해 기준일을 받는다.
  // create/update 시점에 now로 넣는다.
  baseStartDate: Date
}) {
  const { totalChapters, periodDays, defaultDaysOfWeek, baseStartDate } = params

  return computeCoursePreview({
    startDate: baseStartDate,
    periodDays,
    daysOfWeek: defaultDaysOfWeek,
    totalChapters,
  })
}

/**
 * 목록 조회 (MVP)
 */
export async function listCourseTemplates(): Promise<CourseTemplateDTO[]> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const snap = await adminDb.collection(COURSE_TEMPLATES_COL).orderBy('createdAt', 'desc').get()

  return snap.docs.map((doc) => {
    const d = doc.data() as any
    const c = d.computed ?? undefined

    return {
      id: doc.id,
      title: d.title ?? '',
      description: d.description ?? '',

      scopeType: d.scopeType,
      testament: d.testament ?? undefined,
      books: Array.isArray(d.books) ? d.books : undefined,

      periodType: d.periodType ?? 'days',
      periodDays: Number(d.periodDays ?? 0),
      defaultDaysOfWeek: Array.isArray(d.defaultDaysOfWeek) ? d.defaultDaysOfWeek : [],

      status: d.status ?? 'draft',
      isDefault: Boolean(d.isDefault),
      isArchived: Boolean(d.isArchived),

      computed: c
        ? {
            totalChapters: Number(c.totalChapters ?? 0),
            estimatedChaptersPerReadingDay:
              Number(c.chaptersPerReadingDay ?? c.estimatedChaptersPerReadingDay ?? 0) || 0,
            summaryText: String(c.summaryText ?? ''),
          }
        : undefined,

      createdAt: toISO(d.createdAt),
      updatedAt: toISO(d.updatedAt),
      createdBy: d.createdBy ?? '',
    }
  })
}

/**
 * 단건 조회 (수정 페이지 초기값)
 */
export async function getCourseTemplate(templateId: string): Promise<CourseTemplateDTO | null> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const ref = adminDb.collection(COURSE_TEMPLATES_COL).doc(templateId)
  const doc = await ref.get()
  if (!doc.exists) return null

  const d = doc.data() as any
  const c = d.computed ?? undefined

  return {
    id: doc.id,
    title: d.title ?? '',
    description: d.description ?? '',

    scopeType: d.scopeType,
    testament: d.testament ?? undefined,
    books: Array.isArray(d.books) ? d.books : undefined,

    periodType: d.periodType ?? 'days',
    periodDays: Number(d.periodDays ?? 0),
    defaultDaysOfWeek: Array.isArray(d.defaultDaysOfWeek) ? d.defaultDaysOfWeek : [],

    status: d.status ?? 'draft',
    isDefault: Boolean(d.isDefault),
    isArchived: Boolean(d.isArchived),

    computed: c
      ? {
          totalChapters: Number(c.totalChapters ?? 0),
          estimatedChaptersPerReadingDay: Number(c.chaptersPerReadingDay ?? c.estimatedChaptersPerReadingDay ?? 0) || 0,
          summaryText: String(c.summaryText ?? ''),
        }
      : undefined,

    createdAt: toISO(d.createdAt),
    updatedAt: toISO(d.updatedAt),
    createdBy: d.createdBy ?? '',
  }
}

/**
 * 생성
 * - 입력 검증: courseTemplateCreateSchema
 * - 서버 계산: totalChapters + preview 기반 computed 생성 후 저장
 */
export async function createCourseTemplate(input: CreateCourseTemplateInput): Promise<{ id: string }> {
  const admin = await requireAdmin(['mainAdmin', 'subAdmin'])

  const parsed: CreateCourseTemplateOutput = courseTemplateCreateSchema.parse(input)

  // 1) totalChapters
  const totalChapters =
    parsed.scopeType === 'testament'
      ? getTotalChaptersByTestament(parsed.testament ?? { old: false, new: false })
      : getTotalChaptersByBooks(parsed.books ?? [])

  if (!totalChapters || totalChapters <= 0) {
    throw new Error('INVALID_TOTAL_CHAPTERS')
  }

  // 2) computed (Template는 startDate가 없으므로 now 기준 안내용)
  const baseStartDate = new Date()
  const derived = computeTemplateDerived({
    totalChapters,
    periodDays: parsed.periodDays,
    defaultDaysOfWeek: parsed.defaultDaysOfWeek,
    baseStartDate,
  })

  const now = Timestamp.now()

  const payload = {
    title: parsed.title,
    description: parsed.description ?? '',

    scopeType: parsed.scopeType,
    testament: parsed.scopeType === 'testament' ? (parsed.testament ?? { old: false, new: false }) : null,
    books: parsed.scopeType === 'books' ? (parsed.books ?? []) : [],

    periodType: parsed.periodType, // MVP: 'days' 고정 (추후 'chapters' 확장)
    periodDays: parsed.periodDays,
    defaultDaysOfWeek: parsed.defaultDaysOfWeek,

    status: parsed.status,
    isDefault: Boolean(parsed.isDefault),
    isArchived: Boolean(parsed.isArchived),

    // computed 저장
    computed: {
      totalChapters,
      readingDays: derived.readingDays,
      chaptersPerReadingDay: derived.chaptersPerReadingDay,
      endDate: toTimestamp(derived.endDate), // 안내용 endDate
      summaryText: derived.summaryText,
    },

    createdAt: now,
    updatedAt: now,
    createdBy: admin.uid,
  }

  const ref = await adminDb.collection(COURSE_TEMPLATES_COL).add(payload)
  return { id: ref.id }
}

/**
 * 수정
 * - partial update 지원
 * - 변경 후 "현재 값" 기준으로 computed 재계산해서 patch에 반영
 */
export async function updateCourseTemplate(input: UpdateCourseTemplateInput): Promise<{ ok: true }> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const parsed: UpdateCourseTemplateOutput = courseTemplateUpdateSchema.parse(input)

  const ref = adminDb.collection(COURSE_TEMPLATES_COL).doc(parsed.id)
  const doc = await ref.get()
  if (!doc.exists) throw new Error('NOT_FOUND')

  const prev = doc.data() as any

  // 1) patch (원본 업데이트)
  const patch: Record<string, any> = {
    updatedAt: Timestamp.now(),
  }

  if (typeof parsed.title === 'string') patch.title = parsed.title
  if (typeof parsed.description === 'string') patch.description = parsed.description

  if (parsed.scopeType) patch.scopeType = parsed.scopeType
  if (parsed.testament) patch.testament = parsed.testament
  if (parsed.books) patch.books = parsed.books

  if (parsed.periodType) patch.periodType = parsed.periodType
  if (typeof parsed.periodDays === 'number') patch.periodDays = parsed.periodDays
  if (Array.isArray(parsed.defaultDaysOfWeek)) patch.defaultDaysOfWeek = parsed.defaultDaysOfWeek

  if (parsed.status) patch.status = parsed.status
  if (typeof parsed.isDefault === 'boolean') patch.isDefault = parsed.isDefault
  if (typeof parsed.isArchived === 'boolean') patch.isArchived = parsed.isArchived

  // 2) 재계산용 current (= 업데이트 반영된 값 우선, 없으면 prev)
  const current = {
    scopeType: (parsed.scopeType ?? prev.scopeType) as 'testament' | 'books',
    testament: (parsed.testament ?? prev.testament ?? { old: false, new: false }) as { old: boolean; new: boolean },
    books: (parsed.books ?? prev.books ?? []) as string[],

    periodDays: (typeof parsed.periodDays === 'number' ? parsed.periodDays : prev.periodDays) as number,
    defaultDaysOfWeek: (Array.isArray(parsed.defaultDaysOfWeek)
      ? parsed.defaultDaysOfWeek
      : prev.defaultDaysOfWeek) as number[],

    // Template는 startDate가 없으므로 update 시점 now 기준으로 computed 갱신
    baseStartDate: new Date(),
  }

  // 3) totalChapters 재계산
  const totalChapters =
    current.scopeType === 'testament'
      ? getTotalChaptersByTestament(current.testament)
      : getTotalChaptersByBooks(current.books)

  if (!totalChapters || totalChapters <= 0) {
    throw new Error('INVALID_TOTAL_CHAPTERS')
  }

  // 4) computed 재계산
  const derived = computeTemplateDerived({
    totalChapters,
    periodDays: current.periodDays,
    defaultDaysOfWeek: current.defaultDaysOfWeek,
    baseStartDate: current.baseStartDate,
  })

  patch.computed = {
    totalChapters,
    readingDays: derived.readingDays,
    chaptersPerReadingDay: derived.chaptersPerReadingDay,
    endDate: toTimestamp(derived.endDate),
    summaryText: derived.summaryText,
  }

  await ref.update(patch)
  return { ok: true }
}
