// Course 범위 타입
export type CourseScopeType = 'testament' | 'books'

// Course 기간 타입
export type CoursePeriodType = 'days' // MVP 1차는 days만

// Course 상태 타입
export type CourseStatus = 'draft' | 'active'

// 요일: 0=일 ~ 6=토
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

// Course 계산된 필드 타입
export type CourseComputed = {
  durationDays: number
  endDate: Date
  readingDays: number
  chaptersPerReadingDay: number
  summaryText: string
}

// Course 문서 타입
export type CourseDoc = {
  title: string
  startDate: Date
  daysOfWeek: DayOfWeek[]

  scopeType: CourseScopeType
  testament?: { old: boolean; new: boolean }
  books?: string[]

  periodType: CoursePeriodType
  periodDays: number

  totalChapters: number
  computed: CourseComputed

  status: CourseStatus

  createdAt: Date
  updatedAt: Date
  createdBy?: string
}
