import { options as bibleOptions } from '@/features/admin/bible/bible-option'

/**
 * 정책 메모 (중요)
 * - totalChapters는 "선택된 분량의 총 장 수"만 계산한다.
 * - periodDays / startDate / daysOfWeek는 여기서 고려하지 않는다.
 * - periodDays는 "달력 기준 span"으로 해석한다. (MVP 고정)
 */

// 책별 장 수 맵
export const CHAPTERS_BY_BOOK: Record<string, number> = bibleOptions.reduce(
  (acc, book) => {
    acc[book.book] = book.chapters
    return acc
  },
  {} as Record<string, number>,
)

// 구약 / 신약 총 장 수 상수
export const OLD_TESTAMENT_CHAPTERS = bibleOptions
  .filter((b) => b.testament === 'oldTestament')
  .reduce((sum, b) => sum + b.chapters, 0)

export const NEW_TESTAMENT_CHAPTERS = bibleOptions
  .filter((b) => b.testament === 'newTestament')
  .reduce((sum, b) => sum + b.chapters, 0)

// 구약/신약 단위 선택 시 총 장 수 계산 함수
export function getTotalChaptersByTestament(input: { old: boolean; new: boolean }): number {
  let total = 0

  if (input.old) total += OLD_TESTAMENT_CHAPTERS
  if (input.new) total += NEW_TESTAMENT_CHAPTERS

  return total
}

// 성경 권별 선택 시 총 장 수 계산 함수
export function getTotalChaptersByBooks(books: string[]): number {
  return books.reduce((sum, bookKey) => {
    return sum + (CHAPTERS_BY_BOOK[bookKey] ?? 0)
  }, 0)
}
