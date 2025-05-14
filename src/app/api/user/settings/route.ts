import { firestore } from '@/libs/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { uid, bibleType, bibleTextSize } = body

    if (!uid || !bibleType || !bibleTextSize) {
      return NextResponse.json({ status: 400, message: '필수 항목이 누락되었습니다.' })
    }

    const userRef = doc(firestore, 'users', uid)

    await updateDoc(userRef, {
      bibleType,
      bibleTextSize,
    })

    return NextResponse.json({ status: 200, message: '설정이 저장되었습니다.' })
  } catch (error) {
    console.error('설정 업데이트 오류:', error)
    return NextResponse.json({ status: 500, message: '서버 오류가 발생했습니다.' })
  }
}
