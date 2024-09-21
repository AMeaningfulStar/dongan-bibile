import { doc, getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { firestore } from '@/libs/firebase'

export async function GET(req: NextRequest, { params }: { params: { datePick: string } }) {
  const { datePick } = params

  try {
    const keywordListRef = doc(firestore, 'meditation', datePick)
    const keywordListSnap = await getDoc(keywordListRef)

    if (keywordListSnap.exists()) {
      const response: Array<{ text: string; likeCount: Array<string> }> = keywordListSnap.data().keywords

      const keywordList = response.map((item) => ({ text: item.text, likeCount: item.likeCount.length }))

      return NextResponse.json({ status: 200, data: keywordList })
    } else {
      return NextResponse.json({ status: 404, error: 'Keyword List not found' })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error: Keyword list' })
  }
}
