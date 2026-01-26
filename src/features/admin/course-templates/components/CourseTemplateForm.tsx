'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { createCourseTemplate, updateCourseTemplate } from '@/features/admin/course-templates/actions'
import {
  courseTemplateCreateSchema,
  UpdateCourseTemplateInput,
  type CreateCourseTemplateInput,
} from '@/features/admin/course-templates/schema'

import { options as bibleOptions } from '@/features/admin/bible/bible-option'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CourseTemplatePreview, type CourseTemplateFormValues } from './CourseTemplatePreview'

type Props = {
  mode: 'create' | 'edit'
  templateId?: string
  initialValues?: Partial<CreateCourseTemplateInput>
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

export function CourseTemplateForm({ mode, templateId, initialValues }: Props) {
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
  const isDefault = form.watch('isDefault')
  const status = form.watch('status')

  const onSubmit = (values: CreateCourseTemplateInput) => {
    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createCourseTemplate(values)
          router.push('/admin/course-templates')
          return
        }

        if (!templateId) {
          throw new Error('MISSING_TEMPLATE_ID')
        }

        const payload: UpdateCourseTemplateInput = {
          ...values,
          id: templateId,
        }

        await updateCourseTemplate(templateId, payload)
        router.push('/admin/course-templates')
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 제목 */}
        <div className="space-y-2">
          <Label htmlFor="title">코스 템플릿 이름</Label>
          <Input id="title" placeholder="예: 1년 1독 / 100일 구약 통독" {...form.register('title')} />
          <div className="h-5 text-sm text-destructive">
            {form.formState.errors.title?.message && String(form.formState.errors.title.message)}
          </div>
        </div>
        {/* 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description">설명(선택)</Label>
          <Input id="description" placeholder="예: 하루 3~4장 수준" {...form.register('description')} />
          <div className="h-5 text-sm text-destructive">
            {form.formState.errors.description?.message && String(form.formState.errors.description.message)}
          </div>
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
          <div className="h-5 text-sm text-destructive">
            {form.formState.errors.periodDays?.message && String(form.formState.errors.periodDays.message)}{' '}
          </div>
        </div>
        <Separator />
        {/* 요일 선택 */}
        <div className="space-y-2">
          <Label>읽을 요일(기본값)</Label>
          <div className="flex flex-wrap gap-4 rounded-lg border p-4">
            {DOW.map((d) => {
              const checked = (daysOfWeek ?? []).includes(d.value)
              return (
                <div key={d.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    id={`day-${d.value}`}
                    checked={checked}
                    onCheckedChange={(value: boolean) => {
                      const next = new Set(daysOfWeek ?? [])
                      if (value) next.add(d.value)
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
                  <Label htmlFor={`day-${d.value}`}>{d.label}</Label>
                </div>
              )
            })}
          </div>
          <div className="h-5 text-sm text-destructive">
            {form.formState.errors.defaultDaysOfWeek?.message &&
              String(form.formState.errors.defaultDaysOfWeek.message)}
          </div>
        </div>
        <Separator />
        {/* 분량 설정 */}
        <div className="space-y-2">
          <Label>분량 설정</Label>

          <RadioGroup
            value={scopeType}
            onValueChange={(value: 'testament' | 'books') =>
              form.setValue('scopeType', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="testament" id="testament" />
              <Label htmlFor="testament">구약/신약 단위</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="books" id="books" />
              <Label htmlFor="books">성경 권별 설정</Label>
            </div>
          </RadioGroup>

          {scopeType === 'testament' && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm">
                <Checkbox
                  id={`testament-old`}
                  checked={!!form.watch('testament')?.old}
                  onCheckedChange={(value: boolean) => {
                    const curr = form.getValues('testament') ?? { old: false, new: false }
                    form.setValue('testament', { ...curr, old: value }, { shouldValidate: true })
                  }}
                />
                <Label htmlFor={`testament-old`}>구약</Label>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Checkbox
                  id={`testament-new`}
                  checked={!!form.watch('testament')?.new}
                  onCheckedChange={(value: boolean) => {
                    const curr = form.getValues('testament') ?? { old: false, new: false }
                    form.setValue('testament', { ...curr, new: value }, { shouldValidate: true })
                  }}
                />
                <Label htmlFor={`testament-new`}>신약</Label>
              </div>
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
          <div className="h-5 text-sm text-destructive">
            {scopeType === 'testament' &&
              form.formState.errors.testament?.message &&
              String(form.formState.errors.testament.message)}
            {scopeType === 'books' &&
              form.formState.errors.books?.message &&
              String(form.formState.errors.books.message)}
          </div>
        </div>
        <Separator />
        {/* 기본 코스  */}
        <div className="space-y-2">
          <Label>기본 코스 여부</Label>

          <RadioGroup
            value={String(isDefault)} // boolean → string
            onValueChange={(value) =>
              form.setValue('isDefault', value === 'true', {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="true" id="default-true" />
              <Label htmlFor="default-true">기본 통독 코스</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id="default-false" />
              <Label htmlFor="default-false">선택형 / 추천형 / 특수 목적 코스</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        {/* 상태 */}
        <div className="space-y-2">
          <Label>상태</Label>

          <RadioGroup
            value={status}
            onValueChange={(value: 'draft' | 'published') =>
              form.setValue('status', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="draft" id="draft" />
              <Label htmlFor="draft">임시 저장/초안</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="published" id="published" />
              <Label htmlFor="published">게시/발행</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />

        {/* 미리보기 */}
        <CourseTemplatePreview control={previewControl} />
        {/* 제출 */}
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/course-templates')}
            disabled={isPending}
          >
            취소
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isValid}>
            {isPending ? '저장 중...' : mode === 'create' ? '템플릿 생성' : '템플릿 저장'}
          </Button>
        </div>
      </form>
    </div>
  )
}
