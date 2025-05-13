import { firestore } from '@/libs/firebase'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { uid, datePick, churchId, communityId } = body

    if (!uid || !datePick) {
      return NextResponse.json({ status: 400, message: 'uid 또는 datePick이 누락되었습니다.' })
    }

    const userRef =
      churchId && communityId
        ? doc(firestore, 'churches', churchId, 'communities', communityId, 'users', uid)
        : doc(firestore, 'users', uid)

    await updateDoc(userRef, {
      bibleReadingDates: arrayUnion(datePick),
    })

    return NextResponse.json({ status: 200, message: '읽음 상태가 저장되었습니다.' })
  } catch (error) {
    console.error('읽음 등록 오류:', error)
    return NextResponse.json({ status: 500, message: '서버 오류가 발생했습니다.' })
  }
}
