import { notFound } from 'next/navigation'

import { getCourseTemplate } from '@/features/admin/course-templates/actions'
import { CourseTemplateForm } from '@/features/admin/course-templates/components/CourseTemplateForm'

type Props = {
  params: { templateId: string }
}

export default async function AdminCourseTemplateEditPage({ params }: Props) {
  const template = await getCourseTemplate(params.templateId)
  if (!template) return notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">코스 템플릿 수정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          템플릿 수정 시 계산 결과(computed)는 서버 기준으로 다시 산출됩니다.
        </p>
      </div>

      <div className="max-w-2xl">
        <CourseTemplateForm
          mode="edit"
          templateId={template.id}
          initialValues={{
            title: template.title,
            description: template.description,

            scopeType: template.scopeType,
            testament: template.testament ?? undefined,
            books: template.books ?? [],

            periodType: template.periodType,
            periodDays: template.periodDays,
            defaultDaysOfWeek: template.defaultDaysOfWeek,

            status: template.status,
            isDefault: template.isDefault,
            isArchived: template.isArchived,
          }}
        />
      </div>
    </div>
  )
}
