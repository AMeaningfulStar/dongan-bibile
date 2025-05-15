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

interface Community {
  id: string
  name: string
  description?: string
  churchId: string
  createdAt?: Timestamp
}

export default function Admin_Departments() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [communityName, setCommunityName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [churchId, setChurchId] = useState<string>('')
  const [selectedchurchId, setSelectedChurchId] = useState<string>('')
  const [churches, setChurches] = useState<Church[]>([])
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

  return (
    <div className="flex flex-grow flex-col items-center">
      <div className="w-full max-w-xl px-4 py-8">
        <div className="mb-6 flex w-full items-center justify-between">
          <h2 className="text-caption-24-b">👥 공동체 등록</h2>
          <Link
            href={'/admin'}
            className="flex items-center justify-center rounded bg-gl-grayscale-200 px-4 py-2 text-caption-13-l text-gl-white-base"
          >
            뒤로
          </Link>
        </div>

        <div className="mb-8 rounded-xl border border-gl-grayscale-200 px-3 py-4">
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">공동체 이름</label>
            <input
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="예: 청년부, 장년부"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">공동체 설명 (선택)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="예: 20~30대 중심의 청년 공동체"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">소속 교회</label>
            <div className="w-full rounded border px-2">
              <select
                value={churchId}
                onChange={(e) => setChurchId(e.target.value)}
                className="w-full py-2 outline-none"
              >
                <option value="">교회를 선택하세요</option>
                {churches.map((church) => (
                  <option key={church.id} value={church.id}>
                    {church.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
          >
            {loading
              ? editingCommunityId
                ? '수정 중...'
                : '등록 중...'
              : editingCommunityId
                ? '수정하기'
                : '공동체 등록하기'}
          </button>
        </div>

        <div className="mb-2 text-caption-16-b">📋 등록된 공동체 목록</div>
        <div className="mb-5 w-full rounded border px-2">
          <select
            value={selectedchurchId}
            onChange={(e) => setSelectedChurchId(e.target.value)}
            className="w-full py-2 outline-none"
          >
            <option value="">교회를 선택하세요</option>
            {churches.map((church) => (
              <option key={church.id} value={church.id}>
                {church.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-y-4">
          {communities.map((community) => (
            <div key={community.id} className="flex flex-col gap-y-1 rounded-xl border border-gl-green-opacity-50 p-4">
              <div className="text-caption-16-sb">{community.name}</div>
              <div className="text-caption-14-l text-gl-grayscale-100">{community.description}</div>
              <div className="text-caption-14-l text-gl-grayscale-200">
                소속 교회: {churches.find((c) => c.id === community.churchId)?.name || '-'}
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-x-4">
                <button
                  onClick={() => handleEdit(community)}
                  className="border-gl-blue-base text-gl-blue-base rounded border bg-gl-white-base py-2"
                >
                  수정하기
                </button>
                <button
                  onClick={() => handleDelete(community.id)}
                  className="rounded border border-gl-red-base bg-gl-white-base py-2 text-gl-red-base"
                >
                  삭제하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
