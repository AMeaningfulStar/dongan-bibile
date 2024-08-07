import { firestore } from '@/libs/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

interface BibleData {
  title: string
  chapters: Array<{
    chapter: number
    verses: Array<{
      verse: number
      text: string
    }>
  }>
}

// GET 함수에 대한 Next.js API 라우트
export async function GET(req: NextRequest, { params }: { params: { datePick: string; bibleType: string } }) {
  const { datePick, bibleType } = params
  try {
    // biblePlan 컬렉션에서 datePick 문서 참조
    const bibleInfoRef = doc(firestore, 'biblePlan', datePick)
    const bibleInfoSnap = await getDoc(bibleInfoRef)

    // bibleInfoSnap이 존재하는지 확인
    if (bibleInfoSnap.exists()) {
      const bibleInfoList = bibleInfoSnap.data() as {
        bibleInfo: Array<{
          book: string
          chapter: number
          testament: string
        }>
      }

      const response: Array<{
        title: string
        chapter: number
        verses: Array<{
          verse: number
          text: string
        }>
      }> = []

      // 모든 비동기 작업을 병렬로 처리하기 위해 Promise.all 사용
      const promises = bibleInfoList.bibleInfo.map(async (info) => {
        // bible 컬렉션에서 특정 바이블 데이터 참조
        const bibleDataRef = doc(firestore, 'bible', bibleType, info.testament, info.book)
        const bibleDataSnap = await getDoc(bibleDataRef)

        if (bibleDataSnap.exists()) {
          const bibleData = bibleDataSnap.data() as BibleData
          const chapter = bibleData.chapters[info.chapter - 1]

          response.push({
            title: bibleData.title,
            chapter: chapter.chapter,
            verses: chapter.verses,
          })
        } else {
          return NextResponse.json({ status: 404, error: 'Bible data not found' })
        }
      })

      // 모든 비동기 작업 완료를 기다림
      await Promise.all(promises)

      return NextResponse.json({ status: 200, data: response })
    } else {
      return NextResponse.json({ status: 404, error: 'Bible information not found' })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
