import { firestore } from '@/libs/firebase'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  try {
    const keywordId = context.params.id
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('datePick')
    const churchId = searchParams.get('churchId')
    const communityId = searchParams.get('communityId')
    const uid = searchParams.get('uid')

    if (!date || !keywordId || !uid) {
      return NextResponse.json({ status: 400, message: '필수 항목이 누락되었습니다.' })
    }

    const basePath =
      churchId && communityId
        ? `churches/${churchId}/communities/${communityId}/keywords/${date}/keywords/${keywordId}`
        : `keywords/${date}/keywords/${keywordId}`

    const keywordRef = doc(firestore, basePath)
    const keywordSnap = await getDoc(keywordRef)

    if (!keywordSnap.exists()) {
      return NextResponse.json({ status: 404, message: '키워드를 찾을 수 없습니다.' })
    }

    const data = keywordSnap.data()
    const likes: string[] = data.likes ?? []
    const alreadyLiked = likes.includes(uid)

    await updateDoc(keywordRef, {
      likes: alreadyLiked ? arrayRemove(uid) : arrayUnion(uid),
    })

    return NextResponse.json({
      status: 200,
      message: alreadyLiked ? '좋아요를 취소했습니다.' : '좋아요를 등록했습니다.',
    })
  } catch (error) {
    console.error('좋아요 토글 오류:', error)
    return NextResponse.json({ status: 500, message: '서버 오류가 발생했습니다.' })
  }
}
