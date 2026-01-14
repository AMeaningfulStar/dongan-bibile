import { z } from 'zod'

// 0=일 ~ 6=토
const dayOfWeekSchema = z.number().int().min(0).max(6)

export const courseCreateSchema = z
  .object({
    title: z.string().trim().min(1, '코스 제목을 입력해주세요.').max(50, '코스 제목은 50자 이내여야 합니다.'),

    startDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
      message: '시작일이 올바르지 않습니다.',
    }),

    daysOfWeek: z.array(dayOfWeekSchema).min(1, '적어도 하루 이상의 요일을 선택해야 합니다.'),

    scopeType: z.enum(['testament', 'books']),

    // testament 선택 시
    testament: z
      .object({
        old: z.boolean(),
        new: z.boolean(),
      })
      .optional(),

    // books 선택 시
    books: z.array(z.string()).optional(),

    // MVP: 기간(일수) 입력
    periodType: z.literal('days'),

    periodDays: z
      .number()
      .int('기간은 정수여야 합니다.')
      .min(1, '기간은 1일 이상이어야 합니다.')
      .max(2000, '기간이 너무 큽니다.')
      .refine((val) => !isNaN(val), {
        message: '기간(일수)을 입력해주세요.',
      }),

    // MVP: 초안/활성
    status: z.enum(['draft', 'active']).default('draft'),
  })
  .superRefine((data, ctx) => {
    // scopeType에 따라 필수값 강제
    if (data.scopeType === 'testament') {
      if (!data.testament) {
        ctx.addIssue({
          code: 'custom',
          message: '구약/신약 선택이 필요합니다.',
          path: ['testament'],
        })
        return
      }
      if (!data.testament.old && !data.testament.new) {
        ctx.addIssue({
          code: 'custom',
          message: '구약/신약 중 최소 1개를 선택해주세요.',
          path: ['testament'],
        })
      }
    }

    if (data.scopeType === 'books') {
      if (!data.books || data.books.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: '성경 권을 최소 1개 선택해주세요.',
          path: ['books'],
        })
      }
    }
  })

export const courseUpdateSchema = courseCreateSchema.partial().extend({
  id: z.string().min(1),
})

export type CreateCourseInput = z.infer<typeof courseCreateSchema>
export type UpdateCourseInput = z.infer<typeof courseUpdateSchema>
