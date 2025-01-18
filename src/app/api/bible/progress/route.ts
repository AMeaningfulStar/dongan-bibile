import { collection, getDocs } from 'firebase/firestore'
import moment from 'moment'
import { NextRequest, NextResponse } from 'next/server'

import { firestore } from '@/libs/firebase'

export async function GET(req: NextRequest) {
  try {
    const today = moment(new Date()).format('YYYY-MM-DD')

    const biblePlanCollection = collection(firestore, 'biblePlan')
    const snapshot = await getDocs(biblePlanCollection)

    let totalChaptersUntilToday: number = 0 // 오늘까지 읽어야 하는 장 수
    let totalChapters: number = 0 // 전체 읽어야 하는 장 수 (260장)

    snapshot.forEach((doc) => {
      const date = doc.id // 'YYYY-MM-DD' 형식의 문서 이름
      const data = doc.data()

      if (data.bibleInfo) {
        const chapterCount = data.bibleInfo.length as number
        totalChapters += chapterCount

        // 오늘 날짜 이전이라면 읽어야 하는 장 수로 추가
        if (date <= today) {
          totalChaptersUntilToday += chapterCount
        }
      }
    })

    // 진행률 계산
    const progressPercentage = Math.round((totalChaptersUntilToday / totalChapters) * 100)

    return NextResponse.json({
      status: 200,
      data: {
        totalChaptersUntilToday: totalChaptersUntilToday,
        totalChapters: totalChapters,
        progressPercentage: progressPercentage,
      },
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
