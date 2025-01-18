import { collection, getDocs } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { firestore } from '@/libs/firebase'

export async function GET(req: NextRequest, context: { params: { datePick: string } }) {
  const { params } = context
  const { datePick } = await params

  if (!datePick) {
    return NextResponse.json({ status: 400, error: 'Invalid request' })
  }

  try {
    const keywordsRef = collection(firestore, 'keywords', datePick, 'keywords')
    const snapshot = await getDocs(keywordsRef)

    const keywords = snapshot.docs.map((doc) => ({
      id: doc.id, // 키워드 이름
      createdBy: doc.data().createdBy,
      likes: doc.data().likes || [], // 좋아요 UID 배열
    }))

    return NextResponse.json({ status: 200, data: keywords })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
