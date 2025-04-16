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
      <div className="w-full max-w-xl px-4 py-8">
        <div className="mb-6 flex w-full items-center justify-between">
          <h2 className="text-caption-24-b">⛪ 교회 등록</h2>
          <Link
            href={'/admin'}
            className="flex items-center justify-center rounded bg-gl-grayscale-200 px-4 py-2 text-caption-13-l text-gl-white-base"
          >
            뒤로
          </Link>
        </div>
        <div className="mb-8 rounded-xl border border-gl-grayscale-200 px-3 py-4">
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">교회 이름</label>
            <input
              type="text"
              value={churchName}
              onChange={(e) => setChurchName(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="예: 동안교회"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">교회 지역/설명 (선택)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="예: 서울 동대문구, 본당 중심"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
          >
            {loading ? (editingChurchId ? '수정 중...' : '등록 중...') : editingChurchId ? '수정하기' : '교회 등록하기'}
          </button>
        </div>

        <div className="mb-5 text-caption-16-b">📋 등록된 교회 목록</div>
        <div className="flex flex-col gap-y-4">
          {churches.map((church) => (
            <div key={church.id} className="flex flex-col gap-y-1 rounded-xl border border-gl-green-opacity-50 p-4">
              <div className="text-caption-16-sb">{church.name}</div>
              <div className="text-caption-14-l text-gl-grayscale-100">{church.location}</div>
              <div className="mt-4 grid w-full grid-cols-2 gap-x-4">
                <button
                  onClick={() => handleEdit(church)}
                  className="border-gl-blue-base text-gl-blue-base rounded border bg-gl-white-base py-2"
                >
                  수정하기
                </button>
                <button
                  onClick={() => handleDelete(church.id)}
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
