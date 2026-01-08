import Link from 'next/link'

type Props = {
  params: { seasonId: string }
}

export default function AdminSeasonEditPage({ params }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">시즌 수정</h1>
        <Link href="/admin/seasons" className="text-sm underline underline-offset-4">
          목록으로
        </Link>
      </div>

      <div className="rounded border p-4 text-sm">
        <p className="text-muted-foreground">(MVP) 시즌 수정 폼 예정 — 다음 커밋에서 Firestore 조회/수정 연동 예정</p>
        <p className="mt-2">
          현재 seasonId: <span className="font-mono">{params.seasonId}</span>
        </p>
      </div>
    </div>
  )
}
