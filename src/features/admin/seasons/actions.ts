'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { requireAdmin } from '@features/admin/auth/guard'
import { createSeasonSchema, updateSeasonSchema } from './schema'

import { adminDb } from '@libs/firebase-admin'

const SEASONS_COL = 'seasons' as const

export type SeasonDTO = {
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

// 시즌 목록 조회 (MVP)
export async function listSeasons(): Promise<SeasonDTO[]> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  // 최신 시즌이 위로 오도록 startDate desc 정렬
  const snap = await adminDb.collection(SEASONS_COL).orderBy('startDate', 'desc').get()

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

// 시즌 단건 조회 (수정 페이지 초기값용)
export async function getSeason(seasonId: string): Promise<SeasonDTO | null> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const ref = adminDb.collection(SEASONS_COL).doc(seasonId)
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

// 시즌 생성 (MVP)
export async function createSeason(input: unknown): Promise<{ id: string }> {
  const admin = await requireAdmin(['mainAdmin', 'subAdmin'])
  const parsed = createSeasonSchema.parse(input)

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

  const ref = await adminDb.collection(SEASONS_COL).add(payload)
  return { id: ref.id }
}

// 시즌 수정 (MVP)
export async function updateSeason(seasonId: string, input: unknown): Promise<{ ok: true }> {
  await requireAdmin(['mainAdmin', 'subAdmin'])

  const parsed = updateSeasonSchema.parse(input)

  const patch: Record<string, any> = {
    updatedAt: Timestamp.now(),
  }

  // partial update 지원
  if (typeof parsed.name === 'string') patch.name = parsed.name
  if (parsed.startDate instanceof Date) patch.startDate = toTimestamp(parsed.startDate)
  if (parsed.endDate instanceof Date) patch.endDate = toTimestamp(parsed.endDate)
  if (typeof parsed.isActive === 'boolean') patch.isActive = parsed.isActive

  await adminDb.collection(SEASONS_COL).doc(seasonId).update(patch)
  return { ok: true }
}
