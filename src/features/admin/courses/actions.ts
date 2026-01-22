'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { requireAdmin } from '@/features/admin/auth/guard'
import { adminDb } from '@/libs/firebase-admin'

import {
  courseCreateSchema,
  courseUpdateSchema,
  type CreateCourseInput,
  type CreateCourseOutput,
  type UpdateCourseOutput,
} from './schema'

import { getTotalChaptersByBooks, getTotalChaptersByTestament } from './lib/bible-chapters'

const COURSES_COL = 'courses' as const

function toISO(ts?: Timestamp | null) {
  if (!ts) return new Date(0).toISOString()
  return ts.toDate().toISOString()
}
function toTimestamp(date: Date) {
  return Timestamp.fromDate(date)
}

/**
 * 정책(MVP)
 * - periodDays는 “달력 기준 span” (startDate부터 periodDays일)
 * - endDate = startDate + (periodDays - 1)
 * - readingDays = span 안에서 daysOfWeek에 해당하는 날짜 수
 * - chaptersPerReadingDay = ceil(totalChapters / readingDays)
 */
function computeServerDerived(params: {
  startDate: Date
  periodDays: number
  daysOfWeek: number[]
  totalChapters: number
}) {
  const { startDate, periodDays, daysOfWeek, totalChapters } = params

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + (periodDays - 1))

  let readingDays = 0
  const cursor = new Date(startDate)

  for (let i = 0; i < periodDays; i++) {
    const dow = cursor.getDay()
    if (daysOfWeek.includes(dow)) readingDays += 1
    cursor.setDate(cursor.getDate() + 1)
  }

  if (readingDays <= 0) {
    throw new Error('INVALID_READING_DAYS')
  }

  const chaptersPerReadingDay = Math.ceil(totalChapters / readingDays)

  // 요약 텍스트는 MVP용으로 간단히
  // const summaryText = `총 ${totalChapters}장 / ${readingDays}회 읽기 → 하루 약 ${chaptersPerReadingDay}장`

  return { endDate, readingDays, chaptersPerReadingDay }
}

function computeTotalChaptersByParsed(parsed: {
  scopeType: 'testament' | 'books'
  testament?: { old: boolean; new: boolean } | null
  books?: string[] | null
}) {
  if (parsed.scopeType === 'testament') {
    if (!parsed.testament) throw new Error('INVALID_TESTAMENT_SCOPE')
    return getTotalChaptersByTestament(parsed.testament)
  }

  // books
  const books = parsed.books ?? []
  if (!Array.isArray(books) || books.length === 0) {
    throw new Error('INVALID_BOOKS_SCOPE')
  }
  return getTotalChaptersByBooks(books)
}

// ✅ 생성
export async function createCourse(input: CreateCourseInput): Promise<{ id: string }> {
  const admin = await requireAdmin(['mainAdmin', 'subAdmin'])

  // parse 결과(output)은 startDate 등이 Date로 정규화됨
  const parsed: CreateCourseOutput = courseCreateSchema.parse(input)

  const totalChapters = computeTotalChaptersByParsed(parsed)
  if (!totalChapters || totalChapters <= 0) throw new Error('INVALID_TOTAL_CHAPTERS')

  const { endDate, readingDays, chaptersPerReadingDay } = computeServerDerived({
    startDate: parsed.startDate,
    periodDays: parsed.periodDays,
    daysOfWeek: parsed.daysOfWeek,
    totalChapters,
  })

  // summaryText는 "computed"에서 관리 (MVP: 문장 고정)
  const summaryText = `선택한 성경은 총 ${totalChapters}장 입니다. 하루 약 ${chaptersPerReadingDay}장씩 ${readingDays}번 읽으면 완독할 수 있습니다. (기간 ${parsed.periodDays}일)`

  const now = Timestamp.now()

  const payload = {
    // 입력 원본
    title: parsed.title,
    startDate: toTimestamp(parsed.startDate),
    daysOfWeek: parsed.daysOfWeek,
    scopeType: parsed.scopeType,
    testament: parsed.scopeType === 'testament' ? parsed.testament : null,
    books: parsed.scopeType === 'books' ? parsed.books : [],
    periodType: parsed.periodType,
    periodDays: parsed.periodDays,
    status: parsed.status,

    // computed(파생값) - ✅ 중첩 유지
    computed: {
      totalChapters,
      endDate: toTimestamp(endDate),
      readingDays,
      chaptersPerReadingDay,
      summaryText,
    },

    // meta
    createdAt: now,
    updatedAt: now,
    createdBy: admin.uid,
  }

  const ref = await adminDb.collection(COURSES_COL).add(payload)
  return { id: ref.id }
}

