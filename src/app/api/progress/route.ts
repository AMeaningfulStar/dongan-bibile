import { firestore } from '@/libs/firebase'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // URL이 undefined인 경우 처리
  if (!req.url) {
    return NextResponse.json({ status: 400, error: '잘못된 요청입니다.' })
  }

  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')!
  const churchId = searchParams.get('churchId')!
  const communityId = searchParams.get('communityId')!
  const seasonId = searchParams.get('seasonId')!

  if (!uid) return NextResponse.json({ status: 400, message: 'uid가 필요합니다' })

  try {
    // 유저가 읽은 날짜
    const userRef = doc(firestore, 'churches', churchId, 'communities', communityId, 'users', uid)
    const userSnap = await getDoc(userRef)
    const readingDates: string[] = userSnap.exists() ? userSnap.data().bibleReadingDates ?? [] : []

    // 전체 등록된 biblePlan 날짜
    const allPlanSnap = await getDocs(
      collection(firestore, 'churches', churchId, 'communities', communityId, 'biblePlan'),
    )
    const allPlannedDates = allPlanSnap.docs.map((doc) => doc.id)

    const readDatesInYear = readingDates.filter((d) => allPlannedDates.includes(d))
    const yearProgress = allPlannedDates.length > 0 ? readDatesInYear.length / allPlannedDates.length : 0

    // 시즌 진행률 (biblePlan에서 실제 등록된 날짜 기준)
    let seasonProgress = null
    let readDatesInSeason: string[] = []
    let totalSeasonDays = 0

    if (churchId && communityId && seasonId) {
      // 시즌 내 등록된 성경 계획 날짜 가져오기
      const biblePlanQuery = query(
        collection(firestore, 'churches', churchId, 'communities', communityId, 'biblePlan'),
        where('seasonId', '==', seasonId),
      )
      const planSnap = await getDocs(biblePlanQuery)

      const seasonPlannedDates = planSnap.docs.map((doc) => doc.id) // YYYY-MM-DD 형식
      totalSeasonDays = seasonPlannedDates.length

      readDatesInSeason = readingDates.filter((d) => seasonPlannedDates.includes(d))

      if (totalSeasonDays > 0) {
        seasonProgress = readDatesInSeason.length / totalSeasonDays
      }
    }

    return NextResponse.json({
      status: 200,
      data: {
        yearProgress,
        readDatesInYear: readDatesInYear.length,
        totalPlannedDays: allPlannedDates.length,
        seasonProgress,
        readDatesInSeason,
        totalSeasonDays,
      },
    })
  } catch (error) {
    console.error('📉 진행률 API 오류:', error)
    return NextResponse.json({ status: 500, message: '서버 오류' })
  }
}
