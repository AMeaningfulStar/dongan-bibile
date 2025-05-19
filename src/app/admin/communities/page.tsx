'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useChurches } from '@/hooks'
import { firestore } from '@/libs/firebase'
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Church {
  id: string
  name: string
  location?: string
  createdAt?: Timestamp
}

interface Community {
  id: string
  name: string
  description?: string
  churchId: string
  createdAt?: Timestamp
}

export default function Admin_Departments() {
  const { churches, isLoading: getIsLoading } = useChurches()

  const [churchId, setChurchId] = useState<string>('')
  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const [community, setCommunity] = useState<Community>({
    id: '',
    name: '',
    description: '',
    churchId: '',
    createdAt: Timestamp.now(),
  })

  const [selectedchurchId, setSelectedChurchId] = useState<string>('')

  const [communities, setCommunities] = useState<Community[]>([])
  const [communityName, setCommunityName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [churcshes, setChurches] = useState<Church[]>([])
  const [editingCommunityId, setEditingCommunityId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchChurches()
  }, [])

  useEffect(() => {
    if (selectedchurchId !== '') {
      fetchCommunities()
    } else {
      setCommunities([])
    }
  }, [selectedchurchId])

  const fetchChurches = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'churches'))
    const churchList: Church[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Church, 'id'>),
    }))
    setChurches(churchList)
  }

  const fetchCommunities = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'churches', selectedchurchId, 'communities'))
    const communityList: Community[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Community, 'id'>),
    }))
    setCommunities(communityList)
  }

  const handleRegister = async () => {
    if (!communityName.trim() || !churchId) {
      alert('공동체 이름과 교회를 선택해주세요.')
      return
    }
    setLoading(true)
    try {
      if (editingCommunityId) {
        const communityRef = doc(firestore, 'churches', churchId, 'communities', editingCommunityId)
        await updateDoc(communityRef, { name: communityName, description, churchId })
        alert('공동체가 수정되었습니다!')
        setEditingCommunityId(null)
      } else {
        await addDoc(collection(firestore, 'churches', churchId, 'communities'), {
          name: communityName,
          description,
          churchId,
          createdAt: Timestamp.now(),
        })
        alert('공동체가 등록되었습니다!')
      }
      setCommunityName('')
      setDescription('')
      setChurchId('')
      fetchCommunities()
    } catch (error) {
      console.error('등록 실패:', error)
      alert('처리 중 오류가 발생했어요 😢')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (community: Community) => {
    setCommunityName(community.name)
    setDescription(community.description || '')
    setChurchId(community.churchId)
    setEditingCommunityId(community.id)
  }

  const handleDelete = async (communityId: string) => {
    if (confirm('정말로 삭제하시겠어요?')) {
      try {
        await deleteDoc(doc(firestore, 'churches', churchId, 'communities', communityId))
        alert('공동체가 삭제되었습니다.')
        fetchCommunities()
      } catch (error) {
        console.error('삭제 실패:', error)
        alert('삭제 중 오류가 발생했어요 😢')
      }
    }
  }

  if (getIsLoading) {
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
                disabled={loading}
                className="mb-2 w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
              >
                {loading ? '수정 중...' : '수정하기'}
              </button>
              <button
                onClick={() => {}}
                disabled={loading}
                className="w-full rounded-lg bg-gl-grayscale-base py-3 text-caption-15-l text-gl-green-opacity-50"
              >
                취소하기
              </button>
            </>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
            >
              {loading ? '등록 중...' : '교회 등록하기'}
            </button>
          )}
        </div>
        <div className="mb-3 text-caption-16-b">등록된 교회 목록</div>
        <div className="w-full flex-grow">
          {/* {getIsLoading ? (
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
          )} */}
        </div>
      </div>
    </div>
  )
}
