import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getCourseTemplate } from '@/features/admin/course-templates/actions'
import { CourseTemplateForm } from '@/features/admin/course-templates/components/CourseTemplateForm'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  params: { templateId: string }
}

export default async function AdminCourseTemplateEditPage({ params }: Props) {
  const template = await getCourseTemplate(params.templateId)
  if (!template) return notFound()

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">코스 템플릿 생성</h1>

          <Button size="sm" variant="outline">
            <Link href="/admin/course-templates" className="text-sm">
              뒤로가기
            </Link>
          </Button>
        </div>
        <Card className="bg-muted/30 py-3">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">코스 템플릿이란?</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              코스 템플릿은 <strong>‘성경 읽기 계획의 설계도’</strong>입니다. 공동체나 개인이 실행할 코스를 미리
              정의해둘 수 있어요.
            </p>

            <ul className="list-disc space-y-1 pl-5">
              <li>시작 날짜는 실행할 때 결정됩니다.</li>
              <li>
                미리보기는 <strong>오늘 시작 기준</strong>으로 계산됩니다.
              </li>
              <li>한 번 만든 템플릿은 여러 시즌, 여러 그룹에서 반복 사용 가능합니다.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border p-4">
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
