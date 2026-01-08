import Link from 'next/link'

export default function AdminSeasonsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">시즌 관리</h1>
        <Link href="/admin/seasons/create" className="text-sm underline underline-offset-4">
          시즌 생성
        </Link>
      </div>

      <div className="rounded border p-4 text-sm text-muted-foreground">
        (MVP) 시즌 목록 UI 예정 — 다음 커밋에서 Firestore 연동 예정
      </div>
    </div>
  )
}
