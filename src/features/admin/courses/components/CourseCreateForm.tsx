'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { createCourse } from '@/features/admin/courses/actions'
import type { CreateCourseInput } from '@/features/admin/courses/schema'
import { courseCreateSchema } from '@/features/admin/courses/schema'

import { CoursePreview, type CourseFormValues } from '@/features/admin/courses/components/CoursePreview'

import { options as bibleOptions } from '@/features/admin/bible/bible-option'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const DOW = [
  { value: 0, label: '일' },
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
] as const

function toInputDateValue(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function CourseCreateForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // 권별 선택 옵션: 구약/신약 그룹 라벨이 필요하면 여기서 확장 가능
  const bookSelectOptions = useMemo(() => {
    return bibleOptions.map((b) => ({
      value: b.book,
      label: `${b.label} (${b.chapters}장)`,
      testament: b.testament,
    }))
  }, [])

  const form = useForm<CreateCourseInput>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: '',
      startDate: new Date(),
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // 일~토 기본
      scopeType: 'testament',
      testament: { old: true, new: false },
      books: [],
      periodType: 'days',
      periodDays: 100,
      status: 'draft',
    },
    mode: 'onChange',
  })

  const scopeType = form.watch('scopeType')
  const daysOfWeek = form.watch('daysOfWeek')

  const onSubmit = (values: CreateCourseInput) => {
    startTransition(async () => {
      try {
        await createCourse(values)
        router.push('/admin/courses')
      } catch (e) {
        // MVP: 콘솔만. 추후 toast 추가 권장
        console.error(e)
        alert('코스 생성에 실패했습니다.')
      }
    })
  }

  // RHF 타입 호환용 (CoursePreview는 CourseFormValues를 기대)
  const previewControl = form.control as any as import('react-hook-form').Control<CourseFormValues>

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* 코스 이름 */}
      <div className="space-y-2">
        <Label htmlFor="title">코스 이름</Label>
        <Input id="title" placeholder="예: 2026 구약 100일 통독" {...form.register('title')} />
        {form.formState.errors.title?.message && (
          <p className="text-sm text-destructive">{String(form.formState.errors.title.message)}</p>
        )}
      </div>

      <Separator />

      {/* 시작일 */}
      <div className="space-y-2">
        <Label htmlFor="startDate">시작 날짜</Label>
        <Input
          id="startDate"
          type="date"
          value={toInputDateValue(form.watch('startDate') as unknown as Date)}
          onChange={(e) => {
            const next = new Date(e.target.value)
            form.setValue('startDate', next, { shouldDirty: true, shouldValidate: true })
          }}
        />
        {form.formState.errors.startDate?.message && (
          <p className="text-sm text-destructive">{String(form.formState.errors.startDate.message)}</p>
        )}
      </div>

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
        <Label>읽을 요일</Label>
        <div className="flex flex-wrap gap-3">
          {DOW.map((d) => {
            const checked = daysOfWeek?.includes(d.value)
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
                      'daysOfWeek',
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
        {form.formState.errors.daysOfWeek?.message && (
          <p className="text-sm text-destructive">{String(form.formState.errors.daysOfWeek.message)}</p>
        )}
      </div>

      <Separator />

      {/* 분량(scope) 선택 */}
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

        {/* testament 선택 */}
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

        {/* books 선택 */}
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

      {/* 미리보기 */}
      <CoursePreview control={previewControl} />

      {/* 제출 */}
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isPending || !form.formState.isValid}>
          {isPending ? '생성 중...' : '코스 생성'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/courses')} disabled={isPending}>
          취소
        </Button>
      </div>
    </form>
  )
}
