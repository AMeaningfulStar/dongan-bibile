'use client'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'
import { useState } from 'react'

import { useChurches, useCommunities, useCreateCommunity, useDeleteCommunity, useUpdateCommunity } from '@/hooks'
import { CommunityType } from '@/types'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Admin_Departments() {
  const { churches, isLoading: getChurchesIsLoading } = useChurches()
  const { createCommunity, isLoading: createIsLoading, error: createError } = useCreateCommunity()
  const { updateCommunity, isLoading: updateIsLoading, error: updateError } = useUpdateCommunity()
  const { deleteCommunity, error: deleteError } = useDeleteCommunity()

  const [churchId, setChurchId] = useState<string>('')
  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const [community, setCommunity] = useState<CommunityType>({
    id: '',
    name: '',
    description: '',
    createdAt: Timestamp.now(),
  })

  const [selectedchurchId, setSelectedChurchId] = useState<string>('')
  const { communities, isLoading: getCommunitiesIsLoading } = useCommunities(selectedchurchId)

  // 공동체 수정 버튼 이벤트 핸들러
  const handleEdit = (community: CommunityType) => {
    setIsUpdated(true)
    setCommunity(community)
    setChurchId(selectedchurchId)
  }

  // 공동체 등록/수정 이벤트 핸들러
  const handleRegister = async () => {
    if (!community.name.trim() || !churchId) {
      alert('공동체 이름과 교회를 선택해주세요.')
      return
    }

    try {
      if (isUpdated) {
        const success = await updateCommunity(churchId, {
          id: community.id,
          name: community.name,
          description: community.description,
        })

        if (success) {
          alert('공동체가 수정되었습니다!')
        }

        setIsUpdated(false)
      } else {
        const success = await createCommunity(churchId, {
          name: community.name,
          description: community.description,
        })
        if (success) {
          alert('공동체가 등록되었습니다!')
        }
      }

      setCommunity({ id: '', name: '', description: '', createdAt: Timestamp.now() })
    } catch (error) {
      console.error('등록 실패:', createError || updateError || error)
      alert('처리 중 오류가 발생했어요 😢')
    }
  }

  const handleDelete = async (communityId: string) => {
    if (confirm('정말로 삭제하시겠어요?')) {
      try {
        const success = await deleteCommunity(selectedchurchId, communityId)
        if (success) {
          alert('공동체가 삭제되었습니다.')
        }
      } catch (error) {
        console.error('삭제 실패:', error || deleteError)
        alert('삭제 중 오류가 발생했어요 😢')
      }
    }
  }

  if (getChurchesIsLoading) {
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
        <p className="text-caption-18-sb">정보 불러오는 중...</p>
      </div>
    )
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
            <label className="mb-2 block text-caption-16-sb">소속 교회</label>
            <Select
              value={churchId || ''}
              onValueChange={(value) => {
                setChurchId(value)
              }}
            >
              <SelectTrigger className="w-full outline-none">
                <SelectValue placeholder="교회를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {churches.map((church) => (
                  <SelectItem key={church.id} value={church.id}>
                    {church.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">공동체 이름</label>
            <Input
              type="text"
              placeholder="공동체 이름을 입력해주세요"
              value={community.name}
              onChange={(e) => setCommunity({ ...community, name: e.target.value })}
              className="w-full outline-none placeholder:text-caption-14-l"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">공동체 설명 (선택)</label>
            <Input
              type="text"
              placeholder="공동체 설명을 입력해주세요"
              value={community.description}
              onChange={(e) => setCommunity({ ...community, description: e.target.value })}
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
                  setCommunity({ id: '', name: '', description: '', createdAt: Timestamp.now() })
                  setChurchId('')
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
          <Select
            value={selectedchurchId || ''}
            onValueChange={(value) => {
              setSelectedChurchId(value)
            }}
          >
            <SelectTrigger className="mb-4 w-full outline-none">
              <SelectValue placeholder="교회를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {churches.map((church) => (
                <SelectItem key={church.id} value={church.id}>
                  {church.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getCommunitiesIsLoading ? (
            <div className="my-5 flex h-full w-full items-center justify-center">
              <svg fill="none" className="h-7 w-7 animate-spin" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
              <p className="text-caption-18-sb">등록된 공동체 정보 불러오는 중...</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full px-2">
              {communities.map((community) => (
                <AccordionItem key={community.id} value={`item-${community.id}`}>
                  <AccordionTrigger className="text-caption-16-sb">{community.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-caption-14-l text-gl-grayscale-100">{community.description}</div>
                    <div className="mt-4 grid w-full grid-cols-2 gap-x-2">
                      <button
                        onClick={() => handleEdit(community)}
                        className="rounded border border-gl-blue-base bg-gl-white-base py-1.5 text-gl-blue-base"
                      >
                        수정하기
                      </button>
                      <button
                        onClick={() => handleDelete(community.id)}
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
