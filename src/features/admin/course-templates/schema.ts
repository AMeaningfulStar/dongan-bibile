import { z } from 'zod'

// 0=일 ~ 6=토
const dayOfWeekSchema = z.number().int().min(0).max(6)

// 공통 필드 정의
export const courseTemplateBaseSchema = z.object({
  // 코스 템플릿 제목
  title: z
    .string()
    .trim()
    .min(1, '코스 템플릿 제목을 입력해주세요.')
    .max(60, '코스 템플릿 제목은 60자 이내여야 합니다.'),

  // 코스 템플릿 설명(선택)
  description: z.string().trim().max(300, '설명은 300자 이내여야 합니다.').optional().default(''),

  // 분량(범위) 설정[구약/신약 or 권별]
  scopeType: z.enum(['testament', 'books']),

  // scopeType=testament 일 때 사용
  testament: z
    .object({
      old: z.boolean().default(false),
      new: z.boolean().default(false),
    })
    .optional(),

  // scopeType=books 일 때 사용
  books: z.array(z.string()).optional(),

  // TODO: 기간 설정 (MVP: 달력 span 기준 "N일")
  // periodType: 현재는 'days' 고정
  // 'days': 00일간 통독/ 'chapters': 하루 몇장 통독
  periodType: z.literal('days').default('days'),

  // 기간(일수)
  periodDays: z.coerce
    .number()
    .int()
    .min(1, '기간(일수)은 1 이상이어야 합니다.')
    .max(2000, '기간(일수)이 너무 큽니다.'),

  // 템플릿 권장 요일(인스턴스 생성 시 기본값으로 사용)
  // MVP: 기본은 매일(일~토)
  defaultDaysOfWeek: z
    .array(dayOfWeekSchema)
    .min(1, '적어도 하루 이상의 요일이 필요합니다.')
    .default([0, 1, 2, 3, 4, 5, 6]),

  // 운영 상태
  status: z.enum(['draft', 'published']).default('draft'),

  // 노출 정책(선택)
  isDefault: z.boolean().default(false), // “기본 코스”로 노출할지
  isArchived: z.boolean().default(false), // 운영 종료/숨김(soft)
})

/**
 * Create: 공통 필드 정의 + superRefine
 * - scopeType 별 필드 필수 조건을 검증
 */
export const courseTemplateCreateSchema = courseTemplateBaseSchema.superRefine((data, ctx) => {
  // scopeType=testament: old/new 둘 중 하나 이상 true
  if (data.scopeType === 'testament') {
    const t = data.testament ?? { old: false, new: false }
    if (!t.old && !t.new) {
      ctx.addIssue({
        code: 'custom',
        message: '구약/신약 중 하나 이상 선택해주세요.',
        path: ['testament'],
      })
    }
  }

  // scopeType=books: books 1개 이상
  if (data.scopeType === 'books') {
    const books = data.books ?? []
    if (books.length < 1) {
      ctx.addIssue({
        code: 'custom',
        message: '성경 권을 1개 이상 선택해주세요.',
        path: ['books'],
      })
    }
  }
})

/**
 * Update
 * - partial update 지원
 * - scopeType을 바꾸는 경우도 고려해서 "현재 입력" 기준으로만 검증
 */
export const courseTemplateUpdateSchema = courseTemplateBaseSchema
  .partial()
  .extend({
    id: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    // scopeType이 안 들어오면, 여기서는 강제 검증하지 않음(부분 업데이트)
    if (!data.scopeType) return

    if (data.scopeType === 'testament') {
      const t = data.testament ?? { old: false, new: false }
      if (!t.old && !t.new) {
        ctx.addIssue({
          code: 'custom',
          message: '구약/신약 중 하나 이상 선택해주세요.',
          path: ['testament'],
        })
      }
    }

    if (data.scopeType === 'books') {
      const books = data.books ?? []
      if (books.length < 1) {
        ctx.addIssue({
          code: 'custom',
          message: '성경 권을 1개 이상 선택해주세요.',
          path: ['books'],
        })
      }
    }
  })

/**
 * ✅ 타입은 RHF/ServerAction에서 꼬이지 않도록 input/output 모두 export 해두는 패턴 권장
 * - input: 폼/클라이언트에서 들어올 수 있는 형태(문자열 포함)
 * - output: zod parse 후 정규화된 형태
 */
export type CreateCourseTemplateInput = z.input<typeof courseTemplateCreateSchema>
export type CreateCourseTemplateOutput = z.output<typeof courseTemplateCreateSchema>

export type UpdateCourseTemplateInput = z.input<typeof courseTemplateUpdateSchema>
export type UpdateCourseTemplateOutput = z.output<typeof courseTemplateUpdateSchema>
