'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { requireAdmin } from '@features/admin/auth/guard'

import { courseCreateSchema, courseUpdateSchema } from './schema'

import { adminDb } from '@libs/firebase-admin'

const COURSES_COL = 'courses' as const

export type CourseDTO = {
  id: string
  title: string
  startDate: string
  // endDate는 computed에서 내려줌
  endDate: string
  daysOfWeek: number[]
  scopeType: 'testament' | 'books'
  testament?: { old: boolean; new: boolean }
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

function toISO(ts?: Timestamp | null) {
  if (!ts) return new Date(0).toISOString()
  return ts.toDate().toISOString()
}
function toTimestamp(date: Date) {
  return Timestamp.fromDate(date)
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
      testament: d.testament,
      books: d.books,

      periodType: d.periodType ?? 'days',
      periodDays: d.periodDays ?? 0,

      totalChapters: d.totalChapters ?? 0,
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
    testament: d.testament,
    books: d.books,

    periodType: d.periodType ?? 'days',
    periodDays: d.periodDays ?? 0,

    totalChapters: d.totalChapters ?? 0,
    chaptersPerReadingDay: computed.chaptersPerReadingDay ?? 0,
    summaryText: computed.summaryText ?? '',

    status: d.status ?? 'draft',

    createdAt: toISO(d.createdAt),
    updatedAt: toISO(d.updatedAt),
    createdBy: d.createdBy ?? '',
  }
}

// 생성
// TODO: (커밋 2: 계산은 아직 임시값)
export async function createCourse(input: unknown): Promise<{ id: string }> {
  const admin = await requireAdmin(['mainAdmin', 'subAdmin'])
  const parsed = courseCreateSchema.parse(input)

  const now = Timestamp.now()

  const payload = {
    title: parsed.title,
    startDate: toTimestamp(parsed.startDate),
    daysOfWeek: parsed.daysOfWeek,

    scopeType: parsed.scopeType,
    testament: parsed.scopeType === 'testament' ? parsed.testament : null,
    books: parsed.scopeType === 'books' ? parsed.books : null,

    periodType: parsed.periodType,
    periodDays: parsed.periodDays,

    // TODO: 커밋 3~5에서 서버 계산으로 채우기
    totalChapters: 0,
    computed: {
      durationDays: parsed.periodDays,
      endDate: toTimestamp(parsed.startDate), // 임시
      readingDays: 0,
      chaptersPerReadingDay: 0,
      summaryText: '',
    },

    status: parsed.status ?? 'draft',

    createdAt: now,
    updatedAt: now,
    createdBy: admin.uid,
  }

  const ref = await adminDb.collection(COURSES_COL).add(payload)
  return { id: ref.id }
}

// 수정
export async function updateCourse(courseId: string, input: unknown): Promise<{ ok: true }> {
  await requireAdmin(['mainAdmin', 'subAdmin'])
  const parsed = courseUpdateSchema.parse(input)

  const patch: Record<string, any> = {
    updatedAt: Timestamp.now(),
  }

  if (typeof parsed.title === 'string') patch.title = parsed.title
  if (parsed.startDate instanceof Date) patch.startDate = toTimestamp(parsed.startDate)
  if (Array.isArray(parsed.daysOfWeek)) patch.daysOfWeek = parsed.daysOfWeek

  if (parsed.scopeType) patch.scopeType = parsed.scopeType
  if (parsed.testament) patch.testament = parsed.testament
  if (parsed.books) patch.books = parsed.books

  if (parsed.periodType) patch.periodType = parsed.periodType
  if (typeof parsed.periodDays === 'number') patch.periodDays = parsed.periodDays

  if (parsed.status) patch.status = parsed.status

  // TODO: 커밋 5에서 totalChapters/computed 재계산 후 patch에 반영

  await adminDb.collection(COURSES_COL).doc(courseId).update(patch)
  return { ok: true }
}
