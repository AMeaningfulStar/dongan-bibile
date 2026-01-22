import { z } from 'zod'

// 0=일 ~ 6=토
const dayOfWeekSchema = z.number().int().min(0).max(6)

// 공통 필드 정의
export const courseBaseSchema = z.object({
  title: z.string().trim().min(1, '코스 제목을 입력해주세요.').max(50, '코스 제목은 50자 이내여야 합니다.'),

  startDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: '시작일이 올바르지 않습니다.',
  }),

  daysOfWeek: z.array(dayOfWeekSchema).min(1, '적어도 하루 이상의 요일을 선택해야 합니다.'),

  scopeType: z.enum(['testament', 'books']),

  testament: z
    .object({
      old: z.boolean(),
      new: z.boolean(),
    })
    .optional(),

  books: z.array(z.string()).optional(),

  periodType: z.literal('days'),
  periodDays: z.number().int().min(1, '기간(일수)은 1 이상이어야 합니다.'),

  status: z.enum(['draft', 'active']).default('draft'),
})

// Create: 공통 필드 정의 + superRefine(조건부 필수/도메인 규칙)
export const courseCreateSchema = courseBaseSchema.superRefine((data, ctx) => {
  // scopeType === testament -> testament 필수 + 최소 하나는 true
  if (data.scopeType === 'testament') {
    if (!data.testament) {
      ctx.addIssue({
        code: 'custom',
        path: ['testament'],
        message: '구약/신약 선택이 필요합니다.',
      })
      return
    }
    if (!data.testament.old && !data.testament.new) {
      ctx.addIssue({
        code: 'custom',
        path: ['testament'],
        message: '구약 또는 신약 중 하나 이상 선택해야 합니다.',
      })
    }
  }

  // scopeType === books -> books 필수 + 1개 이상
  if (data.scopeType === 'books') {
    if (!data.books || data.books.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['books'],
        message: '성경 권을 하나 이상 선택해주세요.',
      })
    }
  }
})

// Update: base.partial() + id 필수 + "필요한 최소 검증"만 추가
export const courseUpdateSchema = courseBaseSchema
  .partial()
  .extend({
    id: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    // scopeType만 들어오고 관련 필드가 안 들어오는 patch 방지(원하면)
    if (data.scopeType === 'testament') {
      // scopeType을 testament로 바꾸려면 testament payload도 함께 보내도록 유도
      if (data.testament === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['testament'],
          message: 'scopeType이 testament이면 testament 값도 함께 보내야 합니다.',
        })
      }
    }

    if (data.scopeType === 'books') {
      if (data.books !== undefined && data.books.length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['books'],
          message: 'books는 빈 배열일 수 없습니다.',
        })
      }
    }
  })

export type CreateCourseInput = z.input<typeof courseCreateSchema>
export type CreateCourseOutput = z.output<typeof courseCreateSchema>
export type UpdateCourseInput = z.input<typeof courseUpdateSchema>
export type UpdateCourseOutput = z.output<typeof courseUpdateSchema>
