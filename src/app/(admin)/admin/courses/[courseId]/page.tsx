import { notFound } from 'next/navigation'

import { getCourse } from '@/features/admin/courses/actions'
import { CourseCreateForm } from '@/features/admin/courses/components/CourseCreateForm'
import type { CreateCourseInput } from '@/features/admin/courses/schema'

type Props = {
  params: { courseId: string }
}

export default async function AdminCourseEditPage({ params }: Props) {
  const course = await getCourse(params.courseId)
  if (!course) return notFound()

  const initialValues = {
    title: course.title,
    startDate: course.startDate.slice(0, 10),
    daysOfWeek: course.daysOfWeek,
    scopeType: course.scopeType,
    testament: course.testament,
    books: course.books ?? [],
    periodType: course.periodType,
    periodDays: course.periodDays,
    status: course.status,
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">통독 코스 수정</h1>
      <CourseCreateForm mode="edit" courseId={params.courseId} initialValues={initialValues as CreateCourseInput} />
    </div>
  )
}
