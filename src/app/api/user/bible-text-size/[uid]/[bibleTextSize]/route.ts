import { doc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { firestore } from '@/libs/firebase'

import { BibleTextSize } from '@/utils/enum'

export async function POST(req: NextRequest, context: { params: { uid: string; bibleTextSize: BibleTextSize } }) {
  const { params } = context
  const { uid, bibleTextSize } = await params

  if (
    !uid ||
    ![BibleTextSize.XS, BibleTextSize.SM, BibleTextSize.BASE, BibleTextSize.LG, BibleTextSize.XL].includes(
      bibleTextSize,
    )
  ) {
    return NextResponse.json({ status: 400, error: 'Invalid request' })
  }

  try {
    const userDocRef = doc(firestore, 'users', uid)
    await updateDoc(userDocRef, { bibleTextSize })
    return NextResponse.json({ status: 200, message: 'Bible type updated successfully' })
  } catch (error) {
    console.error('Error updating bibleType:', error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
