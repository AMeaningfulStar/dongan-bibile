'use client'

import { firestore } from '@/libs/firebase'
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface BibleSeason {
  id?: string
  name: string
  startDate: string
  endDate: string
}

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

export default function Admin_Season() {
  const [seasons, setSeasons] = useState<BibleSeason[]>([])
  const [newSeason, setNewSeason] = useState<BibleSeason>({ name: '', startDate: '', endDate: '' })
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null)
  const [inputChurchId, setInputChurchId] = useState<string>('')
  const [churches, setChurches] = useState<Church[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [inputCommunitieId, setInputCommunitieId] = useState<string>('')
  const [selectedChurchId, setSelectedChurchId] = useState<string>('')
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('')
  const [selectedCommunity, setSelectedCommunity] = useState<Community[]>([])

  const fetchSeasons = async () => {
    const snapshot = await getDocs(
      collection(firestore, 'churches', selectedChurchId, 'communities', selectedCommunityId, 'bibleSeasons'),
    )
    const data: BibleSeason[] = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<BibleSeason, 'id'>) }))

    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.startDate)
      const dateB = new Date(b.startDate)
      return dateA.getTime() - dateB.getTime()
    })

    setSeasons(sortedData)
  }

  useEffect(() => {
    fetchChurches()
  }, [])

  useEffect(() => {
    if (inputChurchId !== '') {
      fetchCommunities({ churchId: inputChurchId, setFunction: setCommunities })
    } else {
      setCommunities([])
    }
  }, [inputChurchId])

  useEffect(() => {
    if (selectedChurchId !== '') {
      fetchCommunities({ churchId: selectedChurchId, setFunction: setSelectedCommunity })
    } else {
      setSelectedCommunity([])
    }
  }, [selectedChurchId])

  useEffect(() => {
    if (selectedChurchId !== '' && selectedCommunityId !== '') fetchSeasons()
  }, [selectedChurchId, selectedCommunityId])

  const fetchChurches = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'churches'))
    const churchList: Church[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Church, 'id'>),
    }))
    setChurches(churchList)
  }

  const fetchCommunities = async ({
    churchId,
    setFunction,
  }: {
    churchId: string
    setFunction: (communities: Community[]) => void
  }) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'churches', churchId, 'communities'))
      const communityList: Community[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Community, 'id'>),
      }))

      setFunction(communityList)
    } catch (error) {
      console.error('공동체 데이터를 불러오는 중 오류 발생:', error)
    }
  }

  const handleAddSeason = async () => {
    if (!newSeason.name || !newSeason.startDate || !newSeason.endDate) return

    const createSeason = {
      ...newSeason,
      createdAt: serverTimestamp(),
    }

    await addDoc(
      collection(firestore, 'churches', inputChurchId, 'communities', inputCommunitieId, 'bibleSeasons'),
      createSeason,
    )
    setNewSeason({ name: '', startDate: '', endDate: '' })
    setInputChurchId('')
    setInputCommunitieId('')
    fetchSeasons()
  }

  const handleUpdateSeason = async (id: string) => {
    const seasonRef = doc(firestore, 'churches', inputChurchId, 'communities', inputCommunitieId, 'bibleSeasons', id)

    const updateSeason = {
      ...newSeason,
      createdAt: serverTimestamp(),
    }

    await updateDoc(seasonRef, updateSeason as any)
    setEditingSeasonId(null)
    setNewSeason({ name: '', startDate: '', endDate: '' })
    setInputChurchId('')
    setInputCommunitieId('')
    fetchSeasons()
  }

  const handleDeleteSeason = async (id: string) => {
    if (confirm('정말로 삭제하시겠어요?')) {
      try {
        await deleteDoc(
          doc(firestore, 'churches', selectedChurchId, 'communities', selectedCommunityId, 'bibleSeasons', id),
        )
        alert('삭제되었습니다.')
        fetchSeasons()
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
          <h2 className="text-caption-24-b">📅 "청신호" 시즌 관리</h2>
          <Link
            href={'/admin'}
            className="flex items-center justify-center rounded bg-gl-grayscale-200 px-4 py-2 text-caption-13-l text-gl-white-base"
          >
            뒤로
          </Link>
        </div>

        <div className="mb-8 rounded-xl border border-gl-grayscale-200 px-3 py-4">
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">소속 교회</label>
            <div className="w-full rounded border px-2">
              <select
                value={inputChurchId}
                onChange={(e) => setInputChurchId(e.target.value)}
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
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">소속 부서</label>
            <div className="w-full rounded border px-2">
              <select
                value={inputCommunitieId}
                onChange={(e) => setInputCommunitieId(e.target.value)}
                className="w-full py-2 outline-none"
              >
                <option value="">부서를 선택하세요</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="mb-2 block text-caption-16-sb">새 시즌 추가</label>
          <input
            type="text"
            placeholder="시즌 이름"
            value={newSeason.name}
            onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
            className="mb-4 block w-full rounded border p-2 outline-none"
          />
          <input
            type="date"
            value={newSeason.startDate}
            onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })}
            className="mb-4 block w-full rounded border p-2 outline-none"
          />
          <input
            type="date"
            value={newSeason.endDate}
            onChange={(e) => setNewSeason({ ...newSeason, endDate: e.target.value })}
            className="mb-8 block w-full rounded border p-2 outline-none"
          />

          {editingSeasonId ? (
            <button
              onClick={() => handleUpdateSeason(editingSeasonId)}
              className="w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
            >
              수정 완료
            </button>
          ) : (
            <button
              onClick={handleAddSeason}
              className="w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
            >
              시즌 추가
            </button>
          )}
        </div>

        <div className="mb-5 text-caption-16-b">📋 시즌 목록</div>
        <div className="mb-4 w-full rounded border px-2">
          <select
            value={selectedChurchId}
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
        <div className="mb-4 w-full rounded border px-2">
          <select
            value={selectedCommunityId}
            onChange={(e) => setSelectedCommunityId(e.target.value)}
            className="w-full py-2 outline-none"
          >
            <option value="">부서를 선택하세요</option>
            {selectedCommunity.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-y-4">
          {seasons.map((season) => (
            <div key={season.id} className="flex flex-col gap-y-1 rounded-xl border border-gl-green-opacity-50 p-4">
              <div className="text-caption-16-sb">{season.name}</div>
              <div className="text-caption-14-l text-gl-grayscale-100">
                {season.startDate} ~ {season.endDate}
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-x-4">
                <button
                  onClick={() => {
                    setEditingSeasonId(season.id ?? null)
                    setNewSeason({
                      name: season.name,
                      startDate: season.startDate,
                      endDate: season.endDate,
                    })
                    setInputChurchId(selectedChurchId)
                    setInputCommunitieId(selectedCommunityId)
                  }}
                  className="border-gl-blue-base text-gl-blue-base rounded border bg-gl-white-base py-2"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteSeason(season.id!)}
                  className="rounded border border-gl-red-base bg-gl-white-base py-2 text-gl-red-base"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
