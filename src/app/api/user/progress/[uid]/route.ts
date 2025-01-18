import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { firestore } from '@/libs/firebase'

export async function GET(req: NextRequest, context: { params: { uid: string } }) {
  const { params } = context
  const { uid } = await params

  try {
    const biblePlanCollection = collection(firestore, 'biblePlan')
    const biblePlansnapshot = await getDocs(biblePlanCollection)

    const MyReadingCollection = doc(firestore, 'users', uid)
    const MyReadingsnapshot = await getDoc(MyReadingCollection)

    let totalChaptersUntilMy: number = 0 // 오늘까지 읽어야 하는 장 수
    let totalChapters: number = 0 // 전체 읽어야 하는 장 수

    if (MyReadingsnapshot.exists()) {
      const data = MyReadingsnapshot.data()
      totalChaptersUntilMy = data.bibleReadingDates.length || 0 // Return the dates or an empty array
    } else {
      console.error(`No user document found with uid: ${uid}`)
    }

    // 전체 읽어야 하는 장 수
    biblePlansnapshot.forEach((doc) => {
      const data = doc.data()

      if (data.bibleInfo) {
        const chapterCount = data.bibleInfo.length as number
        totalChapters += chapterCount
      }
    })

    // 진행률 계산
    const progressPercentage = Math.round((totalChaptersUntilMy / totalChapters) * 100)

    return NextResponse.json({
      status: 200,
      data: {
        totalChaptersUntilMy: totalChaptersUntilMy,
        totalChapters: totalChapters,
        progressPercentage: progressPercentage,
      },
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
