'use client'

import { collection, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import moment from 'moment'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { firestore } from '@/libs/firebase'
import { BookOption, options } from '@/utils/bibleOption'

import 'react-calendar/dist/Calendar.css'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/utils/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

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

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
}

interface BibleInfoInput {
  book: BookOption | null
  chapter: number | null
}

type BibleInfo = {
  book: string
  chapter: number
  name: string
  testament: string
  texts: {
    revised_korean: { verse: number; text: string }[]
    easy_korean: { verse: number; text: string }[]
  }
}

export default function Admin_Schedule() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [bibleInfo, setBibleInfo] = useState<BibleInfoInput>({ book: null, chapter: null })
  const [existingBibleInfo, setExistingBibleInfo] = useState<BibleInfo[]>([])

  const [churches, setChurches] = useState<Church[]>([])
  const [churchId, setChurchId] = useState<string | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [communitiesId, setCommunitiesId] = useState<string | null>(null)

  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    fetchChurches()
  }, [])

  useEffect(() => {
    if (churchId) {
      fetchCommunities()
    } else {
      setCommunities([])
    }

    if (communitiesId) {
      fetchSeasons()
    } else {
      setSeasons([])
    }
  }, [churchId, communitiesId])

  useEffect(() => {
    fetchBibleInfo()
  }, [selectedDate])

  const fetchChurches = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'churches'))
    const churchList: Church[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Church, 'id'>),
    }))
    setChurches(churchList)
  }

  const fetchCommunities = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'churches', churchId as string, 'communities'))
    const communityList: Community[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Community, 'id'>),
    }))
    setCommunities(communityList)
  }

  const fetchSeasons = async () => {
    const snapshot = await getDocs(
      collection(firestore, 'churches', churchId as string, 'communities', communitiesId as string, 'bibleSeasons'),
    )
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Season)
    setSeasons(data)
  }

  const fetchBibleInfo = async () => {
    if (!selectedDate) return
    const docId = moment(selectedDate).format('YYYY-MM-DD')
    const docRef = doc(
      firestore,
      'churches',
      churchId as string,
      'communities',
      communitiesId as string,
      'biblePlan',
      docId,
    )
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      setExistingBibleInfo(data.bibleInfo || [])
    } else {
      setExistingBibleInfo([])
    }
  }

  const handleSaveBiblePlan = async () => {
    if (!selectedSeason || !selectedDate || !bibleInfo.book || !bibleInfo.chapter) {
      alert('모든 항목을 선택해주세요.')
      return
    }

    const dateStr = moment(selectedDate).format('YYYY-MM-DD')

    // 📌 bible 본문 가져오기 (revised_korean, easy_korean)
    const revisedDocRef = doc(
      firestore,
      'bible_flat',
      `revised_korean_${bibleInfo.book.testament}_${bibleInfo.book.book}_${bibleInfo.chapter}`,
    )
    const easyDocRef = doc(
      firestore,
      'bible_flat',
      `easy_korean_${bibleInfo.book.testament}_${bibleInfo.book.book}_${bibleInfo.chapter}`,
    )

    const [revisedSnap, easySnap] = await Promise.all([getDoc(revisedDocRef), getDoc(easyDocRef)])

    const revisedTexts = revisedSnap.data()?.verses || []
    const easyTexts = easySnap.data()?.verses || []

    const bibleData: BibleInfo = {
      book: bibleInfo.book.book,
      chapter: bibleInfo.chapter,
      name: bibleInfo.book.label,
      testament: bibleInfo.book.testament,
      texts: {
        revised_korean: revisedTexts,
        easy_korean: easyTexts,
      },
    }

    const docRef = doc(
      firestore,
      'churches',
      churchId as string,
      'communities',
      communitiesId as string,
      'biblePlan',
      dateStr,
    )
    const existingDoc = await getDoc(docRef)

    if (existingDoc.exists()) {
      const existingData = existingDoc.data()
      const updatedBibleInfo = [...(existingData.bibleInfo || []), bibleData]
      await updateDoc(docRef, { bibleInfo: updatedBibleInfo })
      setExistingBibleInfo(updatedBibleInfo)
    } else {
      await setDoc(docRef, {
        seasonId: selectedSeason.id,
        bibleInfo: [bibleData],
      })
      setExistingBibleInfo([bibleData])
    }

    alert('📖 해당 날짜의 성경 계획이 저장되었습니다!')
    setBibleInfo({ book: null, chapter: 1 })
  }

  const isDateInSeason = (date: Date) => {
    if (!selectedSeason) return false
    const start = new Date(selectedSeason.startDate)
    const end = new Date(selectedSeason.endDate)

    // 시간을 00:00:00으로 맞춰서 비교
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)

    return date >= start && date <= end
  }

  const handleDelete = async (index: number) => {
    if (!selectedDate) return
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD')
    const planRef = doc(
      firestore,
      'churches',
      churchId as string,
      'communities',
      communitiesId as string,
      'biblePlan',
      formattedDate,
    )
    const newBibleInfo = existingBibleInfo.filter((_, i) => i !== index)
    await updateDoc(planRef, { bibleInfo: newBibleInfo })
    setExistingBibleInfo(newBibleInfo)
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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>기본 정보 입력</AccordionTrigger>
            <AccordionContent>
              <div className="mb-5 rounded-xl border border-gl-grayscale-200 px-3 py-4">
                {/* 교회 선택 */}
                <div className="mb-4">
                  <label className="mb-2 block text-caption-16-sb">소속 교회</label>
                  <Select value={churchId || ''} onValueChange={(value) => setChurchId(value)}>
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

                {/* 부서 선택 */}
                <div className="mb-4">
                  <label className="mb-2 block text-caption-16-sb">부서 선택</label>
                  <Select value={communitiesId || ''} onValueChange={(value) => setCommunitiesId(value)}>
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

                {/* 시즌 선택 */}
                <div className="mb-4">
                  <label className="mb-2 block text-caption-16-sb">시즌 선택</label>
                  <Select
                    value={selectedSeason?.id || ''}
                    onValueChange={(value) => {
                      const selected = seasons.find((s) => s.id === value) || null
                      setSelectedSeason(selected)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="시즌을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map((season) => (
                        <SelectItem key={season.id} value={season.id}>
                          {season.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 날짜 선택 */}
                <div className="">
                  <label className="mb-2 block text-caption-16-sb">날짜 선택</label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !selectedDate && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(new Date(selectedDate), 'yyyy년 MM월 dd일')
                        ) : (
                          <span>날짜를 선택해주세요</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        locale={ko}
                        mode="single"
                        selected={selectedDate ? new Date(selectedDate) : undefined}
                        onSelect={(date) => {
                          if (!isDateInSeason(date as Date)) {
                            alert('선택한 날짜는 시즌 기간이 아닙니다.')
                            return
                          }
                          setSelectedDate(date as Date)
                          setOpen(false)
                        }}
                        disabled={(date) => !isDateInSeason(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* 성경 정보 입력 */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>성경 정보 입력</AccordionTrigger>
            <AccordionContent>
              <div className="mb-6 rounded-xl border border-gl-grayscale-200 px-3 py-4">
                <h3 className="mb-4 text-caption-15-b">성경 정보 입력</h3>
                <Select
                  value={bibleInfo.book ? JSON.stringify(bibleInfo.book) : undefined}
                  onValueChange={(value) => {
                    setBibleInfo({ ...bibleInfo, book: JSON.parse(value) })
                    setSelectedChapter(JSON.parse(value).chapters)
                  }}
                >
                  <SelectTrigger className="mb-4 w-full">
                    <SelectValue placeholder="성경서를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option, index) => (
                      <SelectItem key={index} value={JSON.stringify(option)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={bibleInfo.chapter ? bibleInfo.chapter.toString() : undefined}
                  onValueChange={(value) => setBibleInfo({ ...bibleInfo, chapter: parseInt(value, 10) })}
                >
                  <SelectTrigger className="mb-4 w-full">
                    <SelectValue placeholder="장을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: selectedChapter || 0 }, (_, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {index + 1}장
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <button
                  onClick={handleSaveBiblePlan}
                  className="w-full rounded-lg bg-gl-green-opacity-50 py-3 text-caption-15-l text-gl-white-base"
                >
                  저장하기
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 rounded-xl border bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-semibold">
            📅 {selectedDate ? moment(selectedDate).format('YYYY년 MM월 DD일') : '0000년 00월 00일'} 저장된 성경 정보
          </h3>
          {existingBibleInfo.length > 0 ? (
            <ul className="space-y-1">
              {existingBibleInfo.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  📖 <strong>{item.name}</strong> {item.chapter}장
                  <button onClick={() => handleDelete(idx)} style={{ marginLeft: '0.5rem', color: 'red' }}>
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">아직 저장된 성경 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
