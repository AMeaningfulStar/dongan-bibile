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

  const doc = await adminDb.collection(COURSE_TEMPLATES_COL).doc(templateId).get()
  if (!doc.exists) return null

  const d = doc.data() as any

  return {
    id: doc.id,
    title: d.title,
    description: d.description,

    scopeType: d.scopeType,
    testament: d.testament,
    books: d.books,

    periodType: d.periodType,
    periodDays: d.periodDays,
    defaultDaysOfWeek: d.defaultDaysOfWeek,

    status: d.status,
    isDefault: d.isDefault,
    isArchived: d.isArchived,

    computed: {
      totalChapters: d.computed?.totalChapters ?? 0,
      readingDays: d.computed?.readingDays ?? 0,
      chaptersPerReadingDay: d.computed?.chaptersPerReadingDay ?? 0,
      endDate: d.computed?.endDate ? toISO(d.computed.endDate) : '',
      summaryText: d.computed?.summaryText ?? '',
    },

    createdAt: toISO(d.createdAt),
    updatedAt: toISO(d.updatedAt),
    createdBy: d.createdBy,
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
  const startDate = new Date()
  const computedPreview = computeCoursePreview({
    totalChapters,
    periodDays: parsed.periodDays,
    daysOfWeek: parsed.defaultDaysOfWeek,
    startDate,
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
      readingDays: computedPreview.readingDays,
      chaptersPerReadingDay: computedPreview.chaptersPerReadingDay,
      endDate: toTimestamp(computedPreview.endDate), // 안내용 endDate
      summaryText: computedPreview.summaryText,
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
export async function updateCourseTemplate(
  templateId: string,
  input: UpdateCourseTemplateInput,
): Promise<{ ok: true }> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const parsed = courseTemplateUpdateSchema.parse(input)

  const ref = adminDb.collection(COURSE_TEMPLATES_COL).doc(templateId)
  const snap = await ref.get()
  if (!snap.exists) throw new Error('NOT_FOUND')

  const prev = snap.data() as any

  /* 1️⃣ prev + parsed → current 상태 구성 */
  const current = {
    title: parsed.title ?? prev.title,
    description: parsed.description ?? prev.description,

    scopeType: parsed.scopeType ?? prev.scopeType,
    testament: parsed.testament ?? prev.testament,
    books: parsed.books ?? prev.books ?? [],

    periodType: parsed.periodType ?? prev.periodType,
    periodDays: parsed.periodDays ?? prev.periodDays,
    defaultDaysOfWeek: parsed.defaultDaysOfWeek ?? prev.defaultDaysOfWeek,

    status: parsed.status ?? prev.status,
    isDefault: parsed.isDefault ?? prev.isDefault,
    isArchived: parsed.isArchived ?? prev.isArchived,
  }

  /* 2️⃣ totalChapters 재계산 */
  const totalChapters =
    current.scopeType === 'testament'
      ? getTotalChaptersByTestament(current.testament)
      : getTotalChaptersByBooks(current.books)

  if (!totalChapters || totalChapters <= 0) {
    throw new Error('INVALID_TOTAL_CHAPTERS')
  }

  /* 3️⃣ 서버 기준 재계산 (startDate는 가상) */
  const startDate = new Date()
  const computedPreview = computeCoursePreview({
    startDate,
    periodDays: current.periodDays,
    daysOfWeek: current.defaultDaysOfWeek,
    totalChapters,
  })

  /* 4️⃣ patch 구성 */
  const patch = {
    ...current,

    computed: {
      totalChapters,
      readingDays: computedPreview.readingDays,
      chaptersPerReadingDay: computedPreview.chaptersPerReadingDay,
      endDate: toTimestamp(computedPreview.endDate),
      summaryText: computedPreview.summaryText,
    },

    updatedAt: Timestamp.now(),
  }

  await ref.update(patch)
  return { ok: true }
}
