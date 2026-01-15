import { CourseCreateForm } from "@/features/admin/courses/components/CourseCreateForm"

export default function AdminCourseCreatePage() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">코스 만들기</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          분량/요일/기간을 입력하면 아래에 완독 계산 미리보기가 표시됩니다.
        </p>
      </div>

      <CourseCreateForm />
    </div>
  )
}