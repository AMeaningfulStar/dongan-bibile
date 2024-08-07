import LIGHTUP_ICON from '@icon/lightup_icon.svg'
import Image from 'next/image'

export function LoadingLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center py-24">
      <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
        <Image alt="image" src={LIGHTUP_ICON} />
        <div className="text-xl leading-none">로딩 중...</div>
      </div>
    </div>
  )
}

export function ErrorLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center py-24">
      <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
        <Image alt="image" src={LIGHTUP_ICON} />
        <div className="text-xl leading-none">정보를 불러오는 것을 실패했습니다</div>
      </div>
    </div>
  )
}
