import { listSeasons } from '@/features/admin/seasons/actions'
import Link from 'next/link'

export default async function AdminSeasonsPage() {
  const seasons = await listSeasons()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">시즌 관리</h1>
        <Link href="/admin/seasons/create" className="rounded border px-3 py-1.5 text-sm">
          시즌 생성
        </Link>
      </div>

      <div className="rounded border">
        <div className="border-b px-4 py-2 text-sm font-medium">시즌 목록</div>
        <ul className="divide-y">
          {seasons.map((s) => (
            <li key={s.id} className="px-4 py-3 text-sm">
              <Link href={`/admin/seasons/${s.id}`} className="font-medium underline underline-offset-4">
                {s.name}
              </Link>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.startDate.slice(0, 10)} ~ {s.endDate.slice(0, 10)} · {s.isActive ? '활성' : '비활성'}
              </div>
            </li>
          ))}
          {seasons.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">등록된 시즌이 없습니다.</li>}
        </ul>
      </div>
    </div>
  )
}
