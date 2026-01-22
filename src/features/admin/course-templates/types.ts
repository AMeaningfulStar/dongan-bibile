export type AdminCourseTemplateStatus = 'draft' | 'published'

export type CourseTemplateScopeType = 'testament' | 'books'

export type TestamentSelection = {
  old: boolean
  new: boolean
}

/**
 * Firestore 저장 형태(권장)
 * - createdAt/updatedAt: Timestamp (server)
 * - computed는 서버 계산 결과(TODO: 다음 커밋에서 추가 예정)
 */
export type CourseTemplateDoc = {
  title: string
  description: string

  scopeType: CourseTemplateScopeType
  testament: TestamentSelection | null
  books: string[]

  periodType: 'days'
  periodDays: number
  defaultDaysOfWeek: number[]

  status: AdminCourseTemplateStatus
  isDefault: boolean
  isArchived: boolean

  // meta
  createdAt: any // Timestamp (firebase-admin/firestore)
  updatedAt: any // Timestamp
  createdBy: string

  // TODO: computed — 다음 커밋에서 붙일 자리
  computed?: {
    totalChapters: number
    // 템플릿 레벨에서는 endDate 계산 불가(startDate가 인스턴스에 있으므로)
    // 필요 시 "권장 하루 분량(estimate)" 정도만 넣는 방향을 추천
    estimatedChaptersPerReadingDay?: number
    summaryText?: string
  }
}

// UI에 내려주는 DTO
export type CourseTemplateDTO = {
  id: string
  title: string
  description: string

  scopeType: CourseTemplateScopeType
  testament?: TestamentSelection
  books?: string[]

  periodType: 'days'
  periodDays: number
  defaultDaysOfWeek: number[]

  status: AdminCourseTemplateStatus
  isDefault: boolean
  isArchived: boolean

  // computed (있으면 표시)
  computed?: {
    totalChapters: number
    estimatedChaptersPerReadingDay?: number
    summaryText?: string
  }

  createdAt: string // ISO
  updatedAt: string // ISO
  createdBy: string
}
