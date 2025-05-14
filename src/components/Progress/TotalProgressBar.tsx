'use client'
export function TotalProgressBar({
  totalPlannedDays,
  readDatesInYear,
  yearProgress,
}: {
  totalPlannedDays: number
  readDatesInYear: number
  yearProgress: number
}) {
  return (
    <div className="mb-5 flex w-full flex-col gap-y-2.5 px-4">
      <div className="ml-1 flex items-center gap-x-2">
        <div className="flex items-center gap-x-1">
          <span className="text-caption-16-l">청신호 진행률</span>
        </div>
        <span className="text-caption-13-l text-gl-grayscale-100">
          {totalPlannedDays} 일 중 {readDatesInYear}일 통독 완료
        </span>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="relative h-2.5 flex-grow rounded-full bg-gl-green-opacity-30">
          <div
            className="absolute h-full rounded-full bg-gl-green-opacity-50"
            style={{ width: yearProgress * 100 + '%' }}
          ></div>
        </div>
        <div className="flex w-10 items-center justify-center">{(yearProgress * 100).toFixed(1) + '%'}</div>
      </div>
    </div>
  )
}
