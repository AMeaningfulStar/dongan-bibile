'use client'
import { ko } from 'date-fns/locale'
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import moment from 'moment'
import Image from 'next/image'
import { forwardRef, KeyboardEvent, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { twMerge } from 'tailwind-merge'

import 'react-datepicker/dist/react-datepicker.css'

import { DashboardLayout } from '@/components/Layout'

import { firestore } from '@/libs/firebase'
import useBibleInfo from '@/stores/BibleInfo'
import useFirebaseStore from '@/stores/FirebaseStore'

import KEYWORD_ADD_ICON from '@icon/keyword_add_icon.svg'
import LIGHTUP_SMALL_ICON from '@icon/lightup_small_icon.svg'
import SPEECH_BUBBLE_ICON from '@icon/speech_bubble_icon.svg'

export default function Meditation() {
  const [inputValue, setInputValue] = useState<string>('')
  const [keywordList, setKeywordList] = useState<Array<{ text: string; likeCount: Array<string> }>>([])
  const { datePick, setDatePick } = useBibleInfo()
  const { firebaseInfo } = useFirebaseStore()

  const PickerCustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button className="h-full flex-grow" onClick={onClick} ref={ref}>
      {value}
    </button>
  ))

  const activeEnter = (event: KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return
    }
    if (event.key === 'Enter') {
      return createKeyword()
    }
  }

  const createKeyword = async () => {
    try {
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
            readKeywordList()
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
          readKeywordList()
        })
      }
    } catch (error) {
      console.error('Error checking for create keyword:', error)
    }
  }

  const readKeywordList = async () => {
    try {
      const keywordListRef = doc(firestore, 'meditation', datePick)
      const keywordListSnap = await getDoc(keywordListRef)

      if (keywordListSnap.exists()) {
        const response: Array<{ text: string; likeCount: Array<string> }> = keywordListSnap.data().keywords

        setKeywordList(response)
      } else {
        setKeywordList([])
      }
    } catch (error) {
      console.error('Error checking for keyword list:', error)
    }
  }

  const Keyword = ({ text, likeCountUser }: { text: string; likeCountUser: Array<string> }) => {
    const keywordColor = (likeCount: number) => {
      if (likeCount < 5) {
        return 'bg-[#E8EEFF]'
      } else if (likeCount < 10) {
        return 'bg-[#A7D1FF]'
      } else {
        return 'bg-[#64ABFB]'
      }
    }

    const incrementLikeCount = async () => {
      try {
        if (likeCountUser.includes(firebaseInfo.uid as string)) return

        const meditationDocRef = doc(firestore, 'meditation', datePick)
        const docSnapshot = await getDoc(meditationDocRef)

        if (docSnapshot.exists()) {
          const keywords = docSnapshot.data().keywords

          // 특정 키워드를 찾기
          const updatedKeywords = keywords.map((keyword: { text: string; likeCount: Array<string> }) => {
            if (keyword.text === text) {
              return {
                ...keyword,
                likeCount: [...keyword.likeCount, firebaseInfo.uid],
              }
            }

            return keyword
          })

          // Firestore 문서 업데이트
          await updateDoc(meditationDocRef, {
            keywords: updatedKeywords,
          }).then(() => readKeywordList())
        }
      } catch (error) {
        console.error('Error checking for keyword like count:', error)
      }
    }

    return (
      <div
        className={twMerge(
          'flex h-[1.875rem] items-center gap-x-px rounded-full px-3',
          keywordColor(likeCountUser.length),
        )}
        onClick={() => incrementLikeCount()}
      >
        <span># {text}</span>
        <span>({likeCountUser.length})</span>
      </div>
    )
  }

  useEffect(() => {
    readKeywordList()
  }, [datePick])

  return (
    <DashboardLayout pageName="묵상노트">
      <div className="meditation-datepicker flex h-12 w-full items-center gap-x-2.5 px-4 py-3">
        <span className="text-base leading-none">날짜</span>
        <DatePicker
          dateFormat={'MM월 dd일'}
          locale={ko}
          shouldCloseOnSelect
          customInput={<PickerCustomInput />}
          minDate={new Date('2024-07-01')}
          selected={
            moment(datePick, 'YYYY-MM-DD', true).isValid() ? moment(datePick, 'YYYY-MM-DD').toDate() : new Date()
          }
          onChange={(date) => setDatePick(moment(date).format('YYYY-MM-DD'))}
        />
      </div>
      <div className="flex w-full flex-col gap-y-1 p-4">
        <div className="flex gap-x-1">
          <Image alt="icon" src={SPEECH_BUBBLE_ICON} />
          <span className="text-lg leading-none">오늘의 묵상 키워드</span>
        </div>
        <div>나에게 와닿는 키워드를 눌러 공감을 표현해보세요!</div>
      </div>
      <div className="mb-7 flex h-36 w-full flex-wrap gap-2 overflow-y-scroll px-4">
        {keywordList.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
            <Image alt="lightup icon" src={LIGHTUP_SMALL_ICON} />
            <span className="font-light">오늘의 묵상 키워드를 추가해보세요</span>
          </div>
        ) : (
          keywordList.map((item, idx) => <Keyword key={idx} text={item.text} likeCountUser={item.likeCount} />)
        )}
      </div>
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
      <div className="flex w-full justify-center">
        <span>오늘 나에게 와닿은 키워드로 10초 동안 기도해보세요</span>
      </div>
      <div className="flex w-full justify-center py-5">
        <button className="h-9 w-40 rounded-full border border-[#0276F9] bg-[#0276F9] text-white">기도했습니다</button>
      </div>
    </DashboardLayout>
  )
}
