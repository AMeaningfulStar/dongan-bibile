import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { twMerge } from 'tailwind-merge'

import { firestore } from '@/libs/firebase'

import { useKeywordList } from '@/libs/swr/keywordList'
import useBibleInfo from '@/stores/BibleInfo'
import useFirebaseStore from '@/stores/FirebaseStore'

interface KeywordItemRequest {
  keyword: string
  likeCount: number
}

export function KeywordItem({ keyword, likeCount }: KeywordItemRequest) {
  const { firebaseInfo } = useFirebaseStore()
  const { datePick } = useBibleInfo()
  const { mutate } = useKeywordList(datePick)

  const keywordColor = () => {
    const colors = {
      low: 'bg-[#E8EEFF]',
      mid: 'bg-[#A7D1FF]',
      high: 'bg-[#64ABFB]',
    }

    return likeCount < 5 ? colors.low : likeCount < 10 ? colors.mid : colors.high
  }

  const incrementLikeCount = async () => {
    try {
      const meditationDocRef = doc(firestore, 'meditation', datePick)
      const docSnapshot = await getDoc(meditationDocRef)

      if (docSnapshot.exists()) {
        const keywords = docSnapshot.data().keywords

        // 특정 키워드를 찾기
        const updatedKeywords = keywords.map((keywordInfo: { text: string; likeCount: Array<string> }) => {
          // 현재 키워드와 검색 키워드가 일치하는지 확인
          if (keywordInfo.text === keyword) {
            // 사용자의 uid가 likeCount 배열에 존재하는지 확인
            if (!keywordInfo.likeCount.includes(firebaseInfo.uid as string)) {
              // uid가 없다면, likeCount 배열에 추가하여 새로운 객체 반환
              return {
                ...keywordInfo, // 기존의 keywordInfo 객체 속성 유지
                likeCount: [...keywordInfo.likeCount, firebaseInfo.uid], // 기존 likeCount에 uid 추가
              }
            }
          }

          // 키워드가 일치하지 않거나, uid가 이미 있는 경우 기존 객체 반환
          return keywordInfo
        })

        // Firestore 문서 업데이트
        await updateDoc(meditationDocRef, {
          keywords: updatedKeywords,
        }).then(() => mutate())
      }
    } catch (error) {
      console.error('Error checking for keyword like count:', error)
    }
  }

  return (
    <div
      className={twMerge('flex h-[1.875rem] items-center gap-x-px rounded-full px-3', keywordColor())}
      onClick={async () => await incrementLikeCount()}
    >
      <span># {keyword}</span>
      <span>({likeCount})</span>
    </div>
  )
}
