import { CourseTemplateForm } from '@/features/admin/course-templates/components/CourseTemplateForm'

export default function AdminCourseTemplateCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">코스 템플릿 생성</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          템플릿은 “설계도”입니다. startDate는 실행(개인/모임)에서 결정되며, 미리보기는 “오늘 시작 기준”으로 계산됩니다.
        </p>
      </div>

      <div className="max-w-2xl">
        <CourseTemplateForm mode="create" redirectTo="detail" />
      </div>
    </div>
  )
}
