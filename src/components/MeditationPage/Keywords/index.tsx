import Image from 'next/image'

import { KeywordItem } from './KeywordItem'

import { useKeywordList } from '@/libs/swr/keywordList'

import useBibleInfo from '@/stores/BibleInfo'

import LIGHTUP_SMALL_ICON from '@icon/lightup_small_icon.svg'

export function Keywords() {
  const { datePick } = useBibleInfo()
  const { keywordList, isError, isLoading } = useKeywordList(datePick)

  const hasKeywords = keywordList && keywordList.data && keywordList.data.length > 0

  return (
    <div className="mb-7 flex max-h-36 w-full flex-wrap gap-2 overflow-y-scroll px-4">
      {isLoading || isError ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
          <Image alt="lightup icon" src={LIGHTUP_SMALL_ICON} />
          <span className="font-light">오늘의 묵상 키워드를 추가해보세요</span>
        </div>
      ) : !hasKeywords ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
          <Image alt="lightup icon" src={LIGHTUP_SMALL_ICON} />
          <span className="font-light">오늘의 묵상 키워드를 추가해보세요</span>
        </div>
      ) : (
        keywordList.data.map((item, idx) => <KeywordItem key={idx} keyword={item.text} likeCount={item.likeCount} />)
      )}
    </div>
  )
}
