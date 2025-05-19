'use client'

import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'
import { useState } from 'react'

import { useChurches, useCreateChurch, useDeleteChurch, useUpdateChurch } from '@/hooks'

import { ChurchType } from '@/types'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'

export default function Admin_Churches() {
  const { churches, isLoading: getIsLoading } = useChurches()
  const { createChurch, isLoading: createIsLoading, error: createError } = useCreateChurch()
  const { updateChurch, isLoading: updateIsLoading, error: updateError } = useUpdateChurch()
  const { deleteChurchById, error: deleteError } = useDeleteChurch()

  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const [church, setChurche] = useState<ChurchType>({
    id: '',
    name: '',
    location: '',
    createdAt: Timestamp.now(),
  })

  const handleRegister = async () => {
    if (!church.name.trim()) {
      alert('교회 이름을 입력해주세요.')
      return
    }

    try {
      if (isUpdated) {
        const update_res = await updateChurch('church_abc123', {
          name: '새로운 교회 이름',
          location: '서울시 종로구',
        })

        if (update_res) {
          alert('정보가 수정되었습니다!')
        }

        setIsUpdated(false)
      } else {
        const create_res = await createChurch({
          name: church.name,
          location: church.location,
        })

        if (create_res) {
          alert('교회가 등록되었습니다!')
        }
      }

      setChurche({ id: '', name: '', location: '', createdAt: Timestamp.now() })
    } catch (error) {
      console.error('오류 발생:', createError || updateError)
      alert('처리 중 오류가 발생했어요 😢')
    }
  }

  const handleEdit = (church: ChurchType) => {
    setChurche(church)
    setIsUpdated(true)
  }

  const handleDelete = async (churchId: string) => {
    const confirm = window.confirm('정말 이 교회를 삭제하시겠어요?')
    if (!confirm) return
    try {
      const success = await deleteChurchById(churchId)

      if (success) {
        alert('삭제 완료!')
      }
    } catch (error) {
      console.error('오류 발생:', deleteError)
      alert('삭제 중 오류가 발생했어요 😢')
    }
  }

  return (
    <div className="flex h-full flex-grow flex-col items-center">
      <Link
        href={'/admin'}
        className="fixed right-3 top-3 z-10 flex items-center justify-center rounded bg-gl-grayscale-200 px-4 py-2 text-caption-13-l text-gl-white-base"
      >
        뒤로
      </Link>
      <div className="flex w-full max-w-xl flex-grow flex-col px-4 py-6">
        <div className="mb-8 rounded-xl border border-gl-grayscale-200 px-3 py-4">
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">교회 이름</label>
            <Input
              type="text"
              placeholder="교회 이름을 입력해주세요"
              value={church.name}
              onChange={(e) => setChurche({ ...church, name: e.target.value })}
              className="w-full outline-none placeholder:text-caption-14-l"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">교회 지역/설명 (선택)</label>
            <Input
              type="text"
              placeholder="교회 지역 및 설명을 입력해주세요"
              value={church.location}
              onChange={(e) => setChurche({ ...church, location: e.target.value })}
              className="w-full outline-none placeholder:text-caption-14-l"
            />
          </div>
          {isUpdated ? (
            <>
              <button
                onClick={handleRegister}
                disabled={updateIsLoading}
                className="mb-2 w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
              >
                {updateIsLoading ? '수정 중...' : '수정하기'}
              </button>
              <button
                onClick={() => {
                  setIsUpdated(false)
                  setChurche({ id: '', name: '', location: '', createdAt: Timestamp.now() })
                }}
                disabled={updateIsLoading}
                className="w-full rounded-lg bg-gl-grayscale-base py-3 text-caption-15-l text-gl-green-opacity-50"
              >
                취소하기
              </button>
            </>
          ) : (
            <button
              onClick={handleRegister}
              disabled={createIsLoading}
              className="w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
            >
              {createIsLoading ? '등록 중...' : '교회 등록하기'}
            </button>
          )}
        </div>

        <div className="mb-3 text-caption-16-b">등록된 교회 목록</div>
        <div className="w-full flex-grow">
          {getIsLoading ? (
            <div className="my-5 flex h-full w-full items-center justify-center">
              <svg fill="none" className="h-7 w-7 animate-spin" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
              <p className="text-caption-18-sb">등록된 교회 정보 불러오는 중...</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {churches.map((church) => (
                <AccordionItem key={church.id} value={`item-${church.id}`}>
                  <AccordionTrigger className="text-caption-16-sb">{church.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-caption-14-l text-gl-grayscale-100">{church.location}</div>
                    <div className="mt-4 grid w-full grid-cols-2 gap-x-2">
                      <button
                        onClick={() => handleEdit(church)}
                        className="rounded border border-gl-blue-base bg-gl-white-base py-1.5 text-gl-blue-base"
                      >
                        수정하기
                      </button>
                      <button
                        onClick={() => handleDelete(church.id)}
                        className="rounded border border-gl-red-base bg-gl-white-base py-1.5 text-gl-red-base"
                      >
                        삭제하기
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  )
}
