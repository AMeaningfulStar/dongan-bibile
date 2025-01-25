import { firestore } from '@/libs/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { datePick: string; bibleType: string } }) {
  const { datePick, bibleType } = params

  try {
    // 1. biblePlan에서 datePick 문서 가져오기
    const bibleInfoRef = doc(firestore, 'biblePlan', datePick)
    const bibleInfoSnap = await getDoc(bibleInfoRef)

    if (!bibleInfoSnap.exists()) {
      return NextResponse.json({ status: 404, error: 'Bible information not found' })
    }

    const bibleInfoList = bibleInfoSnap.data() as {
      bibleInfo: Array<{
        book: string
        chapter: number
        testament: string
      }>
    }

    // 2. 필요한 책 목록을 추출하고 Firestore 쿼리를 최적화
    const bibleQueries = bibleInfoList.bibleInfo.map((info) => {
      return doc(firestore, 'bible', bibleType, info.testament, info.book)
    })

    // 3. Firestore에서 데이터 가져오기
    const bibleDataSnapshots = await Promise.all(bibleQueries.map((bibleRef) => getDoc(bibleRef)))

    const response = bibleDataSnapshots
      .filter((snap) => snap.exists())
      .map((snap, index) => {
        const bibleData = snap.data() as {
          title: string
          chapters: Array<{
            chapter: number
            verses: Array<{
              verse: number
              text: string
            }>
          }>
        }

        const chapterInfo = bibleData.chapters[bibleInfoList.bibleInfo[index].chapter - 1]

        return {
          title: bibleData.title,
          chapter: chapterInfo.chapter,
          verses: chapterInfo.verses,
        }
      })

    return NextResponse.json({ status: 200, data: response })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
