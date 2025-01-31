import { collection, getDocs } from 'firebase/firestore'
import moment from 'moment'
import { NextRequest, NextResponse } from 'next/server'

import { firestore } from '@/libs/firebase'

export async function GET(req: NextRequest) {
  try {
    const today = moment().startOf('day') // 오늘 날짜의 시작 (00:00:00)
    
    const biblePlanCollection = collection(firestore, 'biblePlan')
    const snapshot = await getDocs(biblePlanCollection)

    let totalChaptersUntilToday: number = 0 // 오늘까지 읽어야 하는 장 수
    let totalChapters: number = 0 // 전체 읽어야 하는 장 수

    snapshot.forEach((doc) => {
      const docDate = moment(doc.id, 'YYYY-MM-DD').startOf('day') // 문서의 날짜 변환
      const data = doc.data()

      if (data.bibleInfo) {
        const chapterCount = data.bibleInfo.length as number
        totalChapters += chapterCount

        // 오늘 날짜를 포함하여 진행률을 계산
        if (docDate.isSameOrBefore(today)) {
          totalChaptersUntilToday += chapterCount
        }
      }
    })

    // 진행률 계산
    const progressPercentage = totalChapters > 0 
      ? Math.round((totalChaptersUntilToday / totalChapters) * 100)
      : 0 // 전체 장 수가 0이면 진행률도 0%

    return NextResponse.json({
      status: 200,
      data: {
        totalChaptersUntilToday,
        totalChapters,
        progressPercentage,
      },
    })
  } catch (error) {
    console.error('Failed to fetch progress:', error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
