import { firestore } from '@/libs/firebase'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const keywordId = context.params.id
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('datePick')
    const churchId = searchParams.get('churchId')
    const communityId = searchParams.get('communityId')
    const uid = searchParams.get('uid')
    const role = searchParams.get('role') // 'admin', 'department_admin', etc

    if (!date || !keywordId || !uid || !role) {
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

    const isAdmin = role === 'admin' || role === 'department_admin'
    const isOwner = data.createdBy === uid

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ status: 403, message: '작성자 또는 관리자만 키워드를 삭제할 수 있습니다.' })
    }

    await deleteDoc(keywordRef)

    return NextResponse.json({ status: 200, message: '키워드가 삭제되었습니다.' })
  } catch (error) {
    console.error('키워드 삭제 오류:', error)
    return NextResponse.json({ status: 500, message: '서버 오류가 발생했습니다.' })
  }
}
