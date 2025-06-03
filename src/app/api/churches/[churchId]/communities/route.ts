import { firestore } from '@/libs/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: {
    id: string
  }
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = params
    const snapshot = await getDocs(collection(firestore, 'churches', id, 'communities'))

    const communities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { name: string; createdAt?: any }),
    }))

    return NextResponse.json({ status: 200, data: communities })
  } catch (error) {
    console.error('공동체 목록 조회 오류:', error)
    return NextResponse.json({ status: 500, message: '공동체 목록을 불러오지 못했습니다.' })
  }
}
