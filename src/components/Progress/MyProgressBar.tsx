'use client'

export function MyProgressBar({
  seasonName,
  seasonProgress,
  totalSeasonDays,
  readDatesInSeason,
}: {
  seasonName: string
  seasonProgress: number
  totalSeasonDays: number
  readDatesInSeason: string[]
}) {
  return (
    <div className="mb-10 flex w-full flex-col gap-y-2.5 px-4">
      <div className="ml-1 flex items-center gap-x-2">
        <div className="flex items-center gap-x-1">
          <span className="text-caption-16-l">나의 진행률</span>
        </div>
        <span className="text-caption-13-l text-gl-grayscale-100">
          {totalSeasonDays}일 중 {readDatesInSeason.length}일 통독 완료
        </span>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="relative h-2.5 flex-grow rounded-full bg-gl-green-opacity-30">
          <div
            className="absolute h-full rounded-full bg-gl-green-opacity-50"
            style={{ width: seasonProgress * 100 + '%' }}
          ></div>
        </div>
        <div className="flex w-10 items-center justify-center">{(seasonProgress * 100).toFixed(1) + '%'}</div>
      </div>
    </div>
  )
}
