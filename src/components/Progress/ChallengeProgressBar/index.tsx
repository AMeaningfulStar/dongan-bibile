import { Label } from '@/components/Text'

import TRAFFICLIGHT_ICON from '@icon/trafficLight_icon.svg'

export function ChallengeProgressBar({ calculateProgress }: { calculateProgress: number }) {
  return (
    <div className="mb-3 flex w-full flex-col gap-y-3 px-4">
      <div className="pt-5">
        <Label label="청신호 진행률" imageSrc={TRAFFICLIGHT_ICON} imageAlt="icon" />
      </div>
      <div className="flex items-center gap-x-2">
        <div className="relative h-2 flex-grow bg-[#E8EEFF]">
          <div className="absolute h-full bg-[#0276F9]" style={{ width: `${calculateProgress}%` }}></div>
        </div>
        <div>{calculateProgress}%</div>
      </div>
    </div>
  )
}
