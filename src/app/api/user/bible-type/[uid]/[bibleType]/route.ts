import { doc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { firestore } from '@/libs/firebase'

import { BibleType } from '@/utils/enum'

export async function POST(req: NextRequest, context: { params: { uid: string; bibleType: BibleType } }) {
  const { params } = context
  const { uid, bibleType } = await params

  if (!uid || ![BibleType.REVISED, BibleType.EASY].includes(bibleType)) {
    return NextResponse.json({ status: 400, error: 'Invalid request' })
  }

  try {
    const userDocRef = doc(firestore, 'users', uid)
    await updateDoc(userDocRef, { bibleType })
    return NextResponse.json({ status: 200, message: 'Bible type updated successfully' })
  } catch (error) {
    console.error('Error updating bibleType:', error)
    return NextResponse.json({ status: 500, error: 'Internal Server Error' })
  }
}
