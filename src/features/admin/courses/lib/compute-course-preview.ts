export type CoursePreviewInput = {
  startDate: Date
  periodDays: number
  daysOfWeek: number[] // 0=일 ~ 6=토
  totalChapters: number
}

export type CoursePreviewComputed = {
  durationDays: number
  endDate: Date
  readingDays: number
  chaptersPerReadingDay: number
  summaryText: string
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const DOW_LABEL: Record<number, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
}

function formatDaysOfWeek(days: number[]) {
  const sorted = [...days].sort((a, b) => a - b)
  return sorted.map((d) => DOW_LABEL[d] ?? String(d)).join(', ')
}

export function computeCoursePreview(input: CoursePreviewInput): CoursePreviewComputed {
  const { startDate, periodDays, daysOfWeek, totalChapters } = input

  const durationDays = Math.max(1, periodDays || 1)

  // 달력 기준 span: startDate부터 (periodDays - 1) 더한 날짜까지
  const endDate = addDays(startDate, durationDays - 1)

  // 실제 읽는 날 수: startDate~endDate 날짜를 순회하며 요일 포함 여부 체크
  const daySet = new Set(daysOfWeek)
  let readingDays = 0

  // 안전장치: daysOfWeek가 비어있으면 0이므로 계산 실패 → summary도 비움
  if (daySet.size > 0) {
    for (let i = 0; i < durationDays; i++) {
      const d = addDays(startDate, i)
      const dow = d.getDay() // 0~6
      if (daySet.has(dow)) readingDays++
    }
  }

  // readingDays가 0이면 divide 방지 (아직 입력이 덜 된 상태)
  const safeReadingDays = Math.max(1, readingDays)
  const chaptersPerReadingDay = totalChapters > 0 ? Math.ceil(totalChapters / safeReadingDays) : 0

  const summaryText =
    totalChapters > 0 && daySet.size > 0
      ? `${formatDaysOfWeek(daysOfWeek)} 기준으로 총 ${readingDays}번 읽습니다. ` +
        `하루 약 ${chaptersPerReadingDay}장씩 읽으면 완독할 수 있습니다. ` +
        `(${formatDate(startDate)} ~ ${formatDate(endDate)})`
      : '분량/요일/기간을 입력하면 완독 계산이 표시됩니다.'

  return {
    durationDays,
    endDate,
    readingDays,
    chaptersPerReadingDay,
    summaryText,
  }
}
