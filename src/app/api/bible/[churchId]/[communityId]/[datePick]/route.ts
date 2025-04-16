import { firestore } from '@/libs/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { churchId: string; communityId: string; datePick: string } },
) {
  const { churchId, communityId, datePick } = params

  try {
    const bibleDataRef = doc(firestore, 'churches', churchId, 'communities', communityId, 'biblePlan', datePick)
    const bibleDataSnap = await getDoc(bibleDataRef)

    if (!bibleDataSnap.exists()) {
      
      return NextResponse.json({ status: 404, error: 'Bible information not found' })
    }

    return NextResponse.json({ status: 200, data: bibleDataSnap.data().bibleInfo })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
