import { z } from 'zod'

export const courseBaseSchema = {
  name: z.string().trim().min(1, '시즌 이름을 입력해주세요.').max(50, '시즌 이름은 50자 이내여야 합니다.'),

  startDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: '시작일이 올바르지 않습니다.',
  }),

  endDate: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
    message: '종료일이 올바르지 않습니다.',
  }),

  isActive: z.boolean().default(false),
}

export const createCourseSchema = z.object(courseBaseSchema).refine((data) => data.startDate <= data.endDate, {
  message: '종료일은 시작일 이후(또는 동일)여야 합니다.',
  path: ['endDate'],
})

export const updateCourseSchema = z
  .object(courseBaseSchema)
  .partial()
  .refine(
    (data) => {
      // partial이라 둘 중 하나만 들어올 수 있음
      if (!data.startDate || !data.endDate) return true
      return data.startDate <= data.endDate
    },
    {
      message: '종료일은 시작일 이후(또는 동일)여야 합니다.',
      path: ['endDate'],
    },
  )

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
