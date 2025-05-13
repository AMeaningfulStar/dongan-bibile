import { firestore } from '@/libs/firebase'
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { datePick, churchId, communityId, keyword, uid } = body

    if (!datePick || !keyword || !uid) {
      return NextResponse.json({ status: 400, message: '필수 값이 누락되었습니다.' })
    }

    const keywordId = keyword.trim()
    if (keywordId === '') {
      return NextResponse.json({ status: 400, message: '빈 키워드는 저장할 수 없습니다.' })
    }

    const basePath =
      churchId && communityId
        ? `churches/${churchId}/communities/${communityId}/keywords/${datePick}/keywords/${keywordId}`
        : `keywords/${datePick}/keywords/${keywordId}`

    const keywordRef = doc(firestore, basePath)
    const existing = await getDoc(keywordRef)

    if (existing.exists()) {
      return NextResponse.json({ status: 409, message: '이미 등록된 키워드입니다.' })
    }

    await setDoc(keywordRef, {
      createdBy: uid,
      likes: [uid],
      createdAt: serverTimestamp(),
    })

    return NextResponse.json({ status: 201, message: '키워드가 등록되었습니다.' })
  } catch (error) {
    console.error('키워드 등록 오류:', error)
    return NextResponse.json({ status: 500, message: '서버 오류가 발생했습니다.' })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('datePick')
    const churchId = searchParams.get('churchId')
    const communityId = searchParams.get('communityId')

    if (!date) {
      return NextResponse.json({ status: 400, message: 'datePick은 필수입니다.' })
    }

    const basePath =
      churchId && communityId
        ? `churches/${churchId}/communities/${communityId}/keywords/${date}/keywords`
        : `keywords/${date}/keywords`

    const snapshot = await getDocs(collection(firestore, basePath))

    const keywords = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({
      status: 200,
      data: keywords,
    })
  } catch (error) {
    console.error('키워드 목록 불러오기 오류:', error)
    return NextResponse.json({ status: 500, message: '서버 오류가 발생했습니다.' })
  }
}
