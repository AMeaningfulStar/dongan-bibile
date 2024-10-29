import { Label } from '@/components/Text'

import TRAFFICLIGHT_ICON from '@icon/trafficLight_icon.svg'

export function ChallengeProgressBar({ progressResult }: { progressResult: { progress: number; chapters: number } }) {
  return (
    <div className="mb-3 flex w-full flex-col gap-y-3 px-4">
      <div className="flex items-center gap-x-2 pt-5">
        <Label label="청신호 진행률" imageSrc={TRAFFICLIGHT_ICON} imageAlt="icon" />
        <span className="font-extralight">( {progressResult.chapters}장 / 206장 )</span>
      </div>
      <div className="flex items-center gap-x-2">
        <div className="relative h-2 flex-grow bg-[#E8EEFF]">
          <div className="absolute h-full bg-[#0276F9]" style={{ width: `${progressResult.progress}%` }}></div>
        </div>
        <div>{progressResult.progress}%</div>
      </div>
    </div>
  )
}
