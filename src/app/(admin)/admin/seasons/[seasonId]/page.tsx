import { getSeason, updateSeason } from '@/features/admin/seasons/actions'
import { notFound, redirect } from 'next/navigation'

type Props = {
  params: { seasonId: string }
}

async function updateSeasonAction(seasonId: string, formData: FormData) {
  'use server'

  await updateSeason(seasonId, {
    name: formData.get('name'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    isActive: formData.get('isActive') === 'on',
  })

  redirect('/admin/seasons')
}

export default async function AdminSeasonEditPage({ params }: Props) {
  const season = await getSeason(params.seasonId)
  if (!season) return notFound()

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-lg font-semibold">시즌 수정</h1>

      <form action={updateSeasonAction.bind(null, params.seasonId)} className="space-y-4">
        <div>
          <label className="text-sm">시즌 이름</label>
          <input name="name" defaultValue={season.name} className="mt-1 w-full rounded border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm">시작일</label>
          <input
            type="date"
            name="startDate"
            defaultValue={season.startDate.slice(0, 10)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm">종료일</label>
          <input
            type="date"
            name="endDate"
            defaultValue={season.endDate.slice(0, 10)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={season.isActive} />
          활성 시즌
        </label>

        <div className="flex gap-2">
          <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white">
            저장
          </button>
          <a href="/admin/seasons" className="rounded border px-4 py-2 text-sm">
            취소
          </a>
        </div>
      </form>
    </div>
  )
}
