'use client'

import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import { KeyboardEvent, useState } from 'react'

import useBibleInfo from '@/stores/BibleInfo'
import useFirebaseStore from '@/stores/FirebaseStore'

import { firestore } from '@/libs/firebase'

import { useKeywordList } from '@/libs/swr/keywordList'
import KEYWORD_ADD_ICON from '@icon/keyword_add_icon.svg'

export function KeywordField() {
  const [inputValue, setInputValue] = useState<string>('')
  const { datePick } = useBibleInfo()
  const { firebaseInfo } = useFirebaseStore()
  const { mutate } = useKeywordList(datePick)

  const createKeyword = async () => {
    try {
      // 현재 날짜와 datePick 비교
      const today = new Date().setHours(0, 0, 0, 0) // 오늘 날짜를 기준으로 시간 초기화
      const selectedDate = new Date(datePick).setHours(0, 0, 0, 0) // 선택한 날짜의 시간 초기화

      if (selectedDate > today) {
        alert('미리 키워드를 등록할 수 없습니다')
        return
      }

      // 최소 글자 수 점검
      if (inputValue.trim().length <= 0) {
        alert('최소 1글자 이상 키워드를 입력바랍니다')
        return
      }

      const meditationDocRef = doc(firestore, 'meditation', datePick)
      const docSnapshot = await getDoc(meditationDocRef)

      if (docSnapshot.exists()) {
        const keywords = docSnapshot.data().keywords

        // 특정 키워드가 존재하는지 확인
        const keywordIndex = keywords.findIndex(
          (keyword: { text: string; likeCount: Array<string> }) => keyword.text === inputValue,
        )

        if (keywordIndex === -1) {
          await updateDoc(meditationDocRef, {
            keywords: arrayUnion({
              text: inputValue,
              likeCount: [firebaseInfo.uid],
            }),
          }).then(() => {
            setInputValue('')
            mutate()
          })
        } else {
          alert('이미 등록된 키워드입니다.')
        }
      } else {
        await setDoc(meditationDocRef, {
          keywords: [
            {
              text: inputValue,
              likeCount: [firebaseInfo.uid],
            },
          ],
        }).then(() => {
          setInputValue('')
          mutate()
        })
      }
    } catch (error) {
      console.error('Error checking for create keyword:', error)
    }
  }

  const activeEnter = (event: KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return
    }
    if (event.key === 'Enter') {
      return createKeyword()
    }
  }

  return (
    <div className="mb-5 flex w-full items-end gap-x-2 px-4 py-5">
      <div className="h-[1.875rem] w-full border-b border-[#222]">
        <input
          type="text"
          maxLength={10}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => activeEnter(event)}
          className="h-full w-full p-2 outline-none"
          placeholder="나만의 키워드를 추가해보세요"
        />
      </div>
      <button className="" onClick={() => createKeyword()}>
        <Image alt="add button" src={KEYWORD_ADD_ICON} />
      </button>
    </div>
  )
}
