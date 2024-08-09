'use client'

import moment from 'moment'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'
import Calendar from 'react-calendar'

import { firestore } from '@/libs/firebase'
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

import { DashboardLayout } from '@/components/Layout'
import { BookOption, options } from '@/libs/bibleOption'

export default function SetBible() {
  const [datePick, setDatePick] = useState<string>(moment(new Date()).format('YYYY-MM-DD'))
  const [selectedBook, setSelectedBook] = useState<BookOption | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [bibleList, setBibleList] = useState<
    Array<{
      name: string
      book: string
      chapter: number
      testament: string
    }>
  >([])

  const readBibleList = async (datePick: string) => {
    try {
      setDatePick(datePick)
      // biblePlan 컬렉션에서 datePick 문서 참조
      const bibleInfoRef = doc(firestore, 'biblePlan', datePick)
      const bibleInfoSnap = await getDoc(bibleInfoRef)

      if (bibleInfoSnap.exists()) {
        setBibleList(
          bibleInfoSnap.data().bibleInfo as Array<{
            name: string
            book: string
            chapter: number
            testament: string
          }>,
        )
      } else {
        setBibleList([])
      }
    } catch (error) {
      console.error('Error checking for bible information:', error)
    }
  }

  const handleBookChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value

    if (selectedValue) {
      setSelectedBook(JSON.parse(selectedValue))
      setSelectedChapter(null) // 새로운 책을 선택할 때 구절 선택 초기화
    }
  }

  const handleChapterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10)
    setSelectedChapter(selectedValue)
  }

  const handleAddBibleList = async () => {
    try {
      // biblePlan 컬렉션에서 datePick 문서 참조
      const bibleInfoRef = doc(firestore, 'biblePlan', datePick)
      const bibleInfoSnap = await getDoc(bibleInfoRef)

      if (bibleInfoSnap.exists()) {
        await updateDoc(bibleInfoRef, {
          bibleInfo: arrayUnion({
            name: selectedBook?.label,
            book: selectedBook?.book,
            chapter: selectedChapter,
            testament: selectedBook?.testament,
          }),
        }).then(() => readBibleList(datePick))
      } else {
        await setDoc(bibleInfoRef, {
          bibleInfo: [
            {
              name: selectedBook?.label,
              book: selectedBook?.book,
              chapter: selectedChapter,
              testament: selectedBook?.testament,
            },
          ],
        }).then(() => readBibleList(datePick))
      }
    } catch (error) {
      console.error('Error checking for bible list update:', error)
    }
  }

  const handleDeleteBibleList = async (index: number) => {
    try {
      // biblePlan 컬렉션에서 datePick 문서 참조
      const bibleInfoRef = doc(firestore, 'biblePlan', datePick)
      const bibleInfoSnap = await getDoc(bibleInfoRef)

      if (bibleInfoSnap.exists()) {
        await updateDoc(bibleInfoRef, {
          bibleInfo: arrayRemove(bibleList[index]),
        }).then(() => readBibleList(datePick))
      }
    } catch (error) {
      console.error('Error checking for bible list delete:', error)
    }
  }

  useEffect(() => {
    readBibleList(datePick)
  }, [datePick])

  return (
    <DashboardLayout pageName="관리자 페이지">
      <div className="flex flex-col items-center gap-y-6 py-2.5">
        <Calendar
          locale="ko"
          formatDay={(locale, data) => moment(data).format('DD')}
          maxDetail="month"
          minDetail="month"
          calendarType="gregory"
          showNeighboringMonth={false}
          className="mx-auto w-full text-sm"
          prev2Label={null}
          next2Label={null}
          view="month"
          onChange={(date: any) => setDatePick(moment(date).format('YYYY-MM-DD'))}
          value={new Date(datePick)}
        />

        <div className="w-full">
          <span className="text-xl font-light leading-none">{moment(datePick).format('YYYY-MM-DD')}</span>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          {bibleList.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-base font-light leading-none">
                {item.name} {item.chapter}장
              </span>
              <button className="rounded-sm border bg-[#E8EEFF] p-1" onClick={() => handleDeleteBibleList(idx)}>
                삭제
              </button>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center gap-y-4 rounded-lg border border-gray-300 p-3">
          <div className="flex w-full flex-col gap-y-2">
            <label htmlFor="bookSelect" className="text-xs font-medium text-gray-900 dark:text-white">
              성경서
            </label>
            <select
              id="bookSelect"
              onChange={handleBookChange}
              value={JSON.stringify(selectedBook) || ''}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900"
            >
              <option value="">성경서를 선택해주세요</option>
              {options.map((option, index) => (
                <option key={index} value={JSON.stringify(option)}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <label htmlFor="chapterSelect" className="text-xs font-medium text-gray-900 dark:text-white">
              장
            </label>
            <select
              id="chapterSelect"
              onChange={handleChapterChange}
              value={selectedChapter || ''}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900"
            >
              <option value="">장을 선택해주세요</option>
              {[...Array<BookOption>(selectedBook?.chapters as number).keys()].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}장
                </option>
              ))}
            </select>
          </div>
          <button
            className="h-8 w-36 items-center justify-center rounded-lg bg-[#0276F9] text-white"
            onClick={handleAddBibleList}
          >
            추가하기
          </button>
        </div>
        <Link
          href={'/admin'}
          className="flex h-8 w-36 items-center justify-center rounded-lg border border-black bg-white"
        >
          <span className="text-sm font-normal leading-none">뒤로가기</span>
        </Link>
      </div>
    </DashboardLayout>
  )
}
