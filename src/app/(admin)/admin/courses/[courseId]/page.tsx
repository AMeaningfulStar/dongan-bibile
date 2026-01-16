// src/app/(admin)/admin/courses/[courseId]/page.tsx
import { getCourse, updateCourse } from '@/features/admin/courses/actions'
import { notFound, redirect } from 'next/navigation'

type Props = {
  params: { courseId: string }
}

function toDateFromYMD(ymd: FormDataEntryValue | null) {
  if (!ymd || typeof ymd !== 'string') return undefined
  // "YYYY-MM-DD" -> Date
  const d = new Date(`${ymd}T00:00:00`)
  return isNaN(d.getTime()) ? undefined : d
}

function toNumber(value: FormDataEntryValue | null) {
  if (value === null) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

async function updateCourseAction(courseId: string, formData: FormData) {
  'use server'

  const title = formData.get('title')
  const startDate = toDateFromYMD(formData.get('startDate'))
  const periodDays = toNumber(formData.get('periodDays'))
  const status = formData.get('status')

  await updateCourse(courseId, {
    id: courseId, // ✅ schema에서 필수
    title: typeof title === 'string' ? title : undefined,
    startDate,
    periodDays,
    status: status === 'active' ? 'active' : status === 'draft' ? 'draft' : undefined,
  })

  redirect(`/admin/courses/${courseId}`)
}

export default async function AdminCourseEditPage({ params }: Props) {
  const course = await getCourse(params.courseId)
  if (!course) return notFound()

  return (
    <div className="max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">코스 수정</h1>
        <p className="text-sm text-muted-foreground">
          MVP 테스트용: 제목/시작일/기간/상태를 수정하면 서버에서 computed(완료일/하루분량)가 재계산됩니다.
        </p>
      </div>

      <form action={updateCourseAction.bind(null, params.courseId)} className="space-y-4 rounded border p-4">
        <div>
          <label className="text-sm font-medium">코스 제목</label>
          <input name="title" defaultValue={course.title} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">시작일</label>
            <input
              type="date"
              name="startDate"
              defaultValue={course.startDate.slice(0, 10)}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">기간(일)</label>
            <input
              type="number"
              min={1}
              name="periodDays"
              defaultValue={course.periodDays}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">상태</label>
          <select name="status" defaultValue={course.status} className="mt-1 w-full rounded border px-3 py-2 text-sm">
            <option value="draft">draft(초안)</option>
            <option value="active">active(활성)</option>
          </select>
        </div>

        <div className="rounded bg-muted/50 p-3 text-sm">
          <div className="font-medium">현재 계산 결과(computed)</div>
          <div className="mt-1 text-muted-foreground">
            완료일: {course.endDate.slice(0, 10)}
            <br />총 장수: {course.totalChapters}장
            <br />
            하루 분량: {course.chaptersPerReadingDay}장
          </div>
          {course.summaryText && <div className="mt-2 text-muted-foreground">{course.summaryText}</div>}
        </div>

        <div className="flex gap-2">
          <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white">
            저장
          </button>
          <a href="/admin/courses" className="rounded border px-4 py-2 text-sm">
            목록
          </a>
        </div>
      </form>
    </div>
  )
}
