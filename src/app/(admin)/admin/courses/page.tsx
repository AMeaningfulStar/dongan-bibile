import { listCourses } from '@/features/admin/courses/actions'
import Link from 'next/link'

export default async function AdminCoursesPage() {
  const courses = await listCourses()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">커스텀 코스 관리</h1>
        <Link href="/admin/courses/create" className="rounded border px-3 py-1.5 text-sm">
          커스텀 코스 생성
        </Link>
      </div>

      <div className="rounded border">
        <div className="border-b px-4 py-2 text-sm font-medium">커스텀 코스 목록</div>
        <ul className="divide-y">
          {courses.map((course) => (
            <li key={course.id} className="px-4 py-3 text-sm">
              <Link href={`/admin/courses/${course.id}`} className="font-medium underline underline-offset-4">
                {course.name}
              </Link>
              <div className="mt-1 text-xs text-muted-foreground">
                {course.startDate.slice(0, 10)} ~ {course.endDate.slice(0, 10)} · {course.isActive ? '활성' : '비활성'}
              </div>
            </li>
          ))}
          {courses.length === 0 && (
            <li className="px-4 py-6 text-sm text-muted-foreground">등록된 커스텀 코스이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
