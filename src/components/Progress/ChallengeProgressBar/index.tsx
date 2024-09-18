import { Label } from '@/components/Text'

import TRAFFICLIGHT_ICON from '@icon/trafficLight_icon.svg'

export function ChallengeProgressBar() {
  // 청신호 진행률 계산
  const calculateChallengeProgress = () => {
    const start = new Date('2024-08-11').getTime()
    const end = new Date('2024-12-21').getTime()
    const today = new Date().getTime()

    const totalDuration = (end - start) / (1000 * 60 * 60 * 24) // 전체 기간 (일 단위)
    const elapsedDuration = (today - start) / (1000 * 60 * 60 * 24) + 1 // 경과한 기간 (일 단위)

    if (today < start) {
      return 0
    }

    const progress = (elapsedDuration / totalDuration) * 100

    return Math.round(progress)
  }

  return (
    <div className="mb-3 flex w-full flex-col gap-y-3 px-4">
      <div className="pt-5">
        <Label label="청신호 진행률" imageSrc={TRAFFICLIGHT_ICON} imageAlt="icon" />
      </div>
      <div className="flex items-center gap-x-2">
        <div className="relative h-2 flex-grow bg-[#E8EEFF]">
          <div className="absolute h-full bg-[#0276F9]" style={{ width: `${calculateChallengeProgress()}%` }}></div>
        </div>
        <div>{calculateChallengeProgress()}%</div>
      </div>
    </div>
  )
}
