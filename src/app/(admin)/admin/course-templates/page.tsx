import Link from 'next/link'

export default function AdminCourseTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">코스 템플릿 관리</h1>

        <Link href="/admin/course-templates/create" className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
          코스 템플릿 생성
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="border-b px-4 py-2 text-sm font-medium">코스 템플릿 목록</div>

        <div className="px-4 py-6 text-sm text-muted-foreground">
          아직 등록된 코스 템플릿이 없습니다.
          <br />
          {/* TODO: 다음 커밋에서 목록 연동 예정 */}
        </div>
      </div>
    </div>
  )
}
