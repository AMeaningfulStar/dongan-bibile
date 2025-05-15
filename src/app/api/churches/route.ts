import { firestore } from '@/libs/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const snapshot = await getDocs(collection(firestore, 'churches'))
    const churches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { name: string; createdAt?: any }),
    }))

    return NextResponse.json({ status: 200, data: churches })
  } catch (error) {
    console.error('교회 목록 조회 오류:', error)
    return NextResponse.json({ status: 500, message: '교회 목록을 불러오지 못했습니다.' })
  }
}