// 수정 (재계산 + computed patch 포함)
export async function updateCourse(courseId: string, input: unknown): Promise<{ ok: true }> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  // prev 로드 (partial update라 prev가 필요)
  const ref = adminDb.collection(COURSES_COL).doc(courseId)
  const snap = await ref.get()
  if (!snap.exists) throw new Error('COURSE_NOT_FOUND')

  const prev = snap.data() as any

  // 입력 검증(부분 업데이트)
  const parsed: UpdateCourseOutput = courseUpdateSchema.parse(input)

  // patch(원본 업데이트) 구성
  const patch: Record<string, any> = {
    updatedAt: Timestamp.now(),
  }

  // 원본 업데이트(들어온 것만)
  if (typeof parsed.title === 'string') patch.title = parsed.title
  if (parsed.startDate instanceof Date) patch.startDate = toTimestamp(parsed.startDate)
  if (Array.isArray(parsed.daysOfWeek)) patch.daysOfWeek = parsed.daysOfWeek

  if (parsed.scopeType) patch.scopeType = parsed.scopeType
  if (parsed.scopeType === 'testament' && parsed.testament) patch.testament = parsed.testament
  if (parsed.scopeType === 'books' && parsed.books) patch.books = parsed.books

  // scopeType이 안 바뀌었는데 testament/books만 바꿀 수 있음
  if (!parsed.scopeType && parsed.testament) patch.testament = parsed.testament
  if (!parsed.scopeType && parsed.books) patch.books = parsed.books

  if (parsed.periodType) patch.periodType = parsed.periodType
  if (typeof parsed.periodDays === 'number') patch.periodDays = parsed.periodDays
  if (parsed.status) patch.status = parsed.status

  // 재계산용 current 값 만들기 (parsed 우선, 없으면 prev)
  const current = {
    startDate: (parsed.startDate ?? prev.startDate?.toDate?.()) as Date,
    periodDays: (parsed.periodDays ?? prev.periodDays) as number,
    daysOfWeek: (parsed.daysOfWeek ?? prev.daysOfWeek) as number[],
    scopeType: (parsed.scopeType ?? prev.scopeType) as 'testament' | 'books',
    testament: (parsed.testament ?? prev.testament ?? null) as { old: boolean; new: boolean } | null,
    books: (parsed.books ?? prev.books ?? []) as string[],
  }

  // 방어
  if (!(current.startDate instanceof Date) || isNaN(current.startDate.getTime())) {
    throw new Error('INVALID_START_DATE')
  }
  if (!Array.isArray(current.daysOfWeek) || current.daysOfWeek.length === 0) {
    throw new Error('INVALID_DAYS_OF_WEEK')
  }
  if (typeof current.periodDays !== 'number' || current.periodDays <= 0) {
    throw new Error('INVALID_PERIOD_DAYS')
  }

  // 5) totalChapters + derived 재계산
  const totalChapters = computeTotalChaptersByParsed(current)
  if (!totalChapters || totalChapters <= 0) throw new Error('INVALID_TOTAL_CHAPTERS')

  const { endDate, readingDays, chaptersPerReadingDay } = computeServerDerived({
    startDate: current.startDate,
    periodDays: current.periodDays,
    daysOfWeek: current.daysOfWeek,
    totalChapters,
  })

  const summaryText = `선택한 성경은 총 ${totalChapters}장 입니다. 하루 약 ${chaptersPerReadingDay}장씩 ${readingDays}번 읽으면 완독할 수 있습니다. (기간 ${current.periodDays}일)`

  // computed는 통째로 갱신(불일치 방지)
  patch.computed = {
    totalChapters,
    endDate: toTimestamp(endDate),
    readingDays,
    chaptersPerReadingDay,
    summaryText,
  }

  // 저장
  await ref.update(patch)
  return { ok: true }
}

export type CourseDTO = {
  id: string
  title: string
  startDate: string
  endDate: string
  daysOfWeek: number[]
  scopeType: 'testament' | 'books'
  testament?: { old: boolean; new: boolean } | null
  books?: string[]
  periodType: 'days'
  periodDays: number
  totalChapters: number
  chaptersPerReadingDay: number
  summaryText: string
  status: 'draft' | 'active'
  createdAt: string
  updatedAt: string
  createdBy: string
}

// 목록
export async function listCourses(): Promise<CourseDTO[]> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const snap = await adminDb.collection(COURSES_COL).orderBy('startDate', 'desc').get()
  return snap.docs.map((doc) => {
    const d = doc.data() as any
    const computed = d.computed ?? {}
    return {
      id: doc.id,
      title: d.title ?? '',
      startDate: toISO(d.startDate),
      endDate: computed.endDate ? toISO(computed.endDate) : new Date(0).toISOString(),

      daysOfWeek: d.daysOfWeek ?? [],
      scopeType: d.scopeType,
      testament: d.testament ?? null,
      books: d.books ?? [],

      periodType: d.periodType ?? 'days',
      periodDays: d.periodDays ?? 0,

      totalChapters: computed.totalChapters ?? 0,
      chaptersPerReadingDay: computed.chaptersPerReadingDay ?? 0,
      summaryText: computed.summaryText ?? '',

      status: d.status ?? 'draft',

      createdAt: toISO(d.createdAt),
      updatedAt: toISO(d.updatedAt),
      createdBy: d.createdBy ?? '',
    }
  })
}

// 단건
export async function getCourse(courseId: string): Promise<CourseDTO | null> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const ref = adminDb.collection(COURSES_COL).doc(courseId)
  const doc = await ref.get()
  if (!doc.exists) return null

  const d = doc.data() as any
  const computed = d.computed ?? {}

  return {
    id: doc.id,
    title: d.title ?? '',
    startDate: toISO(d.startDate),
    endDate: computed.endDate ? toISO(computed.endDate) : new Date(0).toISOString(),

    daysOfWeek: d.daysOfWeek ?? [],
    scopeType: d.scopeType,
    testament: d.testament ?? null,
    books: d.books ?? [],

    periodType: d.periodType ?? 'days',
    periodDays: d.periodDays ?? 0,

    totalChapters: computed.totalChapters ?? 0,
    chaptersPerReadingDay: computed.chaptersPerReadingDay ?? 0,
    summaryText: computed.summaryText ?? '',

    status: d.status ?? 'draft',

    createdAt: toISO(d.createdAt),
    updatedAt: toISO(d.updatedAt),
    createdBy: d.createdBy ?? '',
  }
}
