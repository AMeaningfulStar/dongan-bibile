'use client'

import Image from 'next/image'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { URLCopy } from '@/components/Button'
import { BibleSet, DatePick } from '@/components/Modal'

import { useAuthStore } from '@/stores/useAuthStore'

import { useBible, useCreateKeyword, useDeleteKeyword, useKeywords, useLikeKeyword, useMarkBibleRead } from '@/hooks'

import HEARTFILLED_ICON from '@icon/heart_filled_icon.png'
import HEARTOUTLINE_ICON from '@icon/heart_out_line_icon.png'
import RECYCLEBIN_ICON from '@icon/recycle_bin_icon.png'
import SET_ICON from '@icon/set_icon.png'

interface BiblePageProps {
  searchParams: {
    datePick: string
    churchId?: string | null
    communityId?: string | null
  }
}

export default function Bible({ searchParams }: BiblePageProps) {
  const params = searchParams
  const { datePick, churchId, communityId } = params
  const { user, setUser } = useAuthStore()

  const { bible, isError, isLoading } = useBible({
    datePick,
    churchId: user && user.church ? user.church.id : churchId ?? undefined,
    communityId: user && user.community ? user.community.id : communityId ?? undefined,
  })

  const [isDatePickModal, setIsDatePickModal] = useState<boolean>(false)
  const [isSetModal, setIsSetModal] = useState<boolean>(false)
  const [isDataSetLoading, setIsDataSetLoading] = useState<boolean>(false)

  // 날짜 선택 버튼
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
    if (!bible || bible.length === 0) {
      return <div className="flex-grow text-caption-15-m">오늘 읽을 말씀은 없습니다</div>
    }

    return (
      <span className="flex-grow text-caption-16-b">
        {bible.length === 1
          ? `${bible[0].name} ${bible[0].chapter}장`
          : `${bible[0].name} ${bible[0].chapter}장 - ${bible.at(-1)?.name} ${bible.at(-1)?.chapter}장`}
      </span>
    )
  }

  const BibleContent = () => {
    if (!bible || bible.length === 0) {
      return (
        <div className="flex flex-grow items-center justify-center">
          <span className="text-caption-15-m">오늘 하나님과 동행하는 하루를 기대해봐요</span>
        </div>
      )
    }

    return (
      <>
        {bible.map((item, idx) => (
          <div key={idx} className="flex flex-col p-4">
            <div className="mb-4 text-caption-16-b">
              {item.name} {item.chapter}장
            </div>
            {item.texts[user ? user.bible.type : 'revised_korean'].map((verse, verseIdx) => (
              <div
                key={verseIdx}
                className={twMerge(
                  'mb-1 flex w-full gap-x-2 whitespace-pre-line font-normal leading-none',
                  user ? user.bible.textSize : 'text-base',
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
    if (!bible || bible.length === 0) {
      return
    }

    const handleBibleReading = async () => {
      if (!user) {
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
        const { markRead } = useMarkBibleRead()

        const res = await markRead({
          datePick,
          uid: user.uid,
          churchId: user.church ? user.church.id : undefined,
          communityId: user.community ? user.community.id : undefined,
        })

        if (res.status !== 200) {
          alert(res.message)
          return
        }

        setUser({
          ...user,
          bible: {
            ...user.bible,
            readingDates: [...user.bible.readingDates, datePick as string],
          },
        })
        alert(res.message)
        setIsDataSetLoading(false)
      } catch (error: any) {
        alert(error.response?.data?.message || '오류 발생')
        setIsDataSetLoading(false)
      }
    }

    return (
      <button
        className={twMerge(
          'mb-10 mt-6 flex h-9 w-44 items-center justify-center rounded-full ',
          user && user.bible.readingDates.includes(datePick as string) ? 'bg-gl-green-opacity-30' : 'bg-gl-green-base',
        )}
        disabled={user?.bible.readingDates.includes(datePick as string)}
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
    if (!bible || bible.length === 0 || !user) {
      return
    }

    const { keywords, isLoading, isError, mutate } = useKeywords({
      datePick,
      uid: user.uid,
      churchId: user.church ? user.church.id : undefined,
      communityId: user.community ? user.community.id : undefined,
    })

    const [inputValue, setInputValue] = useState<string>('')
    const [isSetLoading, setIsSetLoading] = useState<boolean>(false)

    const handleCreateKeyword = async () => {
      try {
        setIsSetLoading(true)
        const createKeyword = useCreateKeyword()

        const res = await createKeyword({
          datePick,
          keyword: inputValue,
          uid: user.uid,
          churchId: user.church ? user.church.id : undefined,
          communityId: user.community ? user.community.id : undefined,
        })

        if (res.status !== 200) {
          alert(res.message)
          return
        }

        alert(res.message)
        mutate()
        setIsSetLoading(false)
      } catch (error: any) {
        alert(error.response?.data?.message || '오류 발생')
        setIsSetLoading(false)
      }
    }

    const handleKeywordDelete = async (keyword: string) => {
      const confirmed = confirm('정말 삭제하실건가요?')

      if (!confirmed || !user) return

      try {
        const deleteKeyword = useDeleteKeyword()

        const res = await deleteKeyword(keyword, {
          datePick,
          uid: user.uid,
          role: user.role,
          churchId: user.church ? user.church.id : undefined,
          communityId: user.community ? user.community.id : undefined,
        })

        if (res.status !== 200) {
          alert(res.message)
          return
        }

        alert(res.message)
        mutate()
      } catch (error: any) {
        alert(error.response?.data?.message || '오류 발생')
      }
    }

    const handleKeywordLike = async (keyword: string) => {
      try {
        const likeKeyword = useLikeKeyword()

        const ref = await likeKeyword(keyword, {
          datePick,
          uid: user.uid,
          churchId: user.church ? user.church.id : undefined,
          communityId: user.community ? user.community.id : undefined,
        })

        if (ref.status !== 200) {
          alert(ref.message)
          return
        }

        alert(ref.message)
        mutate()
      } catch (error: any) {
        alert(error.response?.data?.message || '오류 발생')
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
      <div className="mb-7 flex w-full flex-col border-t-[5px] border-gl-grayscale-base">
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
        {(keywords ?? []).map((item, idx) => (
          <div key={idx} className="flex h-14 items-center gap-x-4 border-b border-gl-grayscale-base px-7">
            <div className="flex-grow"># {item.id}</div>
            <div className="flex items-center gap-x-0.5">
              <button onClick={async () => await handleKeywordLike(item.id)}>
                {user && item.likes.includes(user.uid) ? (
                  <Image alt="icon" src={HEARTFILLED_ICON} width={25} style={{ width: 'auto', height: 'auto' }} />
                ) : (
                  <Image alt="icon" src={HEARTOUTLINE_ICON} width={25} style={{ width: 'auto', height: 'auto' }} />
                )}
              </button>
              <div className="w-6 text-center text-caption-14-l">{item.likes.length}</div>
            </div>
            {user && item.createdBy === user.uid && (
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

      {user && user.bible.readingDates.includes(datePick as string) && <BibleKeyword />}

      {/* 날짜 선택 모달 */}
      {isDatePickModal && <DatePick path="bible" setIsShow={setIsDatePickModal} />}

      {/* 성경 설정 모달 */}
      {isSetModal && <BibleSet setIsShow={setIsSetModal} />}
    </div>
  )
}
