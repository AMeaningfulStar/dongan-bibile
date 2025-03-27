'use client'

import { collection, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'

import { BookOption, options } from '@/libs/bibleOption'
import { firestore } from '@/libs/firebase'

import 'react-calendar/dist/Calendar.css'

import NEXT_ARROW_ICON from '@icon/next_arrow_icon.png'
import PREV_ARROW_ICON from '@icon/prev_arrow_icon.png'

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
  chapter: number
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
  const [bibleInfo, setBibleInfo] = useState<BibleInfoInput>({ book: null, chapter: 1 })
  const [existingBibleInfo, setExistingBibleInfo] = useState<BibleInfo[]>([])

  const [churches, setChurches] = useState<Church[]>([])
  const [churchId, setChurchId] = useState<string | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [communitiesId, setCommunitiesId] = useState<string | null>(null)

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

  const NextIcon = () => {
    return <Image alt="icon" src={NEXT_ARROW_ICON} height={16} width={12} style={{ width: 'auto', height: 'auto' }} />
  }

  const PrevIcon = () => {
    return <Image alt="icon" src={PREV_ARROW_ICON} height={16} width={12} style={{ width: 'auto', height: 'auto' }} />
  }

  return (
    <div className="flex flex-grow flex-col items-center">
      <div className="w-full max-w-xl px-4 py-8">
        <div className="mb-6 flex w-full items-center justify-between">
          <h2 className="text-caption-24-b">📖 성경 일정 관리</h2>
          <Link
            href={'/admin'}
            className="flex items-center justify-center rounded bg-gl-grayscale-200 px-4 py-2 text-caption-13-l text-gl-white-base"
          >
            뒤로
          </Link>
        </div>
        <div className="mb-8 rounded-xl border border-gl-grayscale-200 px-3 py-4">
          {/* 교회 선택 */}
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">교회 선택</label>
            <div className="w-full rounded border px-2">
              <select
                value={churchId || ''}
                onChange={(e) => setChurchId(e.target.value)}
                className="w-full py-2 outline-none"
              >
                <option value="">교회을 선택하세요</option>
                {churches.map((church) => (
                  <option key={church.id} value={church.id}>
                    {church.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 부서 선택 */}
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">부서 선택</label>
            <div className="w-full rounded border px-2">
              <select
                value={communitiesId || ''}
                onChange={(e) => setCommunitiesId(e.target.value)}
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

          {/* 시즌 선택 */}
          <div className="mb-4">
            <label className="mb-2 block text-caption-16-sb">시즌 선택</label>
            <div className="w-full rounded border px-2">
              <select
                value={selectedSeason?.id || ''}
                onChange={(e) => {
                  const selected = seasons.find((s) => s.id === e.target.value) || null
                  setSelectedSeason(selected)
                }}
                className="w-full py-2 outline-none"
              >
                <option value="">시즌을 선택하세요</option>
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name} ({season.startDate} ~ {season.endDate})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 날짜 선택 */}
        {selectedSeason && (
          <div className="mb-6 flex w-full flex-col items-center justify-center gap-2">
            <div className="mb-2 w-full text-caption-16-sb">날짜 선택</div>
            <Calendar
              locale="ko"
              formatDay={(locale, data) => moment(data).format('DD')}
              nextLabel={<NextIcon />}
              prevLabel={<PrevIcon />}
              maxDetail="month"
              minDetail="month"
              calendarType="gregory"
              showNeighboringMonth={false}
              prev2Label={null}
              next2Label={null}
              value={selectedDate}
              view="month"
              onChange={(date) => setSelectedDate(date as Date)}
              tileDisabled={({ date }) => !isDateInSeason(date)}
            />
          </div>
        )}

        {/* 성경 정보 입력 */}
        {selectedDate && (
          <div className="mb-6 rounded-xl border border-gl-grayscale-200 px-3 py-4">
            <h3 className="text-caption-15-b mb-4">📘 성경 정보 입력</h3>
            <div className="mb-6 w-full rounded border border-gl-grayscale-200 px-2">
              <select
                value={JSON.stringify(bibleInfo.book) || ''}
                onChange={(e) => {
                  setBibleInfo({ ...bibleInfo, book: JSON.parse(e.target.value) })
                  setSelectedChapter(JSON.parse(e.target.value).chapters)
                }}
                className="w-full py-2 outline-none"
              >
                <option value="">성경서를 선택하세요</option>
                {options.map((option, index) => (
                  <option key={index} value={JSON.stringify(option)}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {bibleInfo.book && (
              <div className="mb-6 w-full rounded border border-gl-grayscale-200 px-2">
                <select
                  value={bibleInfo.chapter || ''}
                  onChange={(e) => setBibleInfo({ ...bibleInfo, chapter: parseInt(e.target.value, 10) || 1 })}
                  className="w-full py-2 outline-none"
                >
                  <option value="">장을 선택하세요</option>
                  {[...Array<BookOption>(selectedChapter as number).keys()].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}장
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={handleSaveBiblePlan}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: 6,
              }}
            >
              저장하기
            </button>
          </div>
        )}
        {selectedDate && (
          <div className="mt-4 rounded-xl border bg-gray-50 p-4">
            <h3 className="mb-2 text-lg font-semibold">
              📅 {moment(selectedDate).format('YYYY년 MM월 DD일')} 저장된 성경 정보
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
        )}
      </div>
    </div>
  )
}
