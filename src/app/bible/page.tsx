'use client'

import Image from 'next/image'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { getKeyWords, useBibleData } from '@/libs/swr/'

import { URLCopy } from '@/components/Button'
import { BibleSet, DatePick } from '@/components/Modal'

import { userInfoStore } from '@/stores'

import { firestore } from '@/libs/firebase'
import HEARTFILLED_ICON from '@icon/heart_filled_icon.png'
import HEARTOUTLINE_ICON from '@icon/heart_out_line_icon.png'
import RECYCLEBIN_ICON from '@icon/recycle_bin_icon.png'
import SET_ICON from '@icon/set_icon.png'
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

interface BiblePageProps {
  searchParams: {
    datePick?: string
  }
}

export default function Bible({ searchParams }: BiblePageProps) {
  const datePick = searchParams.datePick
  const { userInfo, setBibleReadingDates } = userInfoStore()
  const { bibleData, isLoading, isError } = useBibleData(
    datePick as string,
    userInfo ? userInfo.bibleType : 'easy_korean',
  )

  const [isDatePickModal, setIsDatePickModal] = useState<boolean>(false)
  const [isSetModal, setIsSetModal] = useState<boolean>(false)
  const [isDataSetLoading, setIsDataSetLoading] = useState<boolean>(false)

  const PickerButton = () => {
    const formatDate = (date: string | null) => {
      if (!date) return '00월 00일'

      const match = date.match(/^\d{4}-(\d{2})-(\d{2})$/)
      return match ? `${match[1]}월 ${match[2]}일` : '00월 00일'
    }

    return (
      <button
        onClick={() => setIsDatePickModal(true)}
        className="rounded-[10px] border border-gl-black-base px-4 py-1 text-caption-16-sb"
      >
        {formatDate(datePick as string)}
      </button>
    )
  }

  const BibleReadingRange = () => {
    if (!bibleData || !bibleData.data || bibleData.data.length === 0) {
      return <div className="flex-grow text-caption-15-m">오늘 읽을 말씀은 없습니다</div>
    }

    const { data } = bibleData

    return (
      <span className="flex-grow text-caption-16-b">
        {data.length === 1
          ? `${data[0].title} ${data[0].chapter}장`
          : `${data[0].title} ${data[0].chapter}장 - ${data.at(-1)?.title} ${data.at(-1)?.chapter}장`}
      </span>
    )
  }

  const BibleContent = () => {
    if (!bibleData || !bibleData.data || bibleData.data.length === 0) {
      return (
        <div className="flex flex-grow items-center justify-center">
          <span className="text-caption-15-m">오늘 하나님과 동행하는 하루를 기대해봐요</span>
        </div>
      )
    }

    return (
      <>
        {bibleData.data.map((item, idx) => (
          <div key={idx} className="flex flex-col p-4">
            <div className="mb-4 text-caption-16-b">
              {item.title} {item.chapter}장
            </div>
            {item.verses.map((verse, verseIdx) => (
              <div
                key={verseIdx}
                className={twMerge(
                  'mb-1 flex w-full gap-x-2 whitespace-pre-line font-normal leading-none',
                  userInfo ? userInfo.bibleTextSize : 'text-base',
                )}
              >
                <span>{verse.verse}</span>
                <span>{verse.text}</span>
              </div>
            ))}
          </div>
        ))}
      </>
    )
  }

  const BibleReadingButton = () => {
    if (!bibleData || !bibleData.data || bibleData.data.length === 0) {
      return
    }

    const handleBibleReading = async () => {
      if (!userInfo) {
        alert('로그인 후 가능합니다')
        return
      }

      // 오늘 날짜와 비교
      const today = new Date()
      today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정하여 비교 단위를 날짜로 맞춤
      const selectedDate = new Date(datePick as string)
      selectedDate.setHours(0, 0, 0, 0) // 선택된 날짜의 시간도 초기화하여 비교 단위를 날짜로 맞춤

      if (selectedDate.getTime() > today.getTime()) {
        alert('해당 날짜에 다시 시도해주세요')
        return
      }

      try {
        setIsDataSetLoading(true)
        const userDocRef = doc(firestore, 'users', userInfo.uid) // Firestore 문서 참조

        await updateDoc(userDocRef, {
          bibleReadingDates: arrayUnion(datePick), // 날짜를 배열에 추가
        })

        // Zustand 상태 업데이트
        setBibleReadingDates(datePick as string)
        setIsDataSetLoading(false)
      } catch (error) {
        console.error('말씀 읽기 기록을 업데이트하는 중 오류 발생:', error)
      }
    }

    return (
      <button
        className={twMerge(
          'mb-10 mt-6 flex h-9 w-44 items-center justify-center rounded-full ',
          userInfo?.bibleReadingDates.includes(datePick as string) ? 'bg-gl-green-opacity-30' : 'bg-gl-green-base',
        )}
        disabled={userInfo?.bibleReadingDates.includes(datePick as string)}
        onClick={handleBibleReading}
      >
        {isDataSetLoading ? (
          <svg fill="none" className="h-7 w-7 animate-spin" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        ) : (
          <span className="text-caption-14-b text-gl-white-base">말씀을 읽었습니다</span>
        )}
      </button>
    )
  }

  const BibleKeyword = () => {
    if (!bibleData || !bibleData.data || bibleData.data.length === 0) {
      return
    }

    const { keywords, isLoading, isError, mutate } = getKeyWords(datePick as string)
    const [inputValue, setInputValue] = useState<string>('')
    const [isSetLoading, setIsSetLoading] = useState<boolean>(false)

    const handleCreateKeyword = async () => {
      if (inputValue.length === 0) return

      try {
        setIsSetLoading(true)
        const keywordDocRef = doc(firestore, 'keywords', datePick as string, 'keywords', inputValue)

        const keywordDoc = await getDoc(keywordDocRef)

        if (keywordDoc.exists()) {
          alert('이미 존재하는 키워드입니다')
        } else {
          await setDoc(keywordDocRef, {
            createdBy: userInfo?.uid,
            likes: [userInfo?.uid], // 첫 번째 좋아요 누른 사용자 UID
          })

          mutate()
          alert('키워드를 등록했습니다')
          setInputValue('')
        }
        setIsSetLoading(false)
      } catch (error) {
        alert('키워드 등록에 실패했습니다')
        console.error('Failed to register keyword:', error)
      }
    }

    const handleKeywordDelete = async (keyword: string) => {
      const confirmed = confirm('정말 삭제하실건가요?')

      if (!confirmed) return

      try {
        const keywordDocRef = doc(firestore, 'keywords', datePick as string, 'keywords', keyword)

        await deleteDoc(keywordDocRef)

        alert('키워드를 삭제했습니다')
        mutate()
      } catch (error) {
        alert('키워드 삭제에 실패했습니다')
        console.error('Failed to delete keyword:', error)
      }
    }

    const handleKeywordLike = async (createdBy: string, keyword: string) => {
      if (userInfo?.uid === createdBy) {
        await handleKeywordDelete(keyword)
        return
      }

      try {
        const keywordDocRef = doc(firestore, 'keywords', datePick as string, 'keywords', keyword)
        const keywordDoc = await getDoc(keywordDocRef)

        if (keywordDoc.exists()) {
          if ((keywordDoc.data().likes as Array<string>).includes(userInfo?.uid as string)) {
            await updateDoc(keywordDocRef, {
              likes: arrayRemove(userInfo?.uid as string), // 날짜를 배열에 추가
            })

            mutate()
          } else {
            await updateDoc(keywordDocRef, {
              likes: arrayUnion(userInfo?.uid as string), // 날짜를 배열에 추가
            })

            mutate()
          }
        }
      } catch (error) {
        alert('공감에 실패했습니다')
        console.error('Failed to like leyword:', error)
      }
    }

    if (isLoading) {
      return (
        <div className="flex w-full flex-col border-t-[5px] border-gl-grayscale-base text-caption-14-l">
          정보를 불러오는 중...
        </div>
      )
    }

    if (isError) {
      return (
        <div className="flex w-full flex-col border-t-[5px] border-gl-grayscale-base text-caption-14-l">
          정보를 불러오지 못했어요
        </div>
      )
    }

    return (
      <div className="flex w-full flex-col border-t-[5px] border-gl-grayscale-base mb-14">
        <div className="flex items-center gap-x-1 border-b border-gl-grayscale-base px-6 py-3">
          <input
            type="text"
            placeholder="묵상 키워드를 입력하세요 (10자 이내)"
            className="flex-grow rounded-[10px] bg-gl-grayscale-base px-3 py-2 text-caption-15-l outline-none"
            onChange={(event) => setInputValue(event.target.value)}
            maxLength={10}
          />
          <button
            className="rounded-full bg-gl-green-opacity-30 px-4 py-2 text-caption-14-m text-gl-green-base"
            onClick={handleCreateKeyword}
            disabled={isSetLoading}
          >
            입력
          </button>
        </div>
        {(keywords?.data || []).map((item, idx) => (
          <div key={idx} className="flex h-14 items-center gap-x-4 border-b border-gl-grayscale-base px-7">
            <div className="flex-grow"># {item.id}</div>
            <div className="flex items-center gap-x-0.5">
              <button onClick={async () => await handleKeywordLike(item.createdBy, item.id)}>
                {userInfo && item.likes.includes(userInfo.uid) ? (
                  <Image alt="icon" src={HEARTFILLED_ICON} width={25} style={{ width: 'auto', height: 'auto' }} />
                ) : (
                  <Image alt="icon" src={HEARTOUTLINE_ICON} width={25} style={{ width: 'auto', height: 'auto' }} />
                )}
              </button>
              <div className="w-6 text-center text-caption-14-l">{item.likes.length}</div>
            </div>
            {userInfo && item.createdBy === userInfo.uid && (
              <button onClick={async () => await handleKeywordDelete(item.id)}>
                <Image alt="icon" src={RECYCLEBIN_ICON} width={22} style={{ width: 'auto', height: 'auto' }} />
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <svg fill="none" className="h-7 w-7 animate-spin" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path
            clipRule="evenodd"
            d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
        <p className="text-caption-18-sb">성경 말씀 불러오는 중...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-loading-18-l">성경 말씀 불러오지 못했어요...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col items-center">
      <button className="fixed right-4 top-4 z-10" onClick={() => setIsSetModal(true)}>
        <Image alt="icon" src={SET_ICON} width={28} style={{ width: 'auto', height: 'auto' }} />
      </button>
      {/* 오늘의 말씀 */}
      <div className="flex w-full items-center justify-between gap-x-2.5 border-l-4 border-gl-green-base bg-gl-green-opacity-30 py-2.5 pl-4 pr-5">
        <PickerButton />
        <BibleReadingRange />
        <URLCopy />
      </div>
      {/* 성경 말씀 */}
      <BibleContent />
      <BibleReadingButton />

      {userInfo && userInfo.bibleReadingDates.includes(datePick as string) && <BibleKeyword />}

      {/* 날짜 선택 모달 */}
      {isDatePickModal && <DatePick path="bible" setIsShow={setIsDatePickModal} />}

      {/* 성경 설정 모달 */}
      {isSetModal && <BibleSet setIsShow={setIsSetModal} />}
    </div>
  )
}
