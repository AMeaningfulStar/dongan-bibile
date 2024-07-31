import { LoadingScreen } from '@/components/Layout'

export default function Meditation() {
  return (
    <LoadingScreen pageName="묵상노트"></LoadingScreen>
    // <div className="flex min-h-screen w-full flex-col items-center py-20">
    //   <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white pb-3 pt-10">
    //     <span className="text-xl font-light">묵상노트</span>
    //   </div>
    //   {/* 날짜 세팅 */}
    //   <div className="flex w-full justify-between gap-x-3 px-4 py-3">
    //     <div className="flex flex-grow gap-x-3">
    //       <div className="text-base">날짜</div>
    //       <button className="flex-grow rounded-md border border-black">00 / 00</button>
    //     </div>
    //   </div>
    //   {/* 나의 묵상 */}
    //   <div className="flex w-full flex-col px-4">
    //     <div className="w-full py-5 text-lg font-light leading-none">나의 묵상</div>
    //     <div className="mb-2.5 flex w-full flex-col gap-y-4 rounded-lg bg-[#E8EEFF] p-5">
    //       <label htmlFor="keyword" className="flex gap-x-1">
    //         <span>1.</span>
    //         <span>오늘 성경 말씀 중 내 마음 속에 남는 키워드는 무엇인가요? 한 단어로 표현해보세요.</span>
    //       </label>
    //       <input
    //         id="keyword"
    //         className="border-b border-[#AAAAAA] bg-transparent p-px font-light outline-none"
    //         placeholder="ex. 하나님의 사랑, 구원, 복음 등.."
    //       />
    //     </div>
    //     <div className="flex w-full flex-col gap-y-4 rounded-lg bg-[#E8EEFF] p-5">
    //       <label htmlFor="promise" className="flex gap-x-1">
    //         <span>2.</span>
    //         <span>'오늘의 키워드'를 활용하여 오늘 하루의 다짐을 적어보세요.</span>
    //       </label>
    //       <input
    //         id="promise"
    //         className="border-b border-[#AAAAAA] bg-transparent p-px font-light outline-none"
    //         placeholder="ex. 도움이 필요한 친구를 도와주자"
    //       />
    //     </div>
    //   </div>
    //   {/* 묵상 완료 버튼 */}
    //   <div className="py-7">
    //     <button className="h-8 w-32 rounded-lg border border-black bg-white">
    //       <span className="text-sm font-normal leading-none">묵상 완료</span>
    //     </button>
    //   </div>
    //   {/* 오늘의 묵상 키워드 */}
    //   <div className="flex w-full flex-col gap-y-5 px-4 mb-4">
    //     <div className="w-full text-lg font-light leading-none">오늘의 묵상 키워드</div>
    //     <div className="flex flex-wrap gap-2">
    //       <div className="rounded-full bg-[#E8EEFF] px-3 py-2">#친구</div>
    //       <div className="rounded-full bg-[#A7D2FF] px-3 py-2">#견손</div>
    //       <div className="rounded-full bg-[#64ABFB] px-3 py-2">#섬김</div>
    //       <div className="rounded-full bg-[#0276F9] px-3 py-2">#김대현전도사님</div>
    //       <div className="rounded-full bg-[#A7D2FF] px-3 py-2">#공부열심히하기</div>
    //       <div className="rounded-full bg-[#E8EEFF] px-3 py-2">#희생하는사람</div>
    //       <div className="rounded-full bg-[#0276F9] px-3 py-2">#디미징찬양팀</div>
    //     </div>
    //   </div>
    //   {/* 하단 네비게이션 바 */}
    //   <div className="fixed bottom-0 left-0 flex w-full justify-between border-t bg-white pb-9">
    //     <Link href={'/home'} className="px-6 py-3">
    //       <Image alt="button" src={CALENDAR_ICON} />
    //     </Link>
    //     <Link href={'/meditation'} className="px-6 py-3">
    //       <Image alt="button" src={MEDITATION_ICON} />
    //     </Link>
    //     <Link href={'/bible'} className="px-6 py-3">
    //       <Image alt="button" src={BIBLE_ICON} />
    //     </Link>
    //     <Link href={'/status'} className="px-6 py-3">
    //       <Image alt="button" src={STATUS_ICON} />
    //     </Link>
    //     <Link href={'/event'} className="px-6 py-3">
    //       <Image alt="button" src={EVENT_ICON} />
    //     </Link>
    //   </div>
    // </div>
  )
}
