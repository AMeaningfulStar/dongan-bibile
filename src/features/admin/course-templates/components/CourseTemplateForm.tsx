'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { createCourseTemplate } from '@/features/admin/course-templates/actions'
import { courseTemplateCreateSchema, type CreateCourseTemplateInput } from '@/features/admin/course-templates/schema'

import { options as bibleOptions } from '@/features/admin/bible/bible-option'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { CourseTemplatePreview, type CourseTemplateFormValues } from './CourseTemplatePreview'

type Props = {
  mode: 'create' | 'edit'
  templateId?: string
  initialValues?: Partial<CreateCourseTemplateInput>
  /** create 후 이동 경로: 기본은 상세로 이동, 원하면 목록으로 바꿔도 됨 */
  redirectTo?: 'detail' | 'list'
}

const DOW = [
  { value: 0, label: '일' },
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
] as const

const DEFAULT_VALUES: CreateCourseTemplateInput = {
  title: '',
  description: '',

  scopeType: 'testament',
  testament: { old: true, new: false },
  books: [],

  periodType: 'days',
  periodDays: 100,

  defaultDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  status: 'draft',

  isDefault: false,
  isArchived: false,
}

export function CourseTemplateForm({ mode, initialValues, redirectTo = 'detail' }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const bookSelectOptions = useMemo(() => {
    return bibleOptions.map((b) => ({
      value: b.book,
      label: `${b.label} (${b.chapters}장)`,
      testament: b.testament,
    }))
  }, [])

  const form = useForm<CreateCourseTemplateInput>({
    resolver: zodResolver(courseTemplateCreateSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
    },
    mode: 'onChange',
  })

  const scopeType = form.watch('scopeType')
  const daysOfWeek = form.watch('defaultDaysOfWeek')

  const onSubmit = (values: CreateCourseTemplateInput) => {
    startTransition(async () => {
      try {
        if (mode === 'create') {
          const { id } = await createCourseTemplate(values)
          if (redirectTo === 'list') {
            router.push('/admin/course-templates')
          } else {
            router.push(`/admin/course-templates/${id}`)
          }
          return
        }

        alert('edit 모드는 커밋 5/6에서 연결 권장입니다. (updateCourseTemplate)')
      } catch (e) {
        console.error(e)
        alert('코스 템플릿 저장에 실패했습니다.')
      }
    })
  }

  // Preview는 CourseTemplateFormValues를 기대 (RHF control 타입 호환)
  const previewControl = form.control as any as import('react-hook-form').Control<CourseTemplateFormValues>

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 제목 */}
        <div className="space-y-2">
          <Label htmlFor="title">코스 템플릿 이름</Label>
          <Input id="title" placeholder="예: 1년 1독 / 100일 구약 통독" {...form.register('title')} />
          {form.formState.errors.title?.message && (
            <p className="text-sm text-destructive">{String(form.formState.errors.title.message)}</p>
          )}
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description">설명(선택)</Label>
          <Input id="description" placeholder="예: 하루 3~4장 수준" {...form.register('description')} />
          {form.formState.errors.description?.message && (
            <p className="text-sm text-destructive">{String(form.formState.errors.description.message)}</p>
          )}
        </div>

        <Separator />

        {/* 기간 */}
        <div className="space-y-2">
          <Label htmlFor="periodDays">기간(일수)</Label>
          <Input
            id="periodDays"
            type="number"
            min={1}
            max={2000}
            {...form.register('periodDays', { valueAsNumber: true })}
          />
          {form.formState.errors.periodDays?.message && (
            <p className="text-sm text-destructive">{String(form.formState.errors.periodDays.message)}</p>
          )}
        </div>

        <Separator />

        {/* 요일 선택 */}
        <div className="space-y-2">
          <Label>읽을 요일(기본값)</Label>
          <div className="flex flex-wrap gap-3">
            {DOW.map((d) => {
              const checked = (daysOfWeek ?? []).includes(d.value)
              return (
                <label key={d.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = new Set(daysOfWeek ?? [])
                      if (e.target.checked) next.add(d.value)
                      else next.delete(d.value)
                      form.setValue(
                        'defaultDaysOfWeek',
                        Array.from(next).sort((a, b) => a - b),
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        },
                      )
                    }}
                  />
                  {d.label}
                </label>
              )
            })}
          </div>
          {form.formState.errors.defaultDaysOfWeek?.message && (
            <p className="text-sm text-destructive">{String(form.formState.errors.defaultDaysOfWeek.message)}</p>
          )}
        </div>

        <Separator />

        {/* 분량 설정 */}
        <div className="space-y-3">
          <Label>분량 설정</Label>

          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="testament"
                checked={scopeType === 'testament'}
                onChange={() => form.setValue('scopeType', 'testament', { shouldValidate: true })}
              />
              구약/신약 단위
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="books"
                checked={scopeType === 'books'}
                onChange={() => form.setValue('scopeType', 'books', { shouldValidate: true })}
              />
              성경 권별 설정
            </label>
          </div>

          {scopeType === 'testament' && (
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!form.watch('testament')?.old}
                    onChange={(e) => {
                      const curr = form.getValues('testament') ?? { old: false, new: false }
                      form.setValue('testament', { ...curr, old: e.target.checked }, { shouldValidate: true })
                    }}
                  />
                  구약
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!form.watch('testament')?.new}
                    onChange={(e) => {
                      const curr = form.getValues('testament') ?? { old: false, new: false }
                      form.setValue('testament', { ...curr, new: e.target.checked }, { shouldValidate: true })
                    }}
                  />
                  신약
                </label>
              </div>

              {form.formState.errors.testament?.message && (
                <p className="text-sm text-destructive">{String(form.formState.errors.testament.message)}</p>
              )}
            </div>
          )}

          {scopeType === 'books' && (
            <div className="space-y-2 rounded-lg border p-4">
              <Label className="text-sm text-muted-foreground">성경 권 선택 (Ctrl/Command로 다중 선택)</Label>

              <select
                multiple
                className="h-56 w-full rounded-md border bg-background p-2 text-sm"
                value={form.watch('books') ?? []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                  form.setValue('books', selected, { shouldDirty: true, shouldValidate: true })
                }}
              >
                <optgroup label="구약">
                  {bookSelectOptions
                    .filter((b) => b.testament === 'oldTestament')
                    .map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                </optgroup>

                <optgroup label="신약">
                  {bookSelectOptions
                    .filter((b) => b.testament === 'newTestament')
                    .map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                </optgroup>
              </select>

              {form.formState.errors.books?.message && (
                <p className="text-sm text-destructive">{String(form.formState.errors.books.message)}</p>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* 상태 */}
        <div className="space-y-2">
          <Label>상태</Label>
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="draft"
                checked={form.watch('status') === 'draft'}
                onChange={() => form.setValue('status', 'draft', { shouldValidate: true })}
              />
              임시 저장/초안
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="active"
                checked={form.watch('status') === 'published'}
                onChange={() => form.setValue('status', 'published', { shouldValidate: true })}
              />
              게시/발행
            </label>
          </div>
        </div>

        {/* 미리보기 */}
        <CourseTemplatePreview control={previewControl} />

        {/* 제출 */}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isPending || !form.formState.isValid}>
            {isPending ? '저장 중...' : mode === 'create' ? '템플릿 생성' : '템플릿 저장'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/course-templates')}
            disabled={isPending}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  )
}
