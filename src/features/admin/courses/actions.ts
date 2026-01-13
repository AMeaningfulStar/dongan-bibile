'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { requireAdmin } from '@features/admin/auth/guard'
import { createCourseSchema, updateCourseSchema } from './schema'

import { adminDb } from '@libs/firebase-admin'

const COURSES_COL = 'courses' as const

export type CourseDTO = {
  id: string
  name: string
  startDate: string // ISO
  endDate: string // ISO
  isActive: boolean
  createdAt: string // ISO
  updatedAt: string // ISO
  createdBy: string
}

function toISO(ts?: Timestamp | null) {
  if (!ts) return new Date(0).toISOString()
  return ts.toDate().toISOString()
}

function toTimestamp(date: Date) {
  return Timestamp.fromDate(date)
}

// 커스텀 코스 목록 조회 (MVP)
export async function listCourses(): Promise<CourseDTO[]> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  // 최신 커스텀 코스 위로 오도록 startDate desc 정렬
  const snap = await adminDb.collection(COURSES_COL).orderBy('startDate', 'desc').get()
  return snap.docs.map((doc) => {
    const d = doc.data() as any
    return {
      id: doc.id,
      name: d.name ?? '',
      startDate: toISO(d.startDate),
      endDate: toISO(d.endDate),
      isActive: Boolean(d.isActive),
      createdAt: toISO(d.createdAt),
      updatedAt: toISO(d.updatedAt),
      createdBy: d.createdBy ?? '',
    }
  })
}

// 커스텀 코스 단건 조회 (수정 페이지 초기값용)
export async function getCourse(courseId: string): Promise<CourseDTO | null> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const ref = adminDb.collection(COURSES_COL).doc(courseId)
  const doc = await ref.get()
  if (!doc.exists) return null

  const d = doc.data() as any
  return {
    id: doc.id,
    name: d.name ?? '',
    startDate: toISO(d.startDate),
    endDate: toISO(d.endDate),
    isActive: Boolean(d.isActive),
    createdAt: toISO(d.createdAt),
    updatedAt: toISO(d.updatedAt),
    createdBy: d.createdBy ?? '',
  }
}

// 커스텀 코스 생성 (MVP)
export async function createCourse(input: unknown): Promise<{ id: string }> {
  const admin = await requireAdmin(['mainAdmin', 'subAdmin'])
  const parsed = createCourseSchema.parse(input)

  const now = Timestamp.now()

  const payload = {
    name: parsed.name,
    startDate: toTimestamp(parsed.startDate),
    endDate: toTimestamp(parsed.endDate),
    isActive: Boolean(parsed.isActive),

    createdAt: now,
    updatedAt: now,
    createdBy: admin.uid,
  }

  const ref = await adminDb.collection(COURSES_COL).add(payload)
  return { id: ref.id }
}

// 커스텀 코스 수정 (MVP)
export async function updateCourse(courseId: string, input: unknown): Promise<{ ok: true }> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const parsed = updateCourseSchema.parse(input)

  const patch: Record<string, any> = {
    updatedAt: Timestamp.now(),
  }

  // partial update 지원
  if (typeof parsed.name === 'string') patch.name = parsed.name
  if (parsed.startDate instanceof Date) patch.startDate = toTimestamp(parsed.startDate)
  if (parsed.endDate instanceof Date) patch.endDate = toTimestamp(parsed.endDate)
  if (typeof parsed.isActive === 'boolean') patch.isActive = parsed.isActive

  await adminDb.collection(COURSES_COL).doc(courseId).update(patch)
  return { ok: true }
}
