import { firestore } from '@/libs/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // URL이 undefined인 경우 처리
  if (!req.url) {
    return NextResponse.json({ status: 400, error: '잘못된 요청입니다.' })
  }

  const { searchParams } = new URL(req.url)
  const datePick = searchParams.get('datePick')!
  const churchId = searchParams.get('churchId')
  const communityId = searchParams.get('communityId')

  try {
    let planDocRef

    if (churchId && communityId) {
      // 공동체 단위 계획
      planDocRef = doc(firestore, 'churches', churchId, 'communities', communityId, 'biblePlan', datePick)
    } else if (churchId) {
      // 교회 단위 계획 (선택 사항)
      planDocRef = doc(firestore, 'churches', churchId, 'biblePlan', datePick)
    } else {
      // 전역 기본 계획
      planDocRef = doc(firestore, 'bibleGlobalPlan', datePick)
    }

    const docSnap = await getDoc(planDocRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ status: 404, error: '해당 날짜에 대한 계획이 존재하지 않습니다.' })
    }

    return NextResponse.json({ status: 200, data: docSnap.data().bibleInfo })
  } catch (error) {
    console.error('"성경본문API" Error:', error)
    return NextResponse.json({ status: 500, error: '서버 연결을 실패했습니다.' })
  }
}
