import { Label } from '@/components/Text'

import useFirebaseStore from '@/stores/FirebaseStore'

import AIRPLANE_ICON from '@icon/airplane_icon.svg'

export function MyProgressBar() {
  const { firebaseInfo } = useFirebaseStore()

  // 나의 진행률 계산
  const calculateMyProgress = () => {
    const start = new Date('2024-08-11').getTime()
    const end = new Date('2024-12-21').getTime()
    const totalDuration = (end - start) / (1000 * 60 * 60 * 24) + 1

    if (firebaseInfo.bibleReadingDates?.length) {
      // start와 end 사이의 날짜만 필터링
      const validDates = firebaseInfo.bibleReadingDates.filter((date) => {
        const currentDate = new Date(date).getTime()
        return currentDate >= start && currentDate <= end
      })

      const result = (validDates.length / totalDuration) * 100

      return Math.round(result)
    }

    return 0
  }

  return (
    <div className="mb-16 flex w-full flex-col gap-y-3 px-4">
      <div className="pt-5">
        <Label label="나의 진행률" imageSrc={AIRPLANE_ICON} imageAlt="icon" />
      </div>
      <div className="flex items-center gap-x-2">
        <div className="relative h-2 flex-grow bg-[#E8EEFF]">
          <div className="absolute h-full bg-[#0276F9]" style={{ width: `${calculateMyProgress()}%` }}></div>
        </div>
        <div>{calculateMyProgress()}%</div>
      </div>
    </div>
  )
}
