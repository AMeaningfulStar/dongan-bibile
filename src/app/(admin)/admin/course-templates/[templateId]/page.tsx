import Link from 'next/link'

type Props = {
  params: {
    templateId: string
  }
}

export default function AdminCourseTemplateEditPage({ params }: Props) {
  const { templateId } = params

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-lg font-semibold">코스 템플릿 수정</h1>

      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        코스 템플릿 ID:
        <br />
        <span className="font-mono text-xs">{templateId}</span>
        <br />
        <br />
        수정 폼이 이 위치에 들어옵니다.
        <br />
        {/* TODO: 다음 커밋에서 데이터 로드 + 수정 폼 연결 */}
      </div>

      <div className="flex gap-2">
        <Link href="/admin/course-templates" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
          목록으로
        </Link>
      </div>
    </div>
  )
}
