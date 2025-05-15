'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { firestore } from '@/libs/firebase'
import { cn } from '@/utils/utils'
import { format } from 'date-fns'
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import { CalendarIcon } from 'lucide-react'
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
      <Link
        href={'/admin'}
        className="fixed right-3 top-3 z-10 flex items-center justify-center rounded bg-gl-grayscale-200 px-4 py-2 text-caption-13-l text-gl-white-base"
      >
        뒤로
      </Link>
      <div className="w-full max-w-xl px-4 py-6">
        <div className="mb-8 rounded-xl border border-gl-grayscale-200 px-3 py-4">
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">소속 교회</label>
            <Select value={inputChurchId} onValueChange={(value) => setInputChurchId(value)}>
              <SelectTrigger className="w-full">
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
            <label className="mb-2 block text-caption-16-sb">소속 부서</label>
            <Select value={inputCommunitieId} onValueChange={(value) => setInputCommunitieId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="부서를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((community) => (
                  <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="mb-2 block text-caption-16-sb">새 시즌 추가</label>
          <Input
            type="text"
            placeholder="시즌 이름을 입력해주세요"
            value={newSeason.name}
            onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
            className="mb-4 w-full outline-none placeholder:text-caption-14-l"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'mb-4 w-full justify-start text-left font-normal',
                  !newSeason.startDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newSeason.startDate ? (
                  format(new Date(newSeason.startDate), 'yyyy년 MM월 dd일') + ' 시작일'
                ) : (
                  <span>시작일을 선택해주세요</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newSeason.startDate ? new Date(newSeason.startDate) : undefined}
                onSelect={(date) => setNewSeason({ ...newSeason, startDate: date?.toISOString().split('T')[0] || '' })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'mb-5 w-full justify-start text-left font-normal',
                  !newSeason.endDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newSeason.endDate ? (
                  format(new Date(newSeason.endDate), 'yyyy년 MM월 dd일') + ' 종료일'
                ) : (
                  <span>종료일을 선택해주세요</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newSeason.endDate ? new Date(newSeason.endDate) : undefined}
                onSelect={(date) => setNewSeason({ ...newSeason, endDate: date?.toISOString().split('T')[0] || '' })}
                initialFocus
              />
            </PopoverContent>
          </Popover>

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
        <Select value={selectedChurchId} onValueChange={(value) => setSelectedChurchId(value)}>
          <SelectTrigger className="mb-4 w-full">
            <SelectValue placeholder="조회할 교회를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {churches.map((church) => (
              <SelectItem key={church.id} value={church.id}>
                {church.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCommunityId} onValueChange={(value) => setSelectedCommunityId(value)}>
          <SelectTrigger className="mb-4 w-full">
            <SelectValue placeholder="조회할 부서를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {selectedCommunity.map((community) => (
              <SelectItem key={community.id} value={community.id}>
                {community.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Accordion type="single" collapsible className="w-full px-2">
          {seasons.map((season) => (
            <AccordionItem key={season.id} value={`item-${season.id}`}>
              <AccordionTrigger>{season.name}</AccordionTrigger>
              <AccordionContent>
                {season.startDate} ~ {season.endDate}
                <div className="mt-4 grid w-full grid-cols-2 gap-x-2">
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
                    className="rounded border border-gl-blue-base bg-gl-white-base py-1.5 text-gl-blue-base"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteSeason(season.id!)}
                    className="rounded border border-gl-red-base bg-gl-white-base py-1.5 text-gl-red-base"
                  >
                    삭제
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
