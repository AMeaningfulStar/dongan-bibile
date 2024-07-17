import Image from 'next/image'
import Link from 'next/link'

import BIBLE_ICON from '@icon/bible_icon.svg'
import CALENDAR_ICON from '@icon/calendar_icon.svg'
import EVENT_ICON from '@icon/event_icon.svg'
import KAKAO_ICON from '@icon/kakao_icon.svg'
import LINK_ICON from '@icon/link_icon.svg'
import MEDITATION_ICON from '@icon/meditation_icon.svg'
import STATUS_ICON from '@icon/status_icon.svg'

export default function Meditation() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center py-20">
      <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-[#AAAAAA] bg-white pb-3 pt-10">
        <span className="text-xl font-light">말씀읽기</span>
      </div>
      {/* 오늘의 말씀 */}
      <div className="w-full border-l-4 border-[#0276F9] bg-[#ECF0FB] py-2.5 pl-2.5">
        <span className="text-base font-semibold leading-none">오늘의 말씀: 마태복음 1 - 2장</span>
      </div>
      {/* 세팅 및 공유 */}
      <div className="flex w-full justify-between gap-x-3 px-4 py-3">
        <div className="flex flex-grow gap-x-2.5">
          <div className="text-base">날짜</div>
          <button className="flex-grow rounded-md border border-black">00 / 00</button>
        </div>
        <div className="flex flex-grow gap-x-2.5">
          <div className="text-base">성경</div>
          <button className="flex-grow rounded-md border border-black">개역개정</button>
        </div>
        <button className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFEB3B]">
          <Image alt="icon" src={KAKAO_ICON} className="w-4" />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded-full bg-[#AAAAAA]">
          <Image alt="icon" src={LINK_ICON} />
        </button>
      </div>
      {/* 말씀 타이틀 */}
      <div className="flex w-full justify-center py-7">
        <span className="text-xl font-medium leading-none">마태복음 1장</span>
      </div>
      {/* 말씀 */}
      <div className="mb-5 flex w-full flex-col gap-y-1 px-4">
        <div className="my-1 text-base font-semibold">예수 그리스도의 계보(눅 3:23-38)</div>
        <div className="flex gap-x-2 leading-tight">
          <span>1</span>
          <span>아브라함과 다윗의 자손 예수 그리스도의 계보라</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>2</span>
          <span>아브라함이 이삭을 낳고 이삭은 야곱을 낳고 야곱은 유다와 그의 형제들을 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>3</span>
          <span>유다는 다말에게서 베레스와 세라를 낳고 베레스는 헤스론을 낳고 헤스론은 람을 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>4</span>
          <span>람은 아미나답을 낳고 아미나답은 나손을 낳고 나손은 살몬을 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>5</span>
          <span>살몬은 라합에게서 보아스를 낳고 보아스는 룻에게서 오벳을 낳고 오벳은 이새를 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>6</span>
          <span>이새는 다윗 왕을 낳으니라 다윗은 우리야의 아내에게서 솔로몬을 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>7</span>
          <span>솔로몬은 르호보암을 낳고 르호보암은 아비야를 낳고 아비야는 아사를 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>8</span>
          <span>아사는 여호사밧을 낳고 여호사밧은 요람을 낳고 요람은 웃시야를 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>9</span>
          <span>웃시야는 요담을 낳고 요담은 아하스를 낳고 아하스는 히스기야를 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>10</span>
          <span>히스기야는 므낫세를 낳고 므낫세는 아몬을 낳고 아몬은 요시야를 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>11</span>
          <span>바벨론으로 사로잡혀 갈 때에 요시야는 여고냐와 그의 형제들을 낳으니라</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>12</span>
          <span>바벨론으로 사로잡혀 간 후에 여고냐는 스알디엘을 낳고 스알디엘은 스룹바벨을 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>13</span>
          <span>스룹바벨은 아비훗을 낳고 아비훗은 엘리아김을 낳고 엘리아김은 아소르를 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>14</span>
          <span>아소르는 사독을 낳고 사독은 아킴을 낳고 아킴은 엘리웃을 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>15</span>
          <span>엘리웃은 엘르아살을 낳고 엘르아살은 맛단을 낳고 맛단은 야곱을 낳고</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>16</span>
          <span>야곱은 마리아의 남편 요셉을 낳았으니 마리아에게서 그리스도라 칭하는 예수가 나시니라</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>17</span>
          <span>
            그런즉 모든 대 수가 아브라함부터 다윗까지 열네 대요 다윗부터 바벨론으로 사로잡혀 갈 때까지 열네 대요
            바벨론으로 사로잡혀 간 후부터 그리스도까지 열네 대더라
          </span>
        </div>
        <div className="my-1 text-base font-semibold">예수 그리스도의 나심(눅 2:1-7)</div>
        <div className="flex gap-x-2 leading-tight">
          <span>18</span>
          <span>
            예수 그리스도의 나심은 이러하니라 그의 어머니 마리아가 요셉과 약혼하고 동거하기 전에 성령으로 잉태된 것이
            나타났더니
          </span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>19</span>
          <span>그의 남편 요셉은 의로운 사람이라 그를 드러내지 아니하고 가만히 끊고자 하여</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>20</span>
          <span>
            이 일을 생각할 때에 주의 사자가 현몽하여 이르되 다윗의 자손 요셉아 네 아내 마리아 데려오기를 무서워하지 말라
            그에게 잉태된 자는 성령으로 된 것이라
          </span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>21</span>
          <span>아들을 낳으리니 이름을 예수라 하라 이는 그가 자기 백성을 그들의 죄에서 구원할 자이심이라 하니라</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>22</span>
          <span>이 모든 일이 된 것은 주께서 선지자로 하신 말씀을 이루려 하심이니 이르시되</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>23</span>
          <span>
            보라 처녀가 잉태하여 아들을 낳을 것이요 그의 이름은 임마누엘이라 하리라 하셨으니 이를 번역한즉 하나님이
            우리와 함께 계시다 함이라
          </span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>24</span>
          <span>요셉이 잠에서 깨어 일어나 주의 사자의 분부대로 행하여 그의 아내를 데려왔으나</span>
        </div>
        <div className="flex gap-x-2 leading-tight">
          <span>25</span>
          <span>아들을 낳기까지 동침하지 아니하더니 낳으매 이름을 예수라 하니라</span>
        </div>
      </div>
      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 flex w-full justify-between border-t bg-white pb-9">
        <Link href={'/home'} className="px-6 py-3">
          <Image alt="button" src={CALENDAR_ICON} />
        </Link>
        <Link href={'/meditation'} className="px-6 py-3">
          <Image alt="button" src={MEDITATION_ICON} />
        </Link>
        <Link href={'/bible'} className="px-6 py-3">
          <Image alt="button" src={BIBLE_ICON} />
        </Link>
        <Link href={'/status'} className="px-6 py-3">
          <Image alt="button" src={STATUS_ICON} />
        </Link>
        <Link href={'/event'} className="px-6 py-3">
          <Image alt="button" src={EVENT_ICON} />
        </Link>
      </div>
    </div>
  )
}
