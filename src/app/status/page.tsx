'use client'

import moment from 'moment'
import Link from 'next/link'
import { useState } from 'react'

import { DatePick } from '@/components/Modal'
import { useReadingStatus } from '@/hooks/useReadingStatus'
import { useAuthStore } from '@/stores/useAuthStore'
import { twMerge } from 'tailwind-merge'

interface StatusPageProps {
  searchParams: {
    datePick?: string
    churchId?: string | null
    communityId?: string | null
  }
}

export default function Status({ searchParams }: StatusPageProps) {
  const datePick = searchParams.datePick || moment().format('YYYY-MM-DD')
  const { churchId, communityId } = searchParams
  const { user } = useAuthStore()

  const { status, count, isLoading } = useReadingStatus({
    datePick,
    churchId: user?.church?.id ?? churchId ?? undefined,
    communityId: user?.community?.id ?? communityId ?? undefined,
  })

  const [isModal, setIsModal] = useState<boolean>(false)

  const PickerButton = () => {
    const formatDate = (date: string | null) => {
      if (!date) return '00월 00일'
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      return match ? `${match[2]}월 ${match[3]}일` : '00월 00일'
    }

    return (
      <button
        onClick={() => setIsModal(true)}
        className="rounded-[10px] border border-gl-black-base px-4 py-1.5 text-caption-16-sb"
      >
        {formatDate(datePick)}
      </button>
    )
  }

  if (!user) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center px-4">
        <div className="mb-2 text-caption-15-l">로그인 후 확인 가능합니다</div>
        <div className="mb-10 text-caption-15-l">로그인 페이지로 이동하시겠습니까?</div>
        <Link
          href={'/login'}
          className="flex h-8 w-full max-w-60 items-center justify-center rounded-lg bg-gl-green-opacity-30 active:bg-gl-green-opacity-50"
        >
          <span className="text-sm font-normal leading-none">로그인</span>
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col border-t-[5px] border-gl-grayscale-base text-caption-14-l">
        정보를 불러오는 중...
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-4">
      <div className="mb-4 flex items-center gap-x-2.5 px-5">
        <PickerButton />
        <div className="text-caption-16-l">
          오늘 청신호가 <span className="text-caption-18-sb text-gl-green-base">{count}개</span> 켜졌어요
        </div>
      </div>
      {user.church && user.community ? (
        Array.isArray(status) && status.length > 0 ? (
          status.map((group, idx) => (
            <div key={idx} className="mb-6 flex w-full flex-col gap-y-4">
              <div className="flex justify-between bg-gl-green-opacity-30 px-5 py-2.5 text-caption-15-m">
                <span>
                  {group.gradeNum === null && group.classNum === null
                    ? '청지기'
                    : `${group.gradeNum}-${group.classNum}`}
                </span>
                <span>
                  ({group.read}/{group.total})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-x-1.5 gap-y-2.5 px-[18px] text-caption-14-l">
                {group.users.map((u, i) => (
                  <div
                    key={u.uid}
                    className={twMerge(
                      'flex items-center justify-center rounded-lg px-5 py-2',
                      u.read ? 'bg-gl-green-opacity-50' : 'bg-gl-grayscale-base',
                    )}
                  >
                    {u.name}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center px-4">
            <div className="mb-2 text-caption-15-l">읽기 현황이 없습니다</div>
          </div>
        )
      ) : (
        status &&
        'users' in status && (
          <div className="mb-6 flex w-full flex-col gap-y-4">
            <div className="flex justify-between bg-gl-green-opacity-30 px-5 py-2.5 text-caption-15-m">
              <span>전체 사용자</span>
              <span>
                ({status.read}/{status.total})
              </span>
            </div>
            <div className="grid grid-cols-4 gap-x-1.5 gap-y-2.5 px-[18px] text-caption-14-l">
              {status.users.map((u, i) => (
                <div
                  key={u.uid}
                  className={twMerge(
                    'flex items-center justify-center rounded-lg px-5 py-2',
                    u.read ? 'bg-gl-green-opacity-50' : 'bg-gl-grayscale-base',
                  )}
                >
                  {u.name}
                </div>
              ))}
            </div>
          </div>
        )
      )}
      {isModal && <DatePick path="status" setIsShow={setIsModal} />}
    </div>
  )
}
