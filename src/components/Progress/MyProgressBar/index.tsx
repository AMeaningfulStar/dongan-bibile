import { memo } from 'react'

import { Label } from '@/components/Text'

import AIRPLANE_ICON from '@icon/airplane_icon.svg'

export const MyProgressBar = memo(({ progressResult }: { progressResult: { progress: number; chapters: number } }) => {
  return (
    <div className="mb-16 flex w-full flex-col gap-y-3 px-4">
      <div className="flex items-center gap-x-2 pt-5">
        <Label label="나의 진행률" imageSrc={AIRPLANE_ICON} imageAlt="icon" />
        <span className="font-extralight">( {progressResult.chapters}장 / 260장 )</span>
      </div>
      <div className="flex items-center gap-x-2">
        <div className="relative h-2 flex-grow bg-[#E8EEFF]">
          <div className="absolute h-full bg-[#0276F9]" style={{ width: `${progressResult.progress}%` }}></div>
        </div>
        <div>{progressResult.progress}%</div>
      </div>
    </div>
  )
})
