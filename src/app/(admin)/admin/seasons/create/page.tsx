import Link from 'next/link'

export default function AdminSeasonCreatePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">시즌 생성</h1>
        <Link href="/admin/seasons" className="text-sm underline underline-offset-4">
          목록으로
        </Link>
      </div>

      <div className="rounded border p-4 text-sm text-muted-foreground">
        (MVP) 시즌 생성 폼 예정 — 다음 커밋에서 Server Action + Zod 적용 예정
      </div>
    </div>
  )
}
