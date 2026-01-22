import Link from 'next/link'

export default function AdminCourseTemplateCreatePage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-lg font-semibold">코스 템플릿 생성</h1>

      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        코스 템플릿 생성 폼이 이 위치에 들어옵니다.
        <br />
        {/* TODO: 다음 커밋에서 Form + 계산 미리보기 추가 */}
      </div>

      <div className="flex gap-2">
        <Link href="/admin/course-templates" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
          목록으로
        </Link>
      </div>
    </div>
  )
}
