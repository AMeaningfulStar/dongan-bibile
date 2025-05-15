'use client'

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

export default function Admin_Churches() {
  const [churchName, setChurchName] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [churches, setChurches] = useState<Church[]>([])
  const [editingChurchId, setEditingChurchId] = useState<string | null>(null)

  useEffect(() => {
    fetchChurches()
  }, [])

  const fetchChurches = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'churches'))
    const churchList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setChurches(churchList as any)
  }

  const handleRegister = async () => {
    if (!churchName.trim()) {
      alert('교회 이름을 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      if (editingChurchId) {
        const churchRef = doc(firestore, 'churches', editingChurchId)
        await updateDoc(churchRef, { name: churchName, location })
        alert('교회 정보가 수정되었습니다!')
        setEditingChurchId(null)
      } else {
        await addDoc(collection(firestore, 'churches'), {
          name: churchName,
          location,
          createdAt: Timestamp.now(),
        })
        alert('교회가 등록되었습니다!')
      }
      setChurchName('')
      setLocation('')
      fetchChurches()
    } catch (error) {
      console.error('등록 실패:', error)
      alert('처리 중 오류가 발생했어요 😢')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (church: Church) => {
    setChurchName(church.name)
    setLocation(church.location || '')
    setEditingChurchId(church.id)
  }

  const handleDelete = async (churchId: string) => {
    const confirm = window.confirm('정말 이 교회를 삭제하시겠어요?')
    if (!confirm) return
    try {
      await deleteDoc(doc(firestore, 'churches', churchId))
      alert('교회가 삭제되었습니다.')
      fetchChurches()
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제 중 오류가 발생했어요 😢')
    }
  }

  return (
    <div className="flex flex-grow flex-col items-center">
      <Link
        href={'/admin'}
        className="fixed right-3 top-3 z-10 flex items-center justify-center rounded bg-gl-grayscale-200 px-4 py-2 text-caption-13-l text-gl-white-base"
      >
        뒤로
      </Link>
      <div className="w-full max-w-xl px-4 py-6">
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
        <div className="h-full w-full">
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
