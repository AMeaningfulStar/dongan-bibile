import { getCourse, updateCourse } from '@/features/admin/courses/actions'
import { notFound, redirect } from 'next/navigation'

type Props = {
  params: { courseId: string }
}

async function updateCourseAction(courseId: string, formData: FormData) {
  'use server'

  await updateCourse(courseId, {
    name: formData.get('name'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    isActive: formData.get('isActive') === 'on',
  })

  redirect('/admin/courses')
}

export default async function AdminCourseEditPage({ params }: Props) {
  const course = await getCourse(params.courseId)
  if (!course) return notFound()

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-lg font-semibold">시즌 수정</h1>

      <form action={updateCourseAction.bind(null, params.courseId)} className="space-y-4">
        <div>
          <label className="text-sm">시즌 이름</label>
          <input name="name" defaultValue={course.name} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm">시작일</label>
          <input
            type="date"
            name="startDate"
            defaultValue={course.startDate.slice(0, 10)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">종료일</label>
          <input
            type="date"
            name="endDate"
            defaultValue={course.endDate.slice(0, 10)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={course.isActive} />
          활성 시즌
        </label>

        <div className="flex gap-2">
          <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white">
            저장
          </button>
          <a href="/admin/courses" className="rounded border px-4 py-2 text-sm">
            취소
          </a>
        </div>
      </form>
    </div>
  )
}
